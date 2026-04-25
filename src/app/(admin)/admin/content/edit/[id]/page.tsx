'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { contentService } from '../../../../../services/content';
import { Content } from '../../../../../types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiX, FiImage, FiVideo } from 'react-icons/fi';

// IMPORTANT: params is now a Promise in Next.js 15+
export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [contentId, setContentId] = useState<string | null>(null);
  
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cropType: '',
    pestType: '',
  });

  // Unwrap the params Promise
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setContentId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const fetchContent = async () => {
    if (!contentId) return;
    
    try {
      console.log('Fetching content with ID:', contentId);
      const response = await contentService.getContentById(contentId);
      console.log('Response:', response);
      
      if (response.success && response.data) {
        setContent(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          cropType: response.data.cropType,
          pestType: response.data.pestType || 'NONE',
        });
      } else {
        toast.error('Content not found');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
      router.push('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentId) return;
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSaving(true);
    
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        cropType: formData.cropType,
        pestType: formData.pestType,
      };
      
      const response = await contentService.updateContent(contentId, updateData);
      
      if (response.success) {
        toast.success('Content updated successfully!');
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cropTypes = ['MAIZE', 'TOMATO', 'VEGETABLE', 'FRUIT', 'GENERAL'];
  const pestTypes = ['FALL_ARMYWORM', 'STEM_BORER', 'APHIDS', 'FRUIT_FLY', 'TOMATO_LEAF_MINER', 'CUTWORM', 'NONE'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h2>
        <p className="text-gray-600 mb-6">The content you're looking for doesn't exist or has been deleted.</p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/dashboard"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-gray-600 mt-1">Update your agricultural content</p>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          {content.type === 'VIDEO' ? <FiVideo /> : <FiImage />}
          Current {content.type}
        </h3>
        {content.type === 'VIDEO' ? (
          <video
            src={content.url}
            poster={content.thumbnail || undefined}
            controls
            className="max-h-64 rounded-lg w-full"
          />
        ) : (
          <img
            src={content.url}
            alt={content.title}
            className="max-h-64 rounded-lg object-cover w-full"
          />
        )}
        <p className="text-sm text-gray-500 mt-2">
          ⚠️ Note: Media cannot be changed. To update media, delete this content and create a new one.
        </p>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter content title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter detailed description"
              required
            />
          </div>

          {/* Crop Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Type *
            </label>
            <select
              value={formData.cropType}
              onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {cropTypes.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          {/* Pest Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pest Type *
            </label>
            <select
              value={formData.pestType}
              onChange={(e) => setFormData({ ...formData, pestType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {pestTypes.map(pest => (
                <option key={pest} value={pest}>{pest}</option>
              ))}
            </select>
          </div>

          {/* Metadata Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Content Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Content ID:</span>
                <p className="font-mono text-xs">{content.id}</p>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <p>{content.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Views:</span>
                <p>{content.views}</p>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <p>{new Date(content.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <FiSave size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FiX size={18} />
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}