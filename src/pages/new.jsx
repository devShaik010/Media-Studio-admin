import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';

const UploadForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('New article data:', formData);
      
      // Navigate to manage page after successful submission
      navigate('/manage');
    } catch (error) {
      console.error('Error submitting article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ArticleForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default UploadForm;