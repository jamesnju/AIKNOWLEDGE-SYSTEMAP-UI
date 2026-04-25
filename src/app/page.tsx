'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiEye, FiCalendar, FiPlay, FiImage, FiSearch, FiFilter } from 'react-icons/fi';
import { contentService } from './services/content';
import { Content } from './types';
import toast from 'react-hot-toast';

export default function Home() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [searchTerm, selectedType, selectedCrop, contents]);

  const fetchContents = async () => {
    try {
      const response = await contentService.getAllContent();
      if (response.success && response.data) {
        setContents(response.data);
        setFilteredContents(response.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = [...contents];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Filter by crop type
    if (selectedCrop !== 'ALL') {
      filtered = filtered.filter((item) => item.cropType === selectedCrop);
    }

    setFilteredContents(filtered);
  };

  const cropTypes = ['ALL', 'MAIZE', 'TOMATO', 'VEGETABLE', 'FRUIT', 'GENERAL'];
  const contentTypes = ['ALL', 'IMAGE', 'VIDEO'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container-custom py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">AgriPoa</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Empowering African farmers with expert knowledge and sustainable farming solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
                <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-40 bg-white shadow-md py-4">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <FiFilter size={18} />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'ALL' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
              >
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop === 'ALL' ? 'All Crops' : crop}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Found {filteredContents.length} {filteredContents.length === 1 ? 'resource' : 'resources'}
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid Section */}
      <section className="py-16">
        <div className="container-custom">
          {filteredContents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContents.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/content/${content.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Media Container */}
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        {content.type === 'VIDEO' ? (
                          <>
                            <img
                              src={content.thumbnail || content.url}
                              alt={content.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                <FiPlay className="text-primary ml-1" size={28} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={content.url}
                            alt={content.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        
                        {/* Type Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            content.type === 'VIDEO' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-green-500 text-white'
                          }`}>
                            {content.type === 'VIDEO' ? (
                              <span className="flex items-center gap-1">
                                <FiPlay size={12} /> Video
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FiImage size={12} /> Image
                              </span>
                            )}
                          </span>
                        </div>
                        
                        {/* Crop Type Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {content.cropType}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {content.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {content.description}
                        </p>
                        
                        {/* Pest Type */}
                        {content.pestType && content.pestType !== 'NONE' && (
                          <div className="mb-4">
                            <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                              Pest: {content.pestType}
                            </span>
                          </div>
                        )}
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiCalendar size={14} />
                            <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FiEye size={14} />
                            <span>{content.views} views</span>
                          </div>
                        </div>
                        
                        {/* Author */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary text-xs font-bold">
                              {content.admin?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            By {content.admin?.name || 'Admin'}
                          </span>
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

      {/* CTA Section */}
      {filteredContents.length > 0 && (
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 mt-8">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to contribute?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our community of experts and help us educate farmers across Africa
            </p>
            <Link
              href="/admin/register"
              className="inline-block bg-yellow-400 text-primary px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors transform hover:scale-105"
            >
              Become a Contributor
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}