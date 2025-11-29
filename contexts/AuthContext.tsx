// Auth Context with Supabase Integration
import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { User, UserRole } from '../types';
import { sendOTP, verifyOTP, signOut, initAuthSession, subscribeToAuthChanges } from '../supabaseHelpers';
import { useData } from './DataContext';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';

interface MinimalProfileData {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loadingAuth: boolean;
  // OTP based
  login: (email: string) => Promise<boolean>; // send OTP
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; needsOnboarding: boolean }>;

  // Password based
  loginWithPassword: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; createdMinimal?: boolean }>;
  registerWithPassword: (profileData: MinimalProfileData, password: string) => Promise<void>;

  // Legacy profile creation (after OTP flow)
  registerProfile: (profileData: Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl' | 'walletBalance'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { users, addUser } = useData();

  // Initialize auth session on mount
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const profile = await initAuthSession();
        if (mounted && profile) {
          setUser(profile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoadingAuth(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(({ session, profile }) => {
      if (profile) {
        setUser(profile);
      } else if (!session) {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  // Update user when users list changes (for profile updates)
  useEffect(() => {
    if (user) {
      const updatedUser = users.find(u => u.id === user.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    }
  }, [users, user]);

  // OTP Login (request code)
  const login = async (email: string): Promise<boolean> => {
    try {
      await sendOTP(email);
      toast.info('Check your email for the login code');
      return true;
    } catch (error: any) {
      toast.error('Failed to send code: ' + error.message);
      return false;
    }
  };

  // Verify OTP
  const verifyCode = async (email: string, code: string): Promise<{ success: boolean; needsOnboarding: boolean }> => {
    try {
      const { profile } = await verifyOTP(email, code);
      
      if (profile) {
        setUser(profile);
        return { success: true, needsOnboarding: false };
      } else {
        // Authenticated but no profile exists – auto-create minimal VENDOR profile and continue to dashboard
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          toast.error('Authenticated user not found');
          return { success: false, needsOnboarding: false };
        }
        const newUser: User = {
          id: authUser.id,
          name: email.split('@')[0],
          email: email.toLowerCase(),
          role: UserRole.VENDOR,
          location: '',
          farmSize: '',
          businessName: '',
          rating: 0,
          reviews: 0,
          avatarUrl: '',
          walletBalance: 0,
        } as User;
        const created = await addUser(newUser);
        setUser(created);
        toast.success('Welcome! Your vendor account has been set up.');
        return { success: true, needsOnboarding: false };
      }
    } catch (error: any) {
      toast.error('Invalid code: ' + error.message);
      return { success: false, needsOnboarding: false };
    }
  };

  // Password login with optional minimal profile auto-creation
  const loginWithPassword = async (email: string, password: string, role?: UserRole): Promise<{ success: boolean; createdMinimal?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session) {
        toast.error('Login failed');
        return { success: false };
      }
      const profile = await initAuthSession();
      if (profile) {
        setUser(profile);
        return { success: true };
      }
      // No profile row exists - create a minimal one if role provided (default to VENDOR to unblock vendor login)
      const effectiveRole = role || UserRole.VENDOR;
      const authUser = data.user;
      const newUser: User = {
        id: authUser.id,
        name: email.split('@')[0],
        email,
        role: effectiveRole,
        location: '',
        farmSize: '',
        businessName: '',
        rating: 0,
        reviews: 0,
        avatarUrl: '',
        walletBalance: 0,
      } as User;
      const created = await addUser(newUser);
      setUser(created);
      toast.success('Account activated. Complete your profile.');
      return { success: true, createdMinimal: true };
    } catch (error: any) {
      toast.error(error.message || 'Password login failed');
      return { success: false };
    }
  };

  // Password-based registration (sign up + create minimal profile row)
  const registerWithPassword = async (
    profileData: MinimalProfileData,
    password: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: profileData.email, 
        password,
        options: { emailRedirectTo: window.location.origin + '/#/login' }
      });
      if (error) throw error;

      // Some projects require email confirmation before a session exists.
      // Attempt to fetch a session; if none, inform the user and return early.
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.info('Check your email to confirm your account, then log in.');
        return; // Do not create profile yet; RLS would fail without auth.uid()
      }

      const authUser = data.user || sessionData.session.user;
      if (!authUser) throw new Error('User not created');

      const newUser: User = {
        id: authUser.id,
        name: profileData.name,
        email: profileData.email.toLowerCase(),
        role: profileData.role,
        // defaults for later profile update
        location: '',
        farmSize: '',
        businessName: '',
        rating: 0,
        reviews: 0,
        avatarUrl: '',
        walletBalance: 0,
      } as User;
      const created = await addUser(newUser);
      setUser(created);
      toast.success('Account created. You can now access your dashboard.');
    } catch (error: any) {
      toast.error('Registration failed: ' + error.message);
      throw error;
    }
  };

  // Legacy profile creation after OTP auth
  const registerProfile = async (profileData: Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl' | 'walletBalance'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        throw new Error('No authenticated user found');
      }

      const newUser: User = {
        ...profileData,
        id: authUser.id,
        rating: 0,
        reviews: 0,
        avatarUrl: '',
        walletBalance: 0,
      };

      const createdUser = await addUser(newUser);
      setUser(createdUser);
      toast.success('Profile created successfully!');
    } catch (error: any) {
      toast.error('Failed to create profile: ' + error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      toast.info('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed: ' + error.message);
    }
  };

  const value = useMemo(() => ({
    user,
    loadingAuth,
    login,
    verifyCode,
    loginWithPassword,
    registerWithPassword,
    registerProfile,
    logout,
  }), [user, loadingAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
