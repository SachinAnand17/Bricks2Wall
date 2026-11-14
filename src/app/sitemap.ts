import { MetadataRoute } from 'next';
import { getProperties, getLocations, getArticles, getAgents } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bricks2wall.com';
  const now = new Date();

  // Static core routes
  const staticRoutes = [
    '',
    '/properties',
    '/properties/buy',
    '/properties/rent',
    '/properties/commercial',
    '/locations',
    '/services',
    '/about',
    '/agents',
    '/insights',
    '/contact',
    '/book-a-visit',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic property routes
  const properties = getProperties();
  const propertyRoutes = properties.map((prop) => ({
    url: `${baseUrl}/properties/${prop.slug}`,
    lastModified: new Date(prop.updatedAt || now),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic location routes
  const locations = getLocations();
  const locationRoutes = locations.map((loc) => ({
    url: `${baseUrl}/locations/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic article routes
  const articles = getArticles();
  const articleRoutes = articles.map((art) => ({
    url: `${baseUrl}/insights/${art.slug}`,
    lastModified: new Date(art.publishedAt || now),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic agent routes
  const agents = getAgents();
  const agentRoutes = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...locationRoutes,
    ...articleRoutes,
    ...agentRoutes,
  ];
}
