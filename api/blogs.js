const { getDb } = require('../lib/mongodb');
const fs = require('fs');
const path = require('path');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getLocalArticles() {
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
  return [];
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch all blog posts sorted newest-first
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      let blogs = await db
        .collection('blogs')
        .find({})
        .sort({ createdAt: -1, publishedAt: -1 })
        .toArray();

      // If empty, seed with initial articles from local database
      if (blogs.length === 0) {
        const localArticles = getLocalArticles();
        if (localArticles.length > 0) {
          try {
            await db.collection('blogs').insertMany(
              localArticles.map((a) => ({
                ...a,
                createdAt: a.publishedAt ? new Date(a.publishedAt) : new Date(),
              }))
            );
            blogs = await db
              .collection('blogs')
              .find({})
              .sort({ createdAt: -1 })
              .toArray();
          } catch (seedErr) {
            blogs = localArticles;
          }
        }
      }

      return res.status(200).json({
        success: true,
        count: blogs.length,
        blogs,
      });
    } catch (err) {
      console.warn('MongoDB query failed in api/blogs.js, using local fallback:', err.message);
      const fallback = getLocalArticles();
      return res.status(200).json({
        success: true,
        count: fallback.length,
        blogs: fallback,
        warning: 'Served from cache/fallback: ' + err.message,
      });
    }
  }

  // POST: Insert a new blog post with createdAt: new Date()
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      }

      if (!body.title) {
        return res.status(400).json({ success: false, error: 'Blog title is required.' });
      }

      const now = new Date();
      const slug = body.slug
        ? slugify(body.slug)
        : `${slugify(body.title)}-${Date.now().toString().slice(-4)}`;

      const newBlog = {
        id: body.id || `art-${Date.now()}`,
        slug,
        title: body.title,
        category: body.category || 'Market Trends',
        readTime: body.readTime || '5 min read',
        publishedAt: body.publishedAt || now.toISOString().split('T')[0],
        excerpt: body.excerpt || '',
        content: body.content || '',
        heroImageUrl:
          body.heroImageUrl ||
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
        author: {
          name: (body.author && body.author.name) || 'Sachin Anand',
          role: (body.author && body.author.role) || 'Founder & Principal Advisor',
          avatarUrl:
            (body.author && body.author.avatarUrl) ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        tags: Array.isArray(body.tags) ? body.tags : ['Real Estate', 'Advisory', 'Market Insights'],
        createdAt: now,
        updatedAt: now,
      };

      try {
        const db = await getDb();
        const result = await db.collection('blogs').insertOne(newBlog);
        newBlog._id = result.insertedId;
      } catch (dbErr) {
        console.warn('MongoDB insert failed, persisting to local store:', dbErr.message);
        try {
          const dbPath = path.join(process.cwd(), 'data', 'database.json');
          if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            data.articles = [newBlog, ...(data.articles || [])];
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
          }
        } catch (localErr) {
          console.error('Local fallback failed:', localErr);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Blog post published successfully',
        blog: newBlog,
      });
    } catch (err) {
      console.error('Error in POST api/blogs:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Remove blog post
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || (req.body && req.body.id);
      if (!id) {
        return res.status(400).json({ success: false, error: 'Blog ID is required for deletion.' });
      }

      try {
        const db = await getDb();
        await db.collection('blogs').deleteOne({ id });
      } catch (dbErr) {
        console.warn('MongoDB delete failed:', dbErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
