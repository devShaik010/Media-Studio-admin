import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { addArticle } from '../supabase/services';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ArticleForm = ({ onSubmit, initialData = {}, isSubmitting: parentIsSubmitting = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    youtubeLink: initialData.youtubeLink || '',
    content: initialData.content || '',
    language: initialData.language || 'english',
    publishDate: initialData.publishDate || new Date().toISOString().split('T')[0],
    status: initialData.status || 'Draft',
    thumbnail: initialData.thumbnail || null,
    mainImage: initialData.mainImage || null,
  });
  const [previews, setPreviews] = useState({
    thumbnail: null,
    mainImage: null,
  });
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (name, file) => {
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({
      ...prev,
      [name]: previewUrl
    }));
  };

  const validateImage = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({
        ...prev,
        [file.name]: 'File size should be less than 2MB'
      }));
      return false;
    }
    return true;
  };

  const onDrop = useCallback((acceptedFiles, fieldName) => {
    const file = acceptedFiles[0];
    if (validateImage(file)) {
      handleImageChange(fieldName, file);
    }
  }, []);

  // Add dropzone hooks for both image fields
  const {getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps} = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'thumbnail'),
    accept: 'image/*',
    multiple: false
  });
  
  const {getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps} = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'mainImage'),
    accept: 'image/*',
    multiple: false
  });

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (previews.thumbnail) URL.revokeObjectURL(previews.thumbnail);
      if (previews.mainImage) URL.revokeObjectURL(previews.mainImage);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const articleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        youtubeLink: formData.youtubeLink.trim(),
        language: formData.language,
        publishDate: formData.publishDate,
        status: formData.status,
        thumbnail: formData.thumbnail,
        mainImage: formData.mainImage
      };

      const result = await addArticle(articleData);

      // Complete progress and show success
      setUploadProgress(100);
      clearInterval(progressInterval);
      toast.success('Article uploaded successfully!');

      // Reset form
      setFormData({
        title: '',
        content: '',
        youtubeLink: '',
        language: 'english',
        publishDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
        thumbnail: null,
        mainImage: null
      });
      setPreviews({ thumbnail: null, mainImage: null });

      // Notify parent
      onSubmit(result);

    } catch (error) {
      setUploadProgress(0);
      toast.error(error.message || 'Error uploading article');
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Error submitting article. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-['Poppins']">
      {/* Show upload progress if uploading */}
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Title Input */}
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter article title..."
        className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border text-gray-700"
        dir={formData.language === 'urdu' ? 'rtl' : 'ltr'}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      {/* Image Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail Image
          </label>
          <div {...getThumbnailRootProps()} className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <input
              {...getThumbnailInputProps()}
              type="file"
              name="thumbnail"
              accept="image/*"
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="cursor-pointer w-full text-center"
            >
              {previews.thumbnail ? (
                <img
                  src={previews.thumbnail}
                  alt="Thumbnail preview"
                  className="mx-auto max-h-40 object-contain rounded-lg"
                />
              ) : (
                <div className="py-4">
                  <p className="text-gray-500">Click to upload thumbnail</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 2MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Main Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Main Image
          </label>
          <div {...getMainImageRootProps()} className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <input
              {...getMainImageInputProps()}
              type="file"
              name="mainImage"
              accept="image/*"
              className="hidden"
              id="main-image-upload"
            />
            <label
              htmlFor="main-image-upload"
              className="cursor-pointer w-full text-center"
            >
              {previews.mainImage ? (
                <img
                  src={previews.mainImage}
                  alt="Main image preview"
                  className="mx-auto max-h-40 object-contain rounded-lg"
                />
              ) : (
                <div className="py-4">
                  <p className="text-gray-500">Click to upload main image</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 2MB</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* YouTube Link Input */}
      <input
        type="url"
        name="youtubeLink"
        value={formData.youtubeLink}
        onChange={handleChange}
        placeholder="Enter YouTube link..."
        className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm text-gray-700 border-2 border-red-300"
      />

      {/* Content Input */}
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Write your article here..."
        rows="20"
        className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700"
        dir={formData.language === 'urdu' ? 'rtl' : 'ltr'}
      />
      {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700"
          >
            <option value="english">English</option>
            <option value="urdu">Urdu</option>
          </select>
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700"
          />
        </div>

        {/* Status Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg text-white ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Submit Article' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

ArticleForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isSubmitting: PropTypes.bool,
};

export default ArticleForm;
