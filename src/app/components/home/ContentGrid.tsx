'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Content } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';

interface ContentGridProps {
  content: Content[];
  loading: boolean;
}

export default function ContentGrid({ content, loading }: ContentGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No content available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {content.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/content/${item.id}`}>
            <Card className="h-full cursor-pointer card-hover">
              {item.type === 'VIDEO' ? (
                <div className="relative">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-primary uppercase">
                    {item.cropType}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    By {item.admin?.name || 'Admin'}
                  </span>
                  <span className="text-sm text-primary">
                    {item.views} views
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}