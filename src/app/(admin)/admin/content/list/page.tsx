'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { contentService } from '../../../../services/content';
import { Content } from '../../../../types';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
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
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Content</h1>
        <Link
          href="/admin/content/create"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
        >
          Create New
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            {contents.map((content) => (
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
                      href={`/content/${content.id}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiEye size={18} />
                    </Link>
                    <Link
                      href={`/admin/content/edit/${content.id}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="text-red-600 hover:text-red-700"
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
  );
}