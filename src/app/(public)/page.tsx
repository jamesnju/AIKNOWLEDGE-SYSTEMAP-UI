'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import ContentGrid from '../components/home/ContentGrid';
import { contentService } from '../services/content';
import { Content } from '../types';
import toast from 'react-hot-toast';
import StatsSection from '../components/home/StatsSection';
import FeaturesSection from '../components/home/FeaturesSection';

export default function Home() {
  const [recentContent, setRecentContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentContent();
  }, []);

  const fetchRecentContent = async () => {
    try {
      const response = await contentService.getAllContent();
      if (response.success && response.data) {
        setRecentContent(response.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-primary mb-4">
              Latest Agricultural Content
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover expert insights, farming techniques, and pest management strategies
            </p>
          </motion.div>
          <ContentGrid content={recentContent} loading={loading} />
        </div>
      </section>
    </main>
  );
}