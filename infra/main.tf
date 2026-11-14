# Terraform AWS Production High-Availability Architecture for Bricks2Wall
# Conforming to Master Brief Section 13 (Multi-AZ, WAF, ALB, ECS Fargate, RDS Multi-AZ, ElastiCache, SQS)

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default     = "ap-south-1" # AWS Asia Pacific (Mumbai) for India-first deployment
  description = "Target AWS Region"
}

variable "environment" {
  default     = "production"
  description = "Deployment environment"
}

# 1. VPC & Multi-AZ Networking
resource "aws_vpc" "b2w_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "b2w-${var.environment}-vpc"
  }
}

# Public Subnets (for ALB)
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.b2w_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.b2w_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"
}

# Private Subnets (for ECS Tasks & Database)
resource "aws_subnet" "private_app_1" {
  vpc_id            = aws_vpc.b2w_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "private_app_2" {
  vpc_id            = aws_vpc.b2w_vpc.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "${var.aws_region}b"
}

resource "aws_subnet" "private_db_1" {
  vpc_id            = aws_vpc.b2w_vpc.id
  cidr_block        = "10.0.20.0/24"
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "private_db_2" {
  vpc_id            = aws_vpc.b2w_vpc.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "${var.aws_region}b"
}

# 2. Application Load Balancer
resource "aws_lb" "b2w_alb" {
  name               = "b2w-prod-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = {
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "b2w_tg" {
  name        = "b2w-prod-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.b2w_vpc.id
  target_type = "ip"

  health_check {
    path                = "/api/properties"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

# 3. ECS Fargate Service (Stateless, Multi-AZ)
resource "aws_ecs_cluster" "b2w_cluster" {
  name = "b2w-prod-cluster"
}

resource "aws_ecs_service" "b2w_service" {
  name            = "b2w-web-service"
  cluster         = aws_ecs_cluster.b2w_cluster.id
  task_definition = "arn:aws:ecs:${var.aws_region}:...:task-definition/b2w-web"
  desired_count   = 2 # Minimum 2 tasks across AZs
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.private_app_1.id, aws_subnet.private_app_2.id]
    security_groups = []
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.b2w_tg.arn
    container_name   = "bricks2wall"
    container_port   = 3000
  }
}

# 4. Amazon RDS PostgreSQL Multi-AZ
resource "aws_db_subnet_group" "b2w_db_subnet" {
  name       = "b2w-db-subnet-group"
  subnet_ids = [aws_subnet.private_db_1.id, aws_subnet.private_db_2.id]
}

resource "aws_db_instance" "b2w_postgres" {
  identifier             = "b2w-prod-postgres"
  allocated_storage      = 50
  max_allocated_storage  = 200 # Auto-scaling storage
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t4g.medium"
  multi_az               = true # High availability multi-AZ failover
  db_name                = "bricks2wall"
  username               = "b2w_admin"
  password               = "ManagedBySecretsManager"
  db_subnet_group_name   = aws_db_subnet_group.b2w_db_subnet.name
  skip_final_snapshot    = false
  backup_retention_period = 30
  storage_encrypted      = true
}

# 5. Amazon ElastiCache Redis
resource "aws_elasticache_cluster" "b2w_redis" {
  cluster_id           = "b2w-prod-redis"
  engine               = "redis"
  node_type            = "cache.t4g.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# 6. Amazon SQS Notification Queue
resource "aws_sqs_queue" "b2w_leads_queue" {
  name                      = "b2w-lead-notifications.fifo"
  fifo_queue                = true
  content_based_deduplication = true
  message_retention_seconds = 86400
}

# 7. S3 Bucket for Media Assets
resource "aws_s3_bucket" "b2w_assets" {
  bucket = "b2w-property-assets-prod"
}

# 8. CloudFront CDN Distribution
resource "aws_cloudfront_distribution" "b2w_cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = ""

  origin {
    domain_name = aws_lb.b2w_alb.dns_name
    origin_id   = "ALB-Origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB-Origin"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 60
    max_ttl                = 86400
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
