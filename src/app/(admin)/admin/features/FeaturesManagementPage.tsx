'use client';

import { useEffect, useState } from 'react';
import { featureService, Feature, CreateFeatureData } from '../../../services/feature';
import { contentService } from '../../../services/content';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiX, FiSave, 
  FiZap, FiTrendingUp, FiShield, FiCloud, FiUsers, FiAward,
  FiEye, FiHeart, FiStar, FiMenu, FiCheck, FiAlertCircle,
  FiUpload, FiImage
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Available icons and their gradients (using your color scheme)
const availableIcons = [
  { icon: 'FiZap', label: 'Zap (AI)', gradient: 'from-yellow-500 to-orange-500' },
  { icon: 'FiTrendingUp', label: 'Trending Up', gradient: 'from-green-500 to-primary' },
  { icon: 'FiShield', label: 'Shield', gradient: 'from-red-500 to-pink-500' },
  { icon: 'FiCloud', label: 'Cloud', gradient: 'from-blue-500 to-cyan-500' },
  { icon: 'FiUsers', label: 'Users', gradient: 'from-purple-500 to-indigo-500' },
  { icon: 'FiAward', label: 'Award', gradient: 'from-primary to-green-600' },
  { icon: 'FiEye', label: 'Eye', gradient: 'from-teal-500 to-emerald-500' },
  { icon: 'FiHeart', label: 'Heart', gradient: 'from-pink-500 to-rose-500' },
  { icon: 'FiStar', label: 'Star', gradient: 'from-yellow-500 to-amber-500' },
];

const iconComponents: { [key: string]: any } = {
  FiZap, FiTrendingUp, FiShield, FiCloud, FiUsers, FiAward, FiEye, FiHeart, FiStar
};

export default function FeaturesManagementPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState<CreateFeatureData>({
    title: '',
    description: '',
    icon: 'FiZap',
    color: 'from-yellow-500 to-orange-500',
    displayOrder: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await featureService.getAllFeatures();
      if (response.success && response.data) {
        setFeatures(response.data);
      }
    } catch (error) {
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<{ url: string; publicId: string } | null> => {
    try {
      const response = await contentService.uploadFile(file, 'IMAGE', 'features');
      if (response.success && response.data) {
        return {
          url: response.data.url,
          publicId: response.data.publicId
        };
      }
      return null;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imageUrl;
      let imagePublicId = formData.imagePublicId;

      if (selectedImage) {
        const uploadResult = await handleImageUpload(selectedImage);
        if (uploadResult) {
          imageUrl = uploadResult.url;
          imagePublicId = uploadResult.publicId;
        }
      }

      const submitData = {
        ...formData,
        imageUrl,
        imagePublicId
      };

      let response;
      if (editingFeature) {
        response = await featureService.updateFeature(editingFeature.id, submitData);
      } else {
        response = await featureService.createFeature(submitData);
      }

      if (response.success) {
        toast.success(editingFeature ? 'Feature updated!' : 'Feature created!');
        setIsModalOpen(false);
        resetForm();
        fetchFeatures();
      }
    } catch (error) {
      toast.error('Failed to save feature');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeature) return;
    
    try {
      await featureService.deleteFeature(selectedFeature.id);
      toast.success('Feature deleted');
      setIsDeleteModalOpen(false);
      fetchFeatures();
    } catch (error) {
      toast.error('Failed to delete feature');
    }
  };

  const handleToggleStatus = async (feature: Feature) => {
    try {
      //await featureService.updateFeature(feature.id, { isActive: !feature.isActive });
      await featureService.updateFeature(feature.id, { 
  title: feature.title,
  description: feature.description,
  icon: feature.icon,
  color: feature.color,
  displayOrder: feature.displayOrder,
  isActive: !feature.isActive 
});
      toast.success(`Feature ${!feature.isActive ? 'activated' : 'deactivated'}`);
      fetchFeatures();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setEditingFeature(null);
    setFormData({
      title: '',
      description: '',
      icon: 'FiZap',
      color: 'from-yellow-500 to-orange-500',
      displayOrder: features.length
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const openEditModal = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      color: feature.color,
      imageUrl: feature.imageUrl || undefined,
      imagePublicId: feature.imagePublicId || undefined,
      displayOrder: feature.displayOrder
    });
    if (feature.imageUrl) {
      setImagePreview(feature.imageUrl);
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Features</h1>
          <p className="text-secondary mt-1">Add, edit, or reorder homepage features</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-all transform hover:scale-105"
        >
          <FiPlus size={20} /> Add Feature
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = iconComponents[feature.icon] || FiZap;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all ${
                feature.isActive ? 'border-transparent' : 'border-gray-200 opacity-75'
              }`}
            >
              <div className={`bg-gradient-to-r ${feature.color} p-4 text-white relative`}>
                <div className="flex justify-between items-start">
                  <IconComponent size={32} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(feature)}
                      className={`p-1 rounded transition-colors ${
                        feature.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                      title={feature.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {feature.isActive ? <FiCheck size={14} /> : <FiX size={14} />}
                    </button>
                    <button
                      onClick={() => openEditModal(feature)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFeature(feature);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-secondary text-sm line-clamp-2">{feature.description}</p>
                {feature.imageUrl && (
                  <div className="mt-3">
                    <img src={feature.imageUrl} alt={feature.title} className="h-16 w-full object-cover rounded-lg" />
                  </div>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-secondary">
                  <div className="flex items-center gap-1">
                    <FiMenu size={12} />
                    <span>Order: {feature.displayOrder}</span>
                  </div>
                  {feature.isActive ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <FiCheck size={12} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <FiAlertCircle size={12} /> Inactive
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {features.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-secondary">No features yet. Click "Add Feature" to get started.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">
                  {editingFeature ? 'Edit Feature' : 'Create New Feature'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., AI-Powered Diagnosis"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe what this feature does..."
                    required
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableIcons.map((icon) => {
                      const IconComp = iconComponents[icon.icon];
                      const isSelected = formData.icon === icon.icon;
                      return (
                        <button
                          key={icon.icon}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: icon.icon, color: icon.gradient })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <IconComp size={24} className={isSelected ? 'text-primary' : 'text-secondary'} />
                          <p className="text-xs mt-1 text-secondary">{icon.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <FiUpload className="mx-auto text-secondary mb-2" size={24} />
                        <p className="text-sm text-secondary">Click to upload image</p>
                      </div>
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                            setFormData({ ...formData, imageUrl: undefined, imagePublicId: undefined });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                  />
                  <p className="text-xs text-secondary mt-1">Lower numbers appear first</p>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <FiSave size={18} />
                    {uploading ? 'Saving...' : (editingFeature ? 'Update Feature' : 'Create Feature')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 text-secondary px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedFeature && (
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
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAlertCircle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Feature</h3>
                <p className="text-secondary">
                  Are you sure you want to delete "<span className="font-semibold">{selectedFeature.title}</span>"?
                </p>
                <p className="text-sm text-secondary mt-2">This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiTrash2 size={18} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}