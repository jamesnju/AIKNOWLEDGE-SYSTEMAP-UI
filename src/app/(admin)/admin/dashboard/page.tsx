'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, FiEye, FiCalendar, FiUsers, FiEdit2, FiTrash2, 
  FiX, FiAlertCircle, FiExternalLink, FiVideo, FiImage,
  FiClock, FiMessageCircle, FiSearch, FiFilter
} from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/app/context/AuthContext';
import { contentService } from '@/src/app/services/content';
import { Content } from '@/src/app/types';

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    views: 0,
    videos: 0,
    images: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [viewingContent, setViewingContent] = useState<Content | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterContents();
  }, [searchTerm, selectedType, contents]);

  const fetchData = async () => {
    try {
      const response = await contentService.getAllContent();
      if (response.success && response.data) {
        setContents(response.data);
        setFilteredContents(response.data);
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

  const filterContents = () => {
    let filtered = [...contents];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'ALL') {
      filtered = filtered.filter((item) => item.type === selectedType);
    }
    
    setFilteredContents(filtered);
  };

  const handleDelete = async () => {
    if (!selectedContent) return;
    
    try {
      await contentService.deleteContent(selectedContent.id);
      toast.success('Content deleted successfully');
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const handleView = (content: Content) => {
    setViewingContent(content);
    setIsViewModalOpen(true);
  };

  const statsCards = [
    { title: 'Total Content', value: stats.total, icon: FiFileText, color: 'bg-primary' },
    { title: 'Total Views', value: stats.views.toLocaleString(), icon: FiEye, color: 'bg-secondary' },
    { title: 'Videos', value: stats.videos, icon: FiVideo, color: 'bg-blue-500' },
    { title: 'Images', value: stats.images, icon: FiImage, color: 'bg-purple-500' },
  ];

  return (
    <div className="px-2 sm:px-4 lg:px-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, {admin?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Here's what's happening with your content today.
          </p>
        </motion.div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2 sm:p-3 rounded-full text-white shadow-lg`}>
                <stat.icon size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Management Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Content Management</h2>
          <Link
            href="/admin/content/create"
            className="w-full sm:w-auto bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FiFileText size={18} />
            Create New
          </Link>
        </div>

        {/* Search and Filters - Mobile Optimized */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter size={18} />
              Filter
            </button>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`flex-1 lg:flex-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white ${
                !showFilters ? 'hidden lg:block' : 'block'
              }`}
            >
              <option value="ALL">All Types</option>
              <option value="IMAGE">Images</option>
              <option value="VIDEO">Videos</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Crop Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Views</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Comments</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map((content, index) => (
                <motion.tr
                  key={content.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                      <p className="text-xs text-gray-500 max-w-md truncate">
                        {content.description.substring(0, 60)}...
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      content.type === 'VIDEO' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {content.type === 'VIDEO' ? <FiVideo size={12} /> : <FiImage size={12} />}
                      {content.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {content.cropType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <FiEye className="text-gray-400" size={14} />
                      <span className="font-medium text-sm">{content.views}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <FiMessageCircle className="text-gray-400" size={14} />
                      <span className="text-sm">{content.comments?.length || 0}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FiClock size={14} />
                      <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(content)}
                        className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                        title="View Content"
                      >
                        <FiEye size={18} />
                      </button>
                      <Link
                        href={`/admin/content/edit/${content.id}`}
                        className="p-1 text-primary hover:text-primary-dark transition-colors"
                        title="Edit Content"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedContent(content);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete Content"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredContents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500 text-sm">No content found</p>
              <Link
                href="/admin/content/create"
                className="inline-block mt-4 text-primary hover:underline text-sm"
              >
                Create your first content →
              </Link>
            </div>
          ) : (
            filteredContents.map((content) => (
              <div key={content.id} className="bg-gray-50 rounded-lg p-4">
                {/* Title and Type */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm flex-1 mr-2">
                    {content.title}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    content.type === 'VIDEO' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {content.type === 'VIDEO' ? <FiVideo size={10} /> : <FiImage size={10} />}
                    {content.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {content.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    🌾 {content.cropType}
                  </span>
                  {content.pestType && content.pestType !== 'NONE' && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      🐛 {content.pestType}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FiEye size={12} />
                      {content.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMessageCircle size={12} />
                      {content.comments?.length || 0}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <FiClock size={12} />
                    {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleView(content)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                  >
                    <FiEye size={14} />
                    View
                  </button>
                  <Link
                    href={`/admin/content/edit/${content.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-primary bg-opacity-10 text-primary rounded-lg hover:bg-opacity-20 transition-colors text-xs font-medium"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedContent(content);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Count */}
        {filteredContents.length > 0 && (
          <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            Showing {filteredContents.length} of {contents.length} content items
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - Responsive */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Delete Content</h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="mb-6">
                <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-3" />
                <p className="text-center text-gray-700 text-sm sm:text-base">
                  Are you sure you want to delete "<span className="font-semibold">{selectedContent.title}</span>"?
                </p>
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <FiTrash2 size={18} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Content Modal - Responsive */}
      <AnimatePresence>
        {isViewModalOpen && viewingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Content Preview</h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                {/* Media */}
                <div className="mb-6">
                  {viewingContent.type === 'VIDEO' ? (
                    <div className="relative">
                      <video
                        src={viewingContent.url}
                        poster={viewingContent.thumbnail || undefined}
                        controls
                        className="w-full rounded-lg shadow-md max-h-64 sm:max-h-96 object-contain"
                      />
                    </div>
                  ) : (
                    <img
                      src={viewingContent.url}
                      alt={viewingContent.title}
                      className="w-full rounded-lg shadow-md max-h-64 sm:max-h-96 object-contain bg-gray-100"
                    />
                  )}
                </div>

                {/* Content Info */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{viewingContent.title}</h2>
                    <Link
                      href={`/admin/content/edit/${viewingContent.id}`}
                      className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm flex items-center justify-center gap-2"
                    >
                      <FiEdit2 size={14} /> Edit
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      viewingContent.type === 'VIDEO' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {viewingContent.type === 'VIDEO' ? <FiVideo size={12} /> : <FiImage size={12} />}
                      {viewingContent.type}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      🌾 {viewingContent.cropType}
                    </span>
                    {viewingContent.pestType && viewingContent.pestType !== 'NONE' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        🐛 {viewingContent.pestType}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Description</h4>
                    <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                      {viewingContent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Views</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{viewingContent.views}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Comments</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{viewingContent.comments?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created By</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {viewingContent.admin?.name || 'Admin'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {new Date(viewingContent.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {viewingContent.comments && viewingContent.comments.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Comments</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {viewingContent.comments.slice(0, 5).map((comment: any) => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                              <span className="font-medium text-gray-900 text-sm">{comment.farmerName}</span>
                              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors order-2 sm:order-1"
                >
                  Close
                </button>
                <Link
                  href={`/admin/content/edit/${viewingContent.id}`}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <FiEdit2 size={16} />
                  Edit Content
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiFileText, FiEye, FiCalendar, FiUsers, FiEdit2, FiTrash2, 
//   FiX, FiCheckCircle, FiAlertCircle, FiExternalLink, FiVideo, FiImage,
//   FiClock, FiMessageCircle
// } from 'react-icons/fi';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/src/app/context/AuthContext';
// import { contentService } from '@/src/app/services/content';
// import { Content } from '@/src/app/types';

// export default function AdminDashboard() {
//   const { admin } = useAuth();
//   const [contents, setContents] = useState<Content[]>([]);
//   const [filteredContents, setFilteredContents] = useState<Content[]>([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     views: 0,
//     videos: 0,
//     images: 0,
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState('ALL');
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedContent, setSelectedContent] = useState<Content | null>(null);
//   const [viewingContent, setViewingContent] = useState<Content | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterContents();
//   }, [searchTerm, selectedType, contents]);

//   const fetchData = async () => {
//     try {
//       const response = await contentService.getAllContent();
//       if (response.success && response.data) {
//         setContents(response.data);
//         setFilteredContents(response.data);
//         const videos = response.data.filter(c => c.type === 'VIDEO').length;
//         const images = response.data.filter(c => c.type === 'IMAGE').length;
//         const totalViews = response.data.reduce((sum, c) => sum + c.views, 0);
        
//         setStats({
//           total: response.data.length,
//           views: totalViews,
//           videos,
//           images,
//         });
//       }
//     } catch (error) {
//       toast.error('Failed to load dashboard data');
//     }
//   };

//   const filterContents = () => {
//     let filtered = [...contents];
    
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (item) =>
//           item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (selectedType !== 'ALL') {
//       filtered = filtered.filter((item) => item.type === selectedType);
//     }
    
//     setFilteredContents(filtered);
//   };

//   const handleDelete = async () => {
//     if (!selectedContent) return;
    
//     try {
//       await contentService.deleteContent(selectedContent.id);
//       toast.success('Content deleted successfully');
//       setIsDeleteModalOpen(false);
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to delete content');
//     }
//   };

//   const handleView = (content: Content) => {
//     setViewingContent(content);
//     setIsViewModalOpen(true);
//   };

//   const statsCards = [
//     { title: 'Total Content', value: stats.total, icon: FiFileText, color: 'bg-primary', change: '+12%', changeColor: 'text-green-500' },
//     { title: 'Total Views', value: stats.views.toLocaleString(), icon: FiEye, color: 'bg-secondary', change: '+23%', changeColor: 'text-green-500' },
//     { title: 'Videos', value: stats.videos, icon: FiVideo, color: 'bg-blue-500', change: '+5%', changeColor: 'text-green-500' },
//     { title: 'Images', value: stats.images, icon: FiImage, color: 'bg-purple-500', change: '+8%', changeColor: 'text-green-500' },
//   ];

//   return (
//     <div>
//       {/* Header Section */}
//       <div className="mb-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back, {admin?.name}! 👋</h1>
//           <p className="text-gray-600 mt-2">Here's what's happening with your content today.</p>
//         </motion.div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {statsCards.map((stat, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             whileHover={{ y: -5, transition: { duration: 0.2 } }}
//             className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
//                 <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//                 <p className={`text-xs mt-2 ${stat.changeColor}`}>{stat.change} from last month</p>
//               </div>
//               <div className={`${stat.color} p-3 rounded-full text-white shadow-lg`}>
//                 <stat.icon size={24} />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Content Management Section */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
//           <Link
//             href="/admin/content/create"
//             className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 inline-flex items-center gap-2"
//           >
//             <FiFileText size={18} />
//             Create New Content
//           </Link>
//         </div>

//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search by title or description..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//             />
//           </div>
//           <div>
//             <select
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//             >
//               <option value="ALL">All Types</option>
//               <option value="IMAGE">Images</option>
//               <option value="VIDEO">Videos</option>
//             </select>
//           </div>
//         </div>

//         {/* Content Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Crop Type</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Views</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Comments</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredContents.map((content, index) => (
//                 <motion.tr
//                   key={content.id}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: index * 0.05 }}
//                   className="border-t hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="py-3 px-4">
//                     <div>
//                       <p className="font-medium text-gray-900">{content.title}</p>
//                       <p className="text-sm text-gray-500 max-w-md truncate">
//                         {content.description.substring(0, 60)}...
//                       </p>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
//                       content.type === 'VIDEO' 
//                         ? 'bg-blue-100 text-blue-700' 
//                         : 'bg-green-100 text-green-700'
//                     }`}>
//                       {content.type === 'VIDEO' ? <FiVideo size={12} /> : <FiImage size={12} />}
//                       {content.type}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
//                       {content.cropType}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-1">
//                       <FiEye className="text-gray-400" size={14} />
//                       <span className="font-medium">{content.views}</span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-1">
//                       <FiMessageCircle className="text-gray-400" size={14} />
//                       <span>{content.comments?.length || 0}</span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-1 text-sm text-gray-500">
//                       <FiClock size={14} />
//                       <span>{new Date(content.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleView(content)}
//                         className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
//                         title="View Content"
//                       >
//                         <FiEye size={18} />
//                       </button>
//                       <Link
//                         href={`/admin/content/edit/${content.id}`}
//                         className="p-1 text-primary hover:text-primary-dark transition-colors"
//                         title="Edit Content"
//                       >
//                         <FiEdit2 size={18} />
//                       </Link>
//                       <button
//                         onClick={() => {
//                           setSelectedContent(content);
//                           setIsDeleteModalOpen(true);
//                         }}
//                         className="p-1 text-red-600 hover:text-red-700 transition-colors"
//                         title="Delete Content"
//                       >
//                         <FiTrash2 size={18} />
//                       </button>
//                       {/* <Link
//                         href={`/content/${content.id}`}
//                         target="_blank"
//                         className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
//                         title="View on Site"
//                       >
//                         <FiExternalLink size={18} />
//                       </Link> */}
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredContents.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-gray-400 mb-2">📭</div>
//               <p className="text-gray-500">No content found</p>
//               <Link
//                 href="/admin/content/create"
//                 className="inline-block mt-4 text-primary hover:underline"
//               >
//                 Create your first content →
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Pagination (if needed) */}
//         {filteredContents.length > 10 && (
//           <div className="flex justify-center gap-2 mt-6">
//             <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
//             <button className="px-3 py-1 bg-primary text-white rounded">1</button>
//             <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
//             <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
//             <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {isDeleteModalOpen && selectedContent && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//             onClick={() => setIsDeleteModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-900">Delete Content</h3>
//                 <button
//                   onClick={() => setIsDeleteModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX size={24} />
//                 </button>
//               </div>
              
//               <div className="mb-6">
//                 <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-3" />
//                 <p className="text-center text-gray-700">
//                   Are you sure you want to delete "<span className="font-semibold">{selectedContent.title}</span>"?
//                 </p>
//                 <p className="text-center text-sm text-gray-500 mt-2">
//                   This action cannot be undone.
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setIsDeleteModalOpen(false)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <FiTrash2 size={18} />
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* View Content Modal */}
//       <AnimatePresence>
//         {isViewModalOpen && viewingContent && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
//             onClick={() => setIsViewModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
//                 <h3 className="text-xl font-bold text-gray-900">Content Preview</h3>
//                 <button
//                   onClick={() => setIsViewModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FiX size={24} />
//                 </button>
//               </div>

//               {/* Modal Content */}
//               <div className="p-6">
//                 {/* Media */}
//                 <div className="mb-6">
//                   {viewingContent.type === 'VIDEO' ? (
//                     <div className="relative">
//                       <video
//                         src={viewingContent.url}
//                         poster={viewingContent.thumbnail || undefined}
//                         controls
//                         className="w-full rounded-lg shadow-md"
//                       />
//                     </div>
//                   ) : (
//                     <img
//                       src={viewingContent.url}
//                       alt={viewingContent.title}
//                       className="w-full rounded-lg shadow-md"
//                     />
//                   )}
//                 </div>

//                 {/* Content Info */}
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-start">
//                     <h2 className="text-2xl font-bold text-gray-900">{viewingContent.title}</h2>
//                     <div className="flex gap-2">
//                       <Link
//                         href={`/admin/content/edit/${viewingContent.id}`}
//                         className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm flex items-center gap-1"
//                       >
//                         <FiEdit2 size={14} /> Edit
//                       </Link>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-3">
//                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
//                       viewingContent.type === 'VIDEO' 
//                         ? 'bg-blue-100 text-blue-700' 
//                         : 'bg-green-100 text-green-700'
//                     }`}>
//                       {viewingContent.type === 'VIDEO' ? <FiVideo size={12} /> : <FiImage size={12} />}
//                       {viewingContent.type}
//                     </span>
//                     <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
//                       {viewingContent.cropType}
//                     </span>
//                     {viewingContent.pestType && viewingContent.pestType !== 'NONE' && (
//                       <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
//                         Pest: {viewingContent.pestType}
//                       </span>
//                     )}
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
//                     <p className="text-gray-700 whitespace-pre-wrap">{viewingContent.description}</p>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
//                     <div>
//                       <p className="text-sm text-gray-500">Views</p>
//                       <p className="font-semibold text-gray-900">{viewingContent.views}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Comments</p>
//                       <p className="font-semibold text-gray-900">{viewingContent.comments?.length || 0}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Created By</p>
//                       <p className="font-semibold text-gray-900">{viewingContent.admin?.name || 'Admin'}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Created At</p>
//                       <p className="font-semibold text-gray-900">{new Date(viewingContent.createdAt).toLocaleString()}</p>
//                     </div>
//                   </div>

//                   {/* Comments Section */}
//                   {viewingContent.comments && viewingContent.comments.length > 0 && (
//                     <div className="pt-4 border-t">
//                       <h4 className="font-semibold text-gray-900 mb-3">Recent Comments</h4>
//                       <div className="space-y-3">
//                         {viewingContent.comments.slice(0, 5).map((comment: any) => (
//                           <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
//                             <div className="flex justify-between items-start mb-1">
//                               <span className="font-medium text-gray-900">{comment.farmerName}</span>
//                               <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
//                             </div>
//                             <p className="text-gray-700 text-sm">{comment.text}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Modal Footer */}
//               <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
//                 <button
//                   onClick={() => setIsViewModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   Close
//                 </button>
//                 <Link
//                   href={`/admin/content/edit/${viewingContent.id}`}
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
//                 >
//                   <FiEdit2 size={16} />
//                   Edit Content
//                 </Link>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

