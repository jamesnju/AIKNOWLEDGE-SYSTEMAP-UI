'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiFilter, FiCalendar, FiEye, FiPlay } from 'react-icons/fi';

import toast from 'react-hot-toast';
import { Content } from '../../types';
import { contentService } from '../../services/content';

export default function ContentSection() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCrop, setSelectedCrop] = useState<string>("ALL");

  const cropTypes = ["ALL", "MAIZE", "TOMATO", "VEGETABLE", "FRUIT", "GENERAL"];
  const contentTypes = ["ALL", "IMAGE", "VIDEO"];

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
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = [...contents];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (selectedType !== "ALL") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }
    if (selectedCrop !== "ALL") {
      filtered = filtered.filter((item) => item.cropType === selectedCrop);
    }
    setFilteredContents(filtered);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-green-600 mb-4">Farming Resources</h2>
          <p className="text-gray-600 text-lg">Explore our collection of farming guides and tutorials</p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-4 mb-8 sticky top-20 z-40">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <FiFilter size={18} />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "ALL" ? "All Types" : type}
                  </option>
                ))}
              </select>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              >
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop === "ALL" ? "All Crops" : crop}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Found {filteredContents.length} resources
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading amazing content...</p>
            </div>
          </div>
        ) : filteredContents.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
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
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {content.type === "VIDEO" ? (
                        <>
                          <img
                            src={content.thumbnail || content.url}
                            alt={content.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <FiPlay className="text-green-600 ml-1" size={28} />
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
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          content.type === "VIDEO" ? "bg-blue-500" : "bg-green-500"
                        } text-white backdrop-blur-sm`}>
                          {content.type === "VIDEO" ? "📹 Video" : "🖼️ Image"}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                          {content.cropType}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {content.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{content.description}</p>
                      {content.pestType && content.pestType !== "NONE" && (
                        <div className="mb-4">
                          <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                            🐛 Pest: {content.pestType}
                          </span>
                        </div>
                      )}
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
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}