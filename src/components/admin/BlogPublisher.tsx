'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Trash2, ExternalLink, BookOpen, Clock, Tag, RefreshCw, X, Loader2, Sparkles } from 'lucide-react';
import { InsightArticle } from '@/types';

interface BlogPublisherProps {
  onRefreshParent?: () => void;
}

export default function BlogPublisher({ onRefreshParent }: BlogPublisherProps) {
  const [blogs, setBlogs] = useState<InsightArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Market Trends',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    heroImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Sachin Anand',
    authorRole: 'Founder & Principal Advisor',
    tags: 'Real Estate, Advisory, Market Insights',
  });

  const categories: Array<InsightArticle['category']> = [
    'Market Trends',
    'Buying Guide',
    'Documentation',
    'Investment',
  ];

  const heroPresets = [
    { label: 'Modern Architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Luxury Apartment', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Urban Skyline', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Executive Interior', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  ];

  const fetchBlogs = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        }
      }
    } catch (err) {
      console.error('Error fetching blogs in publisher:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Article title is required.');
      return;
    }
    if (!formData.excerpt.trim()) {
      setErrorMsg('Please provide a brief excerpt or summary.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        readTime: formData.readTime.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim() || formData.excerpt.trim(),
        heroImageUrl: formData.heroImageUrl.trim(),
        author: {
          name: formData.authorName.trim(),
          role: formData.authorRole.trim(),
        },
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Article published successfully and saved to MongoDB Atlas!');
        setFormData({
          title: '',
          category: 'Market Trends',
          readTime: '5 min read',
          excerpt: '',
          content: '',
          heroImageUrl: heroPresets[0].url,
          authorName: 'Sachin Anand',
          authorRole: 'Founder & Principal Advisor',
          tags: 'Real Estate, Advisory, Market Insights',
        });
        setModalOpen(false);
        fetchBlogs();
        if (onRefreshParent) onRefreshParent();
      } else {
        setErrorMsg(data.error || 'Failed to publish article.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with publishing API.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id && b.slug !== id));
      } else {
        alert('Failed to delete blog post.');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      alert('Error communicating with delete endpoint.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-navy-deep/40 backdrop-blur-md p-5 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-gold-champagne text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Editorial Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-white font-medium mt-1">
            Blog & Insights Publisher
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Create and manage thought leadership articles. All entries persist to MongoDB Atlas and sync live with /insights.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBlogs}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-champagne text-navy-midnight text-xs font-semibold hover:bg-gold-light transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Article</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Blog Cards List */}
      {loading ? (
        <div className="bg-navy-deep/20 rounded-2xl border border-white/10 p-12 text-center text-white/60">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-champagne mb-2" />
          <p className="text-xs">Loading articles from MongoDB Atlas...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-navy-deep/20 rounded-2xl border border-white/10 p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-gold-champagne/60 mx-auto" />
          <h3 className="font-serif text-lg text-white font-medium">No Articles Published Yet</h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            Get started by publishing your first market advisory or RERA compliance guide.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-champagne text-navy-midnight text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((b) => (
            <div
              key={b.id || b.slug}
              className="bg-navy-deep/30 rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-gold-champagne/40 transition-all duration-300 group"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-navy-midnight">
                  <Image
                    src={b.heroImageUrl || heroPresets[0].url}
                    alt={b.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-navy-midnight/90 backdrop-blur-sm text-[10px] font-semibold text-gold-champagne border border-gold-champagne/30">
                    {b.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
                    <Clock className="w-3 h-3 text-gold-champagne" />
                    <span>{b.readTime || '5 min'}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[10px] text-white/50">
                    Published: {b.publishedAt || 'Recent'}
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-gold-champagne transition-colors">
                    {b.title}
                  </h4>
                  <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <Link
                  href={`/insights/${b.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-gold-champagne hover:text-white transition-colors text-[11px] font-medium"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publisher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-midnight/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-navy-deep border border-gold-champagne/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold-champagne/10 border border-gold-champagne/30 text-gold-champagne">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-white">
                    Publish New Market Insight
                  </h3>
                  <p className="text-xs text-white/60">
                    Saves directly to MongoDB Atlas cluster `bricks2wall` collection
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Navigating Land Title Due Diligence in 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-gold-champagne"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-midnight border border-white/15 text-white text-xs focus:outline-none focus:border-gold-champagne"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-navy-midnight text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-gold-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                  Executive Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise 2-sentence summary highlighting key advisory recommendations..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-gold-champagne"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                  Full Article Body (Markdown Supported)
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed guidance, sections, checklists, legal requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-gold-champagne font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={formData.heroImageUrl}
                  onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-gold-champagne"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {heroPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, heroImageUrl: preset.url })}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                        formData.heroImageUrl === preset.url
                          ? 'bg-gold-champagne text-navy-midnight font-semibold border-gold-champagne'
                          : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-gold-champagne"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-1.5">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-gold-champagne"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gold-champagne hover:bg-gold-light text-navy-midnight text-xs font-semibold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Publishing...' : 'Publish to MongoDB & Live'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
