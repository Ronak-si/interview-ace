import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  target_role: string;
  experience_level: string;
  bio: string | null;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ needsEmail: boolean }>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Central auth state for the whole app.
 *
 * Notes for reviewers:
 *  - onAuthStateChange is registered FIRST so no event is missed.
 *  - Profile loading is deferred out of the callback to avoid deadlocks.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Guards against re-fetching the same profile on every auth event (token refresh,
  // tab focus, INITIAL_SESSION + getSession racing) — that was the duplicate-request storm.
  const loadedForRef = useRef<string | null>(null);

  const loadProfile = useCallback(async (userId: string, force = false) => {
    if (!force && loadedForRef.current === userId) return;
    loadedForRef.current = userId;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, target_role, experience_level, bio")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      loadedForRef.current = null;
      console.error("[auth] failed to load profile", error.message);
      return;
    }
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
      if (nextSession?.user) {
        const uid = nextSession.user.id;
        // defer: never call another supabase fn synchronously inside this callback
        setTimeout(() => void loadProfile(uid), 0);
      } else {
        loadedForRef.current = null;
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) void loadProfile(data.session.user.id);
    });

    return () => subscription.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName },
      },
    });
    if (error) throw new Error(error.message);
    // With email confirmation enabled the session is null until the link is clicked.
    return { needsEmail: !data.session };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) throw new Error(result.error.message ?? "Google sign-in failed");
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
      if (error) throw new Error(error.message);
      setProfile((current) => (current ? { ...current, ...patch } : current));
    },
    [user],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      sendPasswordReset,
      updatePassword,
      updateProfile,
      signOut,
    }),
    [
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      sendPasswordReset,
      updatePassword,
      updateProfile,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
