'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { contentService } from '../../../services/content';
import { Content } from '../../../types';
import { motion } from 'framer-motion';
import { FiFileText, FiEye, FiCalendar, FiUsers } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    views: 0,
    videos: 0,
    images: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await contentService.getAllContent();
      if (response.success && response.data) {
        setContents(response.data);
        const videos = response.data.filter(c => c.type === 'VIDEO').length;
        const images = response.data.filter(c => c.type === 'IMAGE').length;
        const totalViews = response.data.reduce((sum, c) => sum + c.views, 0);
        
        setStats({
          total: response.data.length,
          views: totalViews,
          videos,
          images,
        });
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const statsCards = [
    { title: 'Total Content', value: stats.total, icon: FiFileText, color: 'bg-primary' },
    { title: 'Total Views', value: stats.views, icon: FiEye, color: 'bg-secondary' },
    { title: 'Videos', value: stats.videos, icon: FiCalendar, color: 'bg-blue-500' },
    { title: 'Images', value: stats.images, icon: FiUsers, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {admin?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your content today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Content</h2>
          <Link
            href="/admin/content/create"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create New Content
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Crop Type</th>
                <th className="text-left py-3 px-4">Views</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contents.slice(0, 5).map((content) => (
                <tr key={content.id} className="border-t">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{content.title}</p>
                      <p className="text-sm text-gray-500">{content.description.substring(0, 50)}...</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      content.type === 'VIDEO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {content.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{content.cropType}</td>
                  <td className="py-3 px-4">{content.views}</td>
                  <td className="py-3 px-4">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/content/edit/${content.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure?')) {
                            await contentService.deleteContent(content.id);
                            toast.success('Content deleted');
                            fetchData();
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}