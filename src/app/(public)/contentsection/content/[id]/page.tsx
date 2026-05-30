'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  FiArrowLeft, FiImage, FiVideo, FiCalendar, FiEye, 
  FiUser, FiTag, FiAlertCircle, FiClock, FiInfo,
  FiDownload, FiShare2, FiHeart, FiMessageCircle
} from 'react-icons/fi';
import { Content } from '@/src/app/types';
import { contentService } from '@/src/app/services/content';

export default function ViewContentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [contentId, setContentId] = useState<string | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

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
      const response = await contentService.getContentById(contentId);
      
      if (response.success && response.data) {
        setContent(response.data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back Button */}
      {/* <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
        <span>Back to Dashboard</span>
      </button> */}

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section with Media */}
        <div className="relative bg-gray-900">
          {content.type === 'VIDEO' ? (
            <div className="relative aspect-video">
              <video
                src={content.url}
                poster={content.thumbnail || undefined}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative bg-gray-100 flex items-center justify-center min-h-[400px]">
              <img
                src={content.url}
                alt={content.title}
                className="max-w-full max-h-[500px] object-contain"
              />
            </div>
          )}
          
          {/* Type Badge */}
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
              content.type === 'VIDEO' 
                ? 'bg-blue-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {content.type === 'VIDEO' ? <FiVideo size={16} /> : <FiImage size={16} />}
              {content.type}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {content.title}
            </h1>
            
            {/* Quick Stats Row */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FiEye size={16} />
                <span>{content.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <FiMessageCircle size={16} />
                <span>{content.comments?.length || 0} comments</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar size={16} />
                <span>{new Date(content.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock size={16} />
                <span>{new Date(content.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <FiTag size={14} />
              {content.cropType}
            </span>
            {content.pestType && content.pestType !== 'NONE' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                <FiAlertCircle size={14} />
                {content.pestType}
              </span>
            )}
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiInfo size={20} />
              Description
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {content.description}
              </p>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <FiInfo size={16} />
                </div>
                <span className="text-xs font-medium text-blue-600 uppercase">Content ID</span>
              </div>
              <p className="font-mono text-sm text-gray-900 break-all">{content.id}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-500 rounded-lg text-white">
                  <FiTag size={16} />
                </div>
                <span className="text-xs font-medium text-green-600 uppercase">Crop Type</span>
              </div>
              <p className="font-semibold text-gray-900">{content.cropType}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-500 rounded-lg text-white">
                  <FiAlertCircle size={16} />
                </div>
                <span className="text-xs font-medium text-purple-600 uppercase">Pest Type</span>
              </div>
              <p className="font-semibold text-gray-900">{content.pestType || 'None'}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-500 rounded-lg text-white">
                  <FiUser size={16} />
                </div>
                <span className="text-xs font-medium text-orange-600 uppercase">Created By</span>
              </div>
              <p className="font-semibold text-gray-900">{content.admin?.name || 'Admin'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <FiDownload size={18} />
              Print Details
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <FiShare2 size={18} />
              Share Link
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section (if available) */}
      {content.comments && content.comments.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiMessageCircle size={24} />
            Comments ({content.comments.length})
          </h2>
          <div className="space-y-4">
            {content.comments.map((comment: any, index: number) => (
              <div key={comment.id || index} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {comment.farmerName?.charAt(0).toUpperCase() || 'F'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{comment.farmerName || 'Anonymous Farmer'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <FiHeart size={16} />
                  </button>
                </div>
                <p className="text-gray-700 ml-10">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Content Suggestion (Optional) */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
        >
          <FiArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// // import { contentService } from '../../../../../services/content';
// // import { Content } from '../../../../../types';
// import toast from 'react-hot-toast';
// import Link from 'next/link';
// import { FiArrowLeft, FiSave, FiX, FiImage, FiVideo } from 'react-icons/fi';
// import { contentService } from '../../services/content';
// import { Content } from '../../types';

// // IMPORTANT: params is now a Promise in Next.js 15+
// export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
//   const router = useRouter();
//   const [contentId, setContentId] = useState<string | null>(null);
  
//   const [content, setContent] = useState<Content | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     cropType: '',
//     pestType: '',
//   });

//   // Unwrap the params Promise
//   useEffect(() => {
//     const unwrapParams = async () => {
//       const unwrappedParams = await params;
//       setContentId(unwrappedParams.id);
//     };
//     unwrapParams();
//   }, [params]);

//   useEffect(() => {
//     if (contentId) {
//       fetchContent();
//     }
//   }, [contentId]);

//   const fetchContent = async () => {
//     if (!contentId) return;
    
//     try {
//       console.log('Fetching content with ID:', contentId);
//       const response = await contentService.getContentById(contentId);
//       console.log('Response:', response);
      
//       if (response.success && response.data) {
//         setContent(response.data);
//         setFormData({
//           title: response.data.title,
//           description: response.data.description,
//           cropType: response.data.cropType,
//           pestType: response.data.pestType || 'NONE',
//         });
//       } else {
//         toast.error('Content not found');
//         router.push('/admin/dashboard');
//       }
//     } catch (error) {
//       console.error('Error fetching content:', error);
//       toast.error('Failed to load content');
//       router.push('/admin/dashboard');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!contentId) return;
    
//     if (!formData.title || !formData.description) {
//       toast.error('Please fill in all required fields');
//       return;
//     }
    
//     setSaving(true);
    
//     try {
//       const updateData = {
//         title: formData.title,
//         description: formData.description,
//         cropType: formData.cropType,
//         pestType: formData.pestType,
//       };
      
//       const response = await contentService.updateContent(contentId, updateData);
      
//       if (response.success) {
//         toast.success('Content updated successfully!');
//         router.push('/admin/dashboard');
//       } else {
//         throw new Error(response.message || 'Failed to update content');
//       }
//     } catch (error) {
//       console.error('Error updating content:', error);
//       toast.error('Failed to update content. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const cropTypes = ['MAIZE', 'TOMATO', 'VEGETABLE', 'FRUIT', 'GENERAL'];
//   const pestTypes = ['FALL_ARMYWORM', 'STEM_BORER', 'APHIDS', 'FRUIT_FLY', 'TOMATO_LEAF_MINER', 'CUTWORM', 'NONE'];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
//           <p className="text-gray-600">Loading content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!content) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-6xl mb-4">🔍</div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h2>
//         <p className="text-gray-600 mb-6">The content you're looking for doesn't exist or has been deleted.</p>
//         <Link
//           href="/admin/dashboard"
//           className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
//         >
//           <FiArrowLeft /> Back to Dashboard
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-4 mb-4">
//           <Link
//             href="/"
//             className="text-gray-600 hover:text-primary transition-colors"
//           >
//             <FiArrowLeft size={24} />
//           </Link>
//           {/* <div>
//             <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
//             <p className="text-gray-600 mt-1">Update your agricultural content</p>
//           </div> */}
//         </div>
//       </div>

//       {/* Content Preview */}
//       <div className="bg-gray-50 rounded-lg p-4 mb-6">
//         <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//           {content.type === 'VIDEO' ? <FiVideo /> : <FiImage />}
//           Current {content.type}
//         </h3>
//         {content.type === 'VIDEO' ? (
//           <video
//             src={content.url}
//             poster={content.thumbnail || undefined}
//             controls
//             className="max-h-64 rounded-lg w-full"
//           />
//         ) : (
//           <img
//             src={content.url}
//             alt={content.title}
//             className="max-h-74 rounded-lg object-cover w-full pt-12"
//           />
//         )}
      
//       </div>

//       {/* Edit Form */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Title *
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
//               placeholder="Enter content title"
//               required
//               readOnly
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description *
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               rows={6}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//               placeholder="Enter detailed description"
//               required
//               readOnly
//             />
//           </div>

//           {/* Crop Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Crop Type *
//             </label>
//             <select
//               value={formData.cropType}
//               disabled
//               onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//             >
//               {cropTypes.map(crop => (
//                 <option key={crop} value={crop}>{crop}</option>
//               ))}
//             </select>
//           </div>

//           {/* Pest Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Pest Type *
//             </label>
//             <select
//             disabled
//               value={formData.pestType}
//               onChange={(e) => setFormData({ ...formData, pestType: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//             >
//               {pestTypes.map(pest => (
//                 <option key={pest} value={pest}>{pest}</option>
//               ))}
//             </select>
//           </div>

//           {/* Metadata Info */}
//           <div className="bg-blue-50 rounded-lg p-4">
//             <h4 className="font-semibold text-gray-900 mb-2">Content Information</h4>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-500">Content ID:</span>
//                 <p className="font-mono text-xs">{content.id}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Type:</span>
//                 <p>{content.type}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Views:</span>
//                 <p>{content.views}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Created:</span>
//                 <p>{new Date(content.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           {/* <div className="flex gap-4 pt-4 border-t">
//             <button
//               type="submit"
//               disabled={saving}
//               className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
//             >
//               <FiSave size={18} />
//               {saving ? 'Saving...' : 'Save Changes'}
//             </button>
//             <Link
//               href="/admin/dashboard"
//               className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               <FiX size={18} />
//               Cancel
//             </Link>
//           </div> */}
//         </form>
//       </div>
//     </div>
//   );
// }