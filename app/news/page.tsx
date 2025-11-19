'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.ok) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              News & Updates
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Stay informed about the latest from Asian Shipping Thailand
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Articles Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading news...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No News Yet</h2>
              <p className="text-gray-600">Check back soon for updates and announcements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/news/${article.slug}`}>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Featured Image */}
                      {article.imageUrl ? (
                        <div className="h-48 overflow-hidden bg-gray-200">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                          <div className="text-white text-6xl">📰</div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Date */}
                        <div className="text-sm text-gray-500 mb-2">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-red-600 transition-colors line-clamp-2">
                          {article.title}
                        </h2>

                        {/* Excerpt */}
                        {article.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                            {article.excerpt}
                          </p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center text-red-600 font-semibold mt-auto">
                          Read More
                          <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
