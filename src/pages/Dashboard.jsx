import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getArticles } from '../supabase/services';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const articles = await getArticles();
        setStats({
          total: articles.length,
          published: articles.filter(a => a.status === 'published').length,
          drafts: articles.filter(a => a.status === 'draft').length
        });
        setRecentArticles(articles.slice(0, 5)); // Only last 5 articles
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEdit = (articleId) => {
    navigate(`/edit/${articleId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Section - Updated colors */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
        MFP, {user?.user_metadata?.full_name || 'Admin'}
        </h1>
        <p className="text-gray-600 font-medium">Here's what's happening with your articles</p>
      </div>

      {/* Stats Grid - Updated colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-gray-700 font-medium">Total Articles</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-gray-700 font-medium">Published</h3>
          <p className="text-3xl font-bold mt-2 text-emerald-600">{stats.published}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-gray-700 font-medium">Drafts</h3>
          <p className="text-3xl font-bold mt-2 text-amber-600">{stats.drafts}</p>
        </div>
      </div>

      {/* Recent Articles - Updated with edit functionality and better visibility */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Articles</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentArticles.length === 0 ? (
            <p className="p-6 text-center text-gray-600 font-medium">No articles yet</p>
          ) : (
            recentArticles.map(article => (
              <div key={article.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{article.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.status === 'published' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {article.status}
                  </span>
                  <button
                    onClick={() => handleEdit(article.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;