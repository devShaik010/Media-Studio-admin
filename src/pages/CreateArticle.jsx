import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { addArticle } from '../supabase/services';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (articleData) => {
    try {
      setLoading(true);
      setError(null);
      
      await addArticle(articleData);
      
      // Show success notification
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/manage');
      }, 2000);

    } catch (err) {
      setError('Failed to create article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <header className="px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Article</h1>
          <p className="mt-1 text-sm text-gray-600">Add a new article to your dashboard</p>
        </header>

        <div className="p-6">
          {showSuccess && (
            <div className="notification notification-success border mb-4">
              Article uploaded successfully!
            </div>
          )}

          {error && (
            <div className="notification notification-error border mb-4">
              {error}
            </div>
          )}

          <div className="border rounded-lg p-4">
            <ArticleForm 
              onSubmit={handleSubmit}
              isSubmitting={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;