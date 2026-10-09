import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. On app start, check whether someone is already logged in,
  //    then keep listening for login/logout events.
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError(`Could not check your sign-in status: ${sessionError.message}`);
      setSession(data.session);
      setLoading(false);
    }).catch((sessionError) => {
      setError(`Could not check your sign-in status: ${sessionError.message}`);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) setProfile(null);
        setError("");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 2. When someone is logged in, load their name and role from "profiles".
  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    const loadProfile = async () => {
      try {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", session.user.id)
          .single();
        if (cancelled) return;
        if (profileError) setError(`Could not load your profile: ${profileError.message}`);
        setProfile(data ?? null);
      } catch (profileLoadError) {
        if (!cancelled) setError(`Could not load your profile: ${profileLoadError.message}`);
      }
    };
    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile, loading, error, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}