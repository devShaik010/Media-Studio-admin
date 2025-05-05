import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { FiHome, FiEdit, FiList, FiLogOut } from 'react-icons/fi';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/create', icon: FiEdit, label: 'Create' },
    { path: '/manage', icon: FiList, label: 'Manage' },
  ];

  return (
    <nav className="bg-white border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-[var(--primary-color)]">
            MFP Admin
            </span>
            
            <div className="hidden md:flex items-center ml-10 space-x-4">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(path)
                      ? 'text-[var(--primary-color)] bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">
                    {user.email}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.user_metadata?.full_name || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600"
                  title="Sign out"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;