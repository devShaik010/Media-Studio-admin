import React, { useState, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/index';
import UploadForm from './pages/new';
import ManageArticles from './pages/manage';
import Layout from './components/Layout';
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { supabase } from './supabase/client';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Always logged in for public access
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            {/* Protected Routes */}
            {[
              { path: '/', element: <Dashboard /> },
              { path: '/new', element: <UploadForm /> },
              { path: '/manage', element: <ManageArticles /> },
            ].map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  isLoggedIn ? (
                    <Layout onLogout={handleLogout}>{element}</Layout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
