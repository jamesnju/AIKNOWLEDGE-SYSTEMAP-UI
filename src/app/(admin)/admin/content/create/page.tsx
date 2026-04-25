'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { contentService } from '@/src/app/services/content';
import ContentForm from '@/src/app/components/admin/ContentForm';

export default function CreateContentPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setUploading(true);
      
      // Upload file first if exists
      let uploadData = null;
      if (data.file) {
        const uploadResponse = await contentService.uploadFile(
          data.file,
          data.type,
          'agripoa'
        );
        
        if (uploadResponse.success && uploadResponse.data) {
          uploadData = uploadResponse.data;
        } else {
          throw new Error('File upload failed');
        }
      }
      
      // Create content
      const contentData = {
        title: data.title,
        description: data.description,
        type: data.type,
        url: uploadData?.url || data.url,
        publicId: uploadData?.publicId || '',
        thumbnail: uploadData?.thumbnail || null,
        cropType: data.cropType,
        pestType: data.pestType,
      };
      
      const response = await contentService.createContent(contentData);
      
      if (response.success) {
        toast.success('Content created successfully!');
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
        <p className="text-gray-600 mt-2">Add educational content for farmers</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ContentForm onSubmit={handleSubmit} isLoading={uploading} />
      </div>
    </div>
  );
}