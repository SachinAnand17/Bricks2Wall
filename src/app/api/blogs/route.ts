import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/db';
import { getDb } from '@/lib/mongodb';
import { slugify } from '@/lib/utils';
import { InsightArticle } from '@/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getLocalArticles(): InsightArticle[] {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        return data.articles;
      }
    }
  } catch (e) {
    // ignore
  }
  return getArticles();
}

function saveLocalArticle(article: InsightArticle) {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (!Array.isArray(data.articles)) {
        data.articles = [];
      }
      data.articles = [article, ...data.articles.filter((a: any) => a.id !== article.id)];
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    }
  } catch (e) {
    console.error('Error saving local article:', e);
  }
}

function deleteLocalArticle(id: string) {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(data.articles)) {
        data.articles = data.articles.filter((a: any) => a.id !== id && a.slug !== id);
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
      }
    }
  } catch (e) {
    console.error('Error deleting local article:', e);
  }
}

// GET: Fetch all blog posts sorted newest-first
export async function GET(request: NextRequest) {
  try {
    // 1. Try fetching from MongoDB Atlas
    try {
      const db = await getDb();
      let blogs = await db
        .collection('blogs')
        .find({})
        .sort({ createdAt: -1, publishedAt: -1 })
        .toArray();

      if (blogs.length > 0) {
        const mapped = blogs.map((doc: any) => {
          const { _id, ...rest } = doc;
          return {
            ...rest,
            id: rest.id || _id.toString(),
          };
        });

        return NextResponse.json({
          success: true,
          count: mapped.length,
          blogs: mapped,
          source: 'mongodb',
        });
      }
    } catch (mongoErr: any) {
      console.warn('MongoDB query warning in /api/blogs GET, using local fallback:', mongoErr.message);
    }

    // 2. Local Fallback
    const local = getLocalArticles();
    return NextResponse.json({
      success: true,
      count: local.length,
      blogs: local,
      source: 'local',
    });
  } catch (err: any) {
    console.error('Error in GET /api/blogs:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Insert a new blog post document with createdAt: new Date()
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Blog title is required.' }, { status: 400 });
    }

    const now = new Date();
    const slug = body.slug
      ? slugify(body.slug)
      : `${slugify(body.title)}-${Date.now().toString().slice(-4)}`;

    const newBlog: InsightArticle = {
      id: body.id || `art-${Date.now()}`,
      slug,
      title: body.title,
      category: (body.category as InsightArticle['category']) || 'Market Trends',
      readTime: body.readTime || '5 min read',
      publishedAt: body.publishedAt || now.toISOString().split('T')[0],
      excerpt: body.excerpt || '',
      content: body.content || body.excerpt || '',
      heroImageUrl:
        body.heroImageUrl ||
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      authorName: (body.author && body.author.name) || body.authorName || 'Sachin Anand',
      authorRole: (body.author && body.author.role) || body.authorRole || 'Founder & Principal Advisor',
    };

    let persistedInMongo = false;
    try {
      const db = await getDb();
      await db.collection('blogs').insertOne({
        ...newBlog,
        createdAt: now,
        updatedAt: now,
      });
      persistedInMongo = true;
    } catch (mongoErr: any) {
      console.warn('MongoDB insert warning in /api/blogs POST, using local fallback:', mongoErr.message);
    }

    // Always mirror to local store
    saveLocalArticle(newBlog);

    return NextResponse.json(
      {
        success: true,
        message: 'Blog post published successfully',
        blog: newBlog,
        persistedInMongo,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/blogs:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to publish blog' }, { status: 500 });
  }
}

// DELETE: Remove blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog ID is required.' }, { status: 400 });
    }

    try {
      const db = await getDb();
      await db.collection('blogs').deleteOne({
        $or: [{ id: id }, { slug: id }],
      });
    } catch (mongoErr: any) {
      console.warn('MongoDB delete warning in /api/blogs DELETE:', mongoErr.message);
    }

    deleteLocalArticle(id);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (err: any) {
    console.error('Error in DELETE /api/blogs:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to delete blog' }, { status: 500 });
  }
}
