import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import Login from './Login';
import Dashboard from '../pages/Dashboard';
import ManageArticles from '../pages/ManageArticles';
import CreateArticle from '../pages/CreateArticle';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" /> : <Login />} 
      />
      
      {/* Protected Routes */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/manage"
          element={user ? <ManageArticles /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={user ? <CreateArticle /> : <Navigate to="/login" />}
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;