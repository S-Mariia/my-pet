"use client";

import React, { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userAuth/userAuthSlice";
import { setTheme } from "@/redux/slices/Theme/themeSlice";
import { supabase } from "@/supabase/supabase-client";

type AuthProviderProps = { children: ReactNode };

function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  const loadUserProfile = async (user: any) => {
    try {
      let { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        const { data: upsertedProfile, error: upsertError } = await supabase
          .from("users")
          .upsert(
            [
              {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || "",
                created_at: new Date().toISOString(),
              },
            ],
            { onConflict: "id" }
          )
          .select()
          .single();

        if (upsertError) throw upsertError;
        profile = upsertedProfile;
      }

      dispatch(
        setUser({
          displayName:
            profile?.full_name || user.user_metadata?.full_name || null,
          email: user.email,
          phoneNumber: user.phone,
          photoURL:
            profile?.avatar_url || user.user_metadata?.avatar_url || null,
          uid: user.id,
          emailVerified: !!user.email_confirmed_at,
        })
      );
    } catch (err) {
      console.error("Error loading user profile:", err);
      dispatch(
        setUser({
          displayName: user.user_metadata?.full_name || null,
          email: user.email,
          phoneNumber: user.phone,
          photoURL: user.user_metadata?.avatar_url || null,
          uid: user.id,
          emailVerified: !!user.email_confirmed_at,
        })
      );
    }
  };

  useEffect(() => {
    const initialTheme = localStorage.getItem("theme") as "light" | "dark";
    if (initialTheme) dispatch(setTheme(initialTheme));

    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (!error && session?.user) {
        await loadUserProfile(session.user);
      } else {
        dispatch(setUser(null));
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          dispatch(setUser(null));
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}

export default AuthProvider;
