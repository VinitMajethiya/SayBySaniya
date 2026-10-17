import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = useCallback(async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser || !currentUser.email) {
      setIsAdmin(false);
      return false;
    }

    try {
      // 1. Try checking admin_users table directly
      const { data, error: tableError } = await supabase
        .from('admin_users')
        .select('id, role')
        .ilike('email', currentUser.email)
        .maybeSingle();

      if (!tableError && data) {
        setIsAdmin(true);
        return true;
      }

      // 2. Fallback to RPC function
      const { data: rpcAdmin, error: rpcError } = await supabase.rpc('is_admin');
      if (!rpcError && rpcAdmin === true) {
        setIsAdmin(true);
        return true;
      }

      setIsAdmin(false);
      return false;
    } catch {
      setIsAdmin(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted && session?.user) {
          setUser(session.user);
          await checkAdminStatus(session.user);
        }
      } catch (err) {
        if (isMounted) setError((err as Error).message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          await checkAdminStatus(currentUser);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error('Sign-in failed. Please try again.');

      const isAllowlisted = await checkAdminStatus(data.user);
      if (!isAllowlisted) {
        await supabase.auth.signOut();
        throw new Error(
          'Access denied. This email is not registered on the Say By Saniya admin allowlist.'
        );
      }

      setUser(data.user);
      setIsAdmin(true);
      return data.user;
    } catch (err) {
      const message = (err as Error).message || 'Authentication failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { user, isAdmin, loading, error, login, logout };
}
