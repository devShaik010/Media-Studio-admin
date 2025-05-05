import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              News Dashboard
            </Link>
            
            <div className="hidden md:flex items-center ml-10 space-x-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Dashboard
              </Link>
              <Link 
                to="/create" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Create Article
              </Link>
              <Link 
                to="/manage" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Manage Articles
              </Link>
            </div>
          </div>

          {/* User profile and sign out */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700">
                  {user.email}
                </span>
                <span className="text-xs text-gray-500">
                  {user.user_metadata?.full_name || 'User'}
                </span>
              </div>
              
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              )}
              
              <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-800 px-3 py-2"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;