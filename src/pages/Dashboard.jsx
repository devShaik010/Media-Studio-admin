import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getArticles } from '../supabase/services';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const articles = await getArticles();
      
      // Calculate stats
      setStats({
        total: articles.length,
        published: articles.filter(a => a.status === 'published').length,
        drafts: articles.filter(a => a.status === 'draft').length,
      });

      // Get recent articles
      setRecentArticles(articles.slice(0, 5));
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.user_metadata?.full_name || 'Admin'}
        </h1>
        <p className="text-gray-500">Here's what's happening with your articles</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Articles</h3>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Published</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.published}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Drafts</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.drafts}</p>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Articles</h2>
        </div>
        <div className="divide-y">
          {recentArticles.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No articles yet</p>
          ) : (
            recentArticles.map(article => (
              <div key={article.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  article.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {article.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;