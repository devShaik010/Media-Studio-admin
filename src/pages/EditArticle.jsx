import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticle, updateArticle } from '../supabase/services';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const data = await getArticle(id);
      setArticle(data);
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (articleData) => {
    try {
      setLoading(true);
      setError(null);
      await updateArticle(id, articleData);
      navigate('/manage');
    } catch (err) {
      setError(err.message);
      console.error('Error updating article:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!article) return <div className="text-center text-gray-600 p-6">Article not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <header className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Article</h1>
          <p className="text-gray-600">Update your article details</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <ArticleForm 
          initialData={article}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </div>
    </div>
  );
};

export default EditArticle;