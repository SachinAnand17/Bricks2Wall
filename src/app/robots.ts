import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/thank-you',
        '/search',
      ],
    },
    sitemap: 'https://bricks2wall.com/sitemap.xml',
  };
}
