import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles, deleteArticle, updateArticleStatus } from '../supabase/services';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';

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
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => navigate(`/edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateArticleStatus(id, newStatus);
      setArticles(articles.map(article => 
        article.id === id ? { ...article, status: newStatus } : article
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[var(--primary-color)]">Manage Articles</h1>
        <button
          onClick={() => navigate('/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New
        </button>
      </div>

      {error && (
        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map(article => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{article.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(article.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FiEdit2 className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(
                      article.id, 
                      article.status === 'published' ? 'draft' : 'published'
                    )}
                    className={`hover:${
                      article.status === 'published' ? 'text-yellow-600' : 'text-green-600'
                    }`}
                    title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {article.status === 'published' ? 
                      <FiX className="inline-block w-5 h-5" /> : 
                      <FiCheck className="inline-block w-5 h-5" />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FiTrash2 className="inline-block w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageArticles;