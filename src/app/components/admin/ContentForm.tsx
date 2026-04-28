'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContentFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
  isEdit?: boolean;
}

export default function ContentForm({ onSubmit, isLoading, initialData, isEdit = false }: ContentFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      type: 'IMAGE',
      cropType: '',
      pestType: '',
      url: '',
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const type = watch('type');

  const onFormSubmit = async (data: any) => {
    await onSubmit({ ...data, file: selectedFile });
  };

  const cropTypes = ['MAIZE', 'TOMATO', 'VEGETABLE', 'FRUIT', 'GENERAL'];
  const pestTypes = ['FALL_ARMYWORM', 'STEM_BORER', 'APHIDS', 'FRUIT_FLY', 'TOMATO_LEAF_MINER', 'CUTWORM', 'NONE'];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Title *
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors`}
          placeholder="Enter content title"
        />
        {errors.title && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.title.message as string}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Description *
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={5}
          className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-vertical`}
          placeholder="Enter detailed description"
        />
        {errors.description && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.description.message as string}</p>
        )}
      </div>

      {/* Grid Layout - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Content Type *
          </label>
          <select
            {...register('type', { required: 'Content type is required' })}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white"
            disabled={isEdit}
          >
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
          </select>
          {isEdit && (
            <p className="mt-1 text-xs text-gray-500">Content type cannot be changed in edit mode</p>
          )}
        </div>

        {/* Crop Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Crop Type *
          </label>
          <select
            {...register('cropType', { required: 'Crop type is required' })}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white"
          >
            {cropTypes.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pest Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Pest Type *
          </label>
          <select
            {...register('pestType', { required: 'Pest type is required' })}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white"
          >
            {pestTypes.map(pest => (
              <option key={pest} value={pest}>{pest}</option>
            ))}
          </select>
        </div>

        {/* URL Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            {type === 'VIDEO' ? 'Video URL' : 'Image URL'}
            {!isEdit && ' (Optional - can upload file instead)'}
          </label>
          <input
            {...register('url')}
            type="url"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder={type === 'VIDEO' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
            disabled={isEdit}
          />
        </div>
      </div>

      {/* File Upload */}
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Upload File (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              accept={type === 'VIDEO' ? 'video/*' : 'image/*'}
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            📁 Upload a file or provide a URL above (Max size: 10MB)
          </p>
        </div>
      )}

      {/* Edit Mode Note */}
      {isEdit && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>Note:</strong> Only title, description, crop type, and pest type can be edited.
                To change the media, please delete and create new content.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEdit ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEdit ? 'Update Content' : 'Create Content'
          )}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';

// interface ContentFormProps {
//   onSubmit: (data: any) => Promise<void>;
//   isLoading?: boolean;
//   initialData?: any;
//   isEdit?: boolean;
// }

// export default function ContentForm({ onSubmit, isLoading, initialData, isEdit = false }: ContentFormProps) {
//   const { register, handleSubmit, watch, formState: { errors } } = useForm({
//     defaultValues: initialData || {
//       title: '',
//       description: '',
//       type: 'IMAGE',
//       cropType: '',
//       pestType: '',
//       url: '',
//     },
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const type = watch('type');

//   const onFormSubmit = async (data: any) => {
//     await onSubmit({ ...data, file: selectedFile });
//   };

//   const cropTypes = ['MAIZE', 'TOMATO', 'VEGETABLE', 'FRUIT', 'GENERAL'];
//   const pestTypes = ['FALL_ARMYWORM', 'STEM_BORER', 'APHIDS', 'FRUIT_FLY', 'TOMATO_LEAF_MINER', 'CUTWORM', 'NONE'];

//   return (
//     <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Title *
//         </label>
//         <input
//           {...register('title', { required: 'Title is required' })}
//           type="text"
//           className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`}
//           placeholder="Enter content title"
//         />
//         {errors.title && (
//           <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Description *
//         </label>
//         <textarea
//           {...register('description', { required: 'Description is required' })}
//           rows={5}
//           className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`}
//           placeholder="Enter detailed description"
//         />
//         {errors.description && (
//           <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Content Type *
//           </label>
//           <select
//             {...register('type', { required: 'Content type is required' })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
//             disabled={isEdit}
//           >
//             <option value="IMAGE">Image</option>
//             <option value="VIDEO">Video</option>
//           </select>
//           {isEdit && (
//             <p className="mt-1 text-xs text-gray-500">Content type cannot be changed in edit mode</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Crop Type *
//           </label>
//           <select
//             {...register('cropType', { required: 'Crop type is required' })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
//           >
//             {cropTypes.map(crop => (
//               <option key={crop} value={crop}>{crop}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Pest Type *
//           </label>
//           <select
//             {...register('pestType', { required: 'Pest type is required' })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
//           >
//             {pestTypes.map(pest => (
//               <option key={pest} value={pest}>{pest}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             {type === 'VIDEO' ? 'Video URL' : 'Image URL'}
//             {!isEdit && ' (Optional - can upload file instead)'}
//           </label>
//           <input
//             {...register('url')}
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
//             placeholder={type === 'VIDEO' ? 'https://...' : 'https://...'}
//             disabled={isEdit}
//           />
//         </div>
//       </div>

//       {!isEdit && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Upload File (Optional)
//           </label>
//           <input
//             type="file"
//             accept={type === 'VIDEO' ? 'video/*' : 'image/*'}
//             onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
//           />
//           <p className="text-sm text-gray-500 mt-1">
//             Upload a file or provide a URL above
//           </p>
//         </div>
//       )}

//       {isEdit && (
//         <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             📝 <strong>Note:</strong> Only title, description, crop type, and pest type can be edited.
//             To change the media, please delete and create new content.
//           </p>
//         </div>
//       )}

//       <div className="flex gap-4">
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
//         >
//           {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Content' : 'Create Content')}
//         </button>
//         <button
//           type="button"
//           onClick={() => window.history.back()}
//           className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }
