'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  author: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/news?slug=${slug}`);
      const data = await res.json();
      
      if (data.ok) {
        setArticle(data.data);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            href="/news"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Featured Image */}
      {article.imageUrl ? (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link href="/news" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to News
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {article.title}
                </h1>
                <div className="text-white/90">
                  {formatDate(article.publishedAt || article.createdAt)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/news" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to News
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {article.title}
              </h1>
              <div className="text-xl opacity-90">
                {formatDate(article.publishedAt || article.createdAt)}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.article
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Excerpt as lead paragraph if exists */}
            {article.excerpt && (
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                {article.excerpt}
              </p>
            )}

            {/* Main Content */}
            <div
              className="text-gray-800 leading-relaxed space-y-4"
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
            />
          </motion.article>

          {/* Share Section */}
          <motion.div
            className="mt-12 pt-8 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500">
                Published by {article.author}
              </div>
              <Link
                href="/news"
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                View All News
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
