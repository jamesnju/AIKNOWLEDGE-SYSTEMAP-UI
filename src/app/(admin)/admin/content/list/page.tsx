'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { contentService } from '../../../../services/content';
import { Content } from '../../../../types';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiImage, FiVideo, FiCalendar, FiEye as FiViewIcon } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContentListPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await contentService.getAllContent();
      if (response.success && response.data) {
        setContents(response.data);
      }
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await contentService.deleteContent(id);
        toast.success('Content deleted successfully');
        fetchContents();
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Content</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your agricultural content library
          </p>
        </div>
        <Link
          href="/admin/content/create"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto justify-center text-sm sm:text-base"
        >
          <FiPlus size={18} />
          Create New
        </Link>
      </div>

      {/* Stats Bar - Mobile Friendly */}
      <div className="grid grid-cols-3 gap-2 sm:hidden mb-4">
        <div className="bg-white rounded-lg shadow-sm p-3 text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-primary">{contents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 text-center">
          <p className="text-xs text-gray-500">Images</p>
          <p className="text-lg font-bold text-green-600">
            {contents.filter(c => c.type === 'IMAGE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 text-center">
          <p className="text-xs text-gray-500">Videos</p>
          <p className="text-lg font-bold text-blue-600">
            {contents.filter(c => c.type === 'VIDEO').length}
          </p>
        </div>
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Crop Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((content) => (
                <tr key={content.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {content.description.substring(0, 60)}...
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                      content.type === 'VIDEO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {content.type === 'VIDEO' ? <FiVideo size={12} /> : <FiImage size={12} />}
                      {content.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{content.cropType}</td>
                  <td className="py-3 px-4 text-sm">{content.views?.toLocaleString() || 0}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/content/${content.id}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="View"
                      >
                        <FiEye size={18} />
                      </Link>
                      <Link
                        href={`/admin/content/edit/${content.id}`}
                        className="text-primary hover:text-primary-dark transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (visible only on mobile) */}
      <div className="lg:hidden space-y-4">
        {contents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
            <p className="text-gray-600 mb-4">Start creating your first content</p>
            <Link
              href="/admin/content/create"
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
            >
              <FiPlus size={18} />
              Create Content
            </Link>
          </div>
        ) : (
          contents.map((content) => (
            <div key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Media Preview for Mobile */}
              <div className="relative h-48 bg-gray-100">
                {content.type === 'VIDEO' ? (
                  <video
                    src={content.url}
                    className="w-full h-full object-cover"
                    poster={content.thumbnail || undefined}
                  />
                ) : (
                  <img
                    src={content.url}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                    content.type === 'VIDEO' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {content.type === 'VIDEO' ? <FiVideo size={12} /> : <FiImage size={12} />}
                    {content.type}
                  </span>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-base flex-1">
                    {content.title}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {content.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                    🌾 {content.cropType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                    🐛 {content.pestType}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FiViewIcon size={14} />
                    <span>{content.views?.toLocaleString() || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  <Link
                    href={`/content/${content.id}`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <FiEye size={16} />
                    View
                  </Link>
                  <Link
                    href={`/admin/content/edit/${content.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary bg-opacity-10 text-primary rounded-lg hover:bg-opacity-20 transition-colors text-sm font-medium"
                  >
                    <FiEdit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State for Desktop */}
      {contents.length === 0 && (
        <div className="hidden lg:block text-center py-12 bg-white rounded-lg">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
          <p className="text-gray-600 mb-4">Start creating your first content</p>
          <Link
            href="/admin/content/create"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
          >
            <FiPlus size={18} />
            Create Content
          </Link>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { contentService } from '../../../../services/content';
// import { Content } from '../../../../types';
// import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// export default function ContentListPage() {
//   const [contents, setContents] = useState<Content[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchContents();
//   }, []);

//   const fetchContents = async () => {
//     try {
//       const response = await contentService.getAllContent();
//       if (response.success && response.data) {
//         setContents(response.data);
//       }
//     } catch (error) {
//       toast.error('Failed to load content');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('Are you sure you want to delete this content?')) {
//       try {
//         await contentService.deleteContent(id);
//         toast.success('Content deleted successfully');
//         fetchContents();
//       } catch (error) {
//         toast.error('Failed to delete content');
//       }
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">All Content</h1>
//         <Link
//           href="/admin/content/create"
//           className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
//         >
//           Create New
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="text-left py-3 px-4">Title</th>
//               <th className="text-left py-3 px-4">Type</th>
//               <th className="text-left py-3 px-4">Crop Type</th>
//               <th className="text-left py-3 px-4">Views</th>
//               <th className="text-left py-3 px-4">Created</th>
//               <th className="text-left py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {contents.map((content) => (
//               <tr key={content.id} className="border-t">
//                 <td className="py-3 px-4">
//                   <div>
//                     <p className="font-medium text-gray-900">{content.title}</p>
//                     <p className="text-sm text-gray-500">{content.description.substring(0, 50)}...</p>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     content.type === 'VIDEO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
//                   }`}>
//                     {content.type}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4">{content.cropType}</td>
//                 <td className="py-3 px-4">{content.views}</td>
//                 <td className="py-3 px-4">
//                   {new Date(content.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="py-3 px-4">
//                   <div className="flex gap-2">
//                     <Link
//                       href={`/content/${content.id}`}
//                       target="_blank"
//                       className="text-blue-600 hover:text-blue-700"
//                     >
//                       <FiEye size={18} />
//                     </Link>
//                     <Link
//                       href={`/admin/content/edit/${content.id}`}
//                       className="text-primary hover:text-primary-dark"
//                     >
//                       <FiEdit size={18} />
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(content.id)}
//                       className="text-red-600 hover:text-red-700"
//                     >
//                       <FiTrash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }