import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleTable from '../components/ArticleTable';
import { getArticles, deleteArticle } from '../services/articleService';

const ManageArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    navigate(`/edit/${article.id}`, { state: { article } });
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(articleId);
        setArticles(articles.filter(article => article.id !== articleId));
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Articles</h1>
        <button 
          onClick={() => navigate('/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          New Article
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <ArticleTable 
          articles={articles} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ManageArticles;