import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

// Move allowed emails to a constant
const ALLOWED_EMAILS = ["skabrar.engineer@gmail.com", "mediafocuspoint1@gmail.com"];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUnauthorizedAccess = async (email) => {
    await supabase.auth.signOut();
    setUser(null);
    toast.error(`Access denied. This email (${email}) is not authorized.`);
  };

  const checkAuthorizedUser = async (session) => {
    if (session?.user) {
      if (ALLOWED_EMAILS.includes(session.user.email)) {
        setUser(session.user);
      } else {
        await handleUnauthorizedAccess(session.user.email);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        await checkAuthorizedUser(session);
      } catch (error) {
        console.error('Auth error:', error.message);
        toast.error('Authentication error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        await checkAuthorizedUser(session);
      } catch (error) {
        console.error('Auth state change error:', error.message);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
