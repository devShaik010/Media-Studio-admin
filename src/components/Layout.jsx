import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8 font-serif">
        <div className="max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;