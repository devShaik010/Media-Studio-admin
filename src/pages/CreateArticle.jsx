import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { addArticle } from '../supabase/services';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (articleData) => {
    try {
      setLoading(true);
      setError(null);
      
      await addArticle(articleData);
      navigate('/manage');
    } catch (err) {
      setError(err.message);
      console.error('Error creating article:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <header className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
          <p className="text-sm text-gray-500">Add a new article to your dashboard</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading && <LoadingSpinner />}

        <ArticleForm 
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </div>
    </div>
  );
};

export default CreateArticle;