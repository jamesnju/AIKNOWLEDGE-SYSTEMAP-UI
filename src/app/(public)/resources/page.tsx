'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiEye, 
  FiPlay, 
  FiImage,
  FiDownload,
  FiBookmark,
  FiShare2,
  FiThumbsUp,
  FiMessageCircle,
  FiTrendingUp,
  FiZap,
  FiClock,
  FiUser,
  FiTag,
  FiChevronRight,
  FiGrid,
  FiList,
  FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { contentService } from '../../services/content';
import { Content } from '../../types';
import AIChatbot from '../aisection/page';

export default function ResourcesPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCrop, setSelectedCrop] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "oldest">("newest");

  const cropTypes = ["ALL", "MAIZE", "TOMATO", "VEGETABLE", "FRUIT", "GENERAL"];
  const contentTypes = ["ALL", "IMAGE", "VIDEO"];
  const categories = ["ALL", "DISEASE", "PEST", "FERTILIZER", "IRRIGATION", "HARVESTING", "STORAGE"];

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterAndSortContents();
  }, [searchTerm, selectedType, selectedCrop, selectedCategory, sortBy, contents]);

  const fetchContents = async () => {
    try {
      const response = await contentService.getAllContent();
      if (response.success && response.data) {
        setContents(response.data);
        setFilteredContents(response.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortContents = () => {
    let filtered = [...contents];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== "ALL") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Apply crop filter
    if (selectedCrop !== "ALL") {
      filtered = filtered.filter((item) => item.cropType === selectedCrop);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    setFilteredContents(filtered);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("ALL");
    setSelectedCrop("ALL");
    setSelectedCategory("ALL");
    setSortBy("newest");
    toast.success("Filters reset!");
  };

  const featuredContent = contents.slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="bg-yellow-400 text-green-600 px-4 py-2 rounded-full text-sm font-bold">
                Farming Resources
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Knowledge Hub for Farmers
            </h1>
            <p className="text-lg md:text-xl text-gray-100">
              Access expert guides, tutorials, and resources to improve your farming
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container-custom py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{filteredContents.length}</span> resources available
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded transition-colors ${viewMode === "grid" ? "text-green-600 bg-green-50" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded transition-colors ${viewMode === "list" ? "text-green-600 bg-green-50" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest First</option>
              </select>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiSearch className="text-green-600" />
                  Search
                </h3>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Content Type Filter */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiFilter className="text-green-600" />
                  Content Type
                </h3>
                <div className="space-y-2">
                  {contentTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {type === "ALL" ? "All Types" : type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Crop Type Filter */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiTag className="text-green-600" />
                  Crop Type
                </h3>
                <div className="space-y-2">
                  {cropTypes.map((crop) => (
                    <label key={crop} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="crop"
                        value={crop}
                        checked={selectedCrop === crop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {crop === "ALL" ? "All Crops" : crop}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5">
                <h3 className="font-semibold text-green-800 mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Use specific crop names for better results</li>
                  <li>• Check back weekly for new resources</li>
                  <li>• Bookmark helpful guides for later</li>
                  <li>• Share resources with fellow farmers</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Section */}
            {featuredContent.length > 0 && searchTerm === "" && selectedType === "ALL" && selectedCrop === "ALL" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiZap className="text-yellow-500" />
                  Featured Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {featuredContent.map((content, idx) => (
                    <Link key={content.id} href={`/content/${content.id}`}>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={content.thumbnail || content.url}
                            alt={content.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-semibold">View Resource →</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold line-clamp-2">{content.title}</h3>
                          <p className="text-green-100 text-xs mt-2">Featured Guide</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-gray-600">Loading resources...</p>
                </div>
              </div>
            ) : filteredContents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search term</p>
                <button
                  onClick={resetFilters}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-500">
                  Showing {filteredContents.length} results
                </div>

                {/* Content Grid/List */}
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                  : "space-y-4"
                }>
                  {filteredContents.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: viewMode === "grid" ? -5 : 0 }}
                      className="group"
                    >
                      <Link href={`/content/${content.id}`}>
                        <div className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                          viewMode === "list" ? "flex" : ""
                        }`}>
                          {/* Image Section */}
                          <div className={`relative overflow-hidden bg-gray-100 ${
                            viewMode === "grid" ? "h-48" : "w-48 h-32 flex-shrink-0"
                          }`}>
                            {content.type === "VIDEO" ? (
                              <>
                                <img
                                  src={content.thumbnail || content.url}
                                  alt={content.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <FiPlay className="text-green-600 ml-0.5" size={16} />
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
                            <div className="absolute top-2 left-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                content.type === "VIDEO"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              } text-white`}>
                                {content.type === "VIDEO" ? "📹 Video" : "🖼️ Image"}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span className="bg-green-600/90 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                {content.cropType}
                              </span>
                            </div>
                          </div>

                          {/* Content Info */}
                          <div className={`p-4 flex-1 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                {content.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {content.description}
                              </p>
                              {content.pestType && content.pestType !== "NONE" && (
                                <div className="mb-3">
                                  <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                    🐛 Pest: {content.pestType}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <FiCalendar size={12} />
                                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiEye size={12} />
                                  <span>{content.views || 0} views</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toast.success("Resource saved!");
                                  }}
                                  className="text-gray-400 hover:text-green-600 transition-colors"
                                >
                                  <FiBookmark size={14} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toast.success("Thanks for your feedback!");
                                  }}
                                  className="text-gray-400 hover:text-green-600 transition-colors"
                                >
                                  <FiThumbsUp size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Subscribe to get the latest farming resources and tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="bg-yellow-400 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <AIChatbot />
    </main>
  );
}