import { supabase } from './supabase/client';

const testUserSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (session?.user) {
      console.log('User Profile:', {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name,
        avatar: session.user.user_metadata?.avatar_url
      });
    } else {
      console.log('No active session');
    }
  } catch (error) {
    console.error('Session check error:', error.message);
  }
};

testUserSession();