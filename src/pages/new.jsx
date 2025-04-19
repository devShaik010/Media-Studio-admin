import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import LoadingSpinner from '../components/LoadingSpinner'; // Fixed import

const UploadForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      // ArticleForm now handles the Supabase upload
      navigate('/manage');
    } catch (error) {
      console.error('Error submitting article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {isSubmitting && <LoadingSpinner />}
      <ArticleForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default UploadForm;