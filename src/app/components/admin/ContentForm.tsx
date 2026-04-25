'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContentFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
}

export default function ContentForm({ onSubmit, isLoading, initialData }: ContentFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      type: 'IMAGE',
      cropType: '',
      pestType: '',
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const type = watch('type');

  const onFormSubmit = async (data: any) => {
    await onSubmit({ ...data, file: selectedFile });
  };

  const cropTypes = [
    'MAIZE', 'TOMATO', 'VEGETABLE', 'FRUIT', 'GENERAL'
  ];

  const pestTypes = [
    'FALL_ARMYWORM', 'STEM_BORER', 'APHIDS', 'FRUIT_FLY', 
    'TOMATO_LEAF_MINER', 'CUTWORM', 'NONE'
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          {...register('title', { required: true })}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          placeholder="Enter content title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          {...register('description', { required: true })}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          placeholder="Enter detailed description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type *
          </label>
          <select
            {...register('type', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Type *
          </label>
          <select
            {...register('cropType', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            {cropTypes.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pest Type *
          </label>
          <select
            {...register('pestType', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            {pestTypes.map(pest => (
              <option key={pest} value={pest}>{pest}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'VIDEO' ? 'Video URL (if already uploaded)' : 'Image URL (if already uploaded)'}
          </label>
          <input
            {...register('url')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder={type === 'VIDEO' ? 'https://...' : 'https://...'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload File (Optional)
        </label>
        <input
          type="file"
          accept={type === 'VIDEO' ? 'video/*' : 'image/*'}
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
        />
        <p className="text-sm text-gray-500 mt-1">
          Upload a file or provide a URL above
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Content'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}