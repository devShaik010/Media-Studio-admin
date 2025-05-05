import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleTable from '../components/ArticleTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticles, deleteArticle } from '../supabase/services';

const ManageArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      setError('Failed to load articles');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      setArticles(prevArticles => 
        prevArticles.filter(article => article.id !== id)
      );
    } catch (error) {
      console.error('Error deleting article:', error);
      setError('Failed to delete article');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Articles</h1>
              <p className="text-sm text-gray-500">
                Total articles: {articles.length}
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Article
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        <ArticleTable 
          articles={articles}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ManageArticles;