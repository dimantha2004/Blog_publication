'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../app/lib/supabase';
import { User } from '@supabase/supabase-js';
import { getProductByPriceId } from '../app/lib/stripe-config';

interface AuthUser extends User {
  subscription?: {
    status: string;
    price_id: string | null;
    product_name?: string;
    current_period_end: number | null;
    cancel_at_period_end: boolean;
  } | null;
  is_premium?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserSubscription = async (userId: string) => {
    try {
      const { data: subscription, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      if (!subscription) {
        return null;
      }

      const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;

      return {
        status: subscription.subscription_status,
        price_id: subscription.price_id,
        product_name: product?.name,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error || !authUser) {
        setUser(null);
        return;
      }

      // Fetch extra profile info (is_premium)
      const { data: profile } = await supabase.from('users').select('is_premium').eq('id', authUser.id).single();

      const subscription = await fetchUserSubscription(authUser.id);
      
      setUser({
        ...authUser,
        is_premium: profile?.is_premium ?? false,
        subscription,
      });
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
        } else if (session?.user) {
          const subscription = await fetchUserSubscription(session.user.id);
          // Fetch extra profile info (is_premium)
          const { data: profile } = await supabase.from('users').select('is_premium').eq('id', session.user.id).single();
          setUser({
            ...session.user,
            is_premium: profile?.is_premium ?? false,
            subscription,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userSubscription = await fetchUserSubscription(session.user.id);
        // Fetch extra profile info (is_premium)
        const { data: profile } = await supabase.from('users').select('is_premium').eq('id', session.user.id).single();
        setUser({
          ...session.user,
          is_premium: profile?.is_premium ?? false,
          subscription: userSubscription,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Upsert user profile row
        await supabase.from('users').upsert([
          { id: data.user.id, is_premium: false }
        ]);
        const subscription = await fetchUserSubscription(data.user.id);
        // Fetch extra profile info (is_premium)
        const { data: profile } = await supabase.from('users').select('is_premium').eq('id', data.user.id).single();
        setUser({
          ...data.user,
          is_premium: profile?.is_premium ?? false,
          subscription,
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Upsert user profile row
        await supabase.from('users').upsert([
          { id: data.user.id, is_premium: false }
        ]);
        const subscription = await fetchUserSubscription(data.user.id);
        // Fetch extra profile info (is_premium)
        const { data: profile } = await supabase.from('users').select('is_premium').eq('id', data.user.id).single();
        setUser({
          ...data.user,
          is_premium: profile?.is_premium ?? false,
          subscription,
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}