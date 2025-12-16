"use client";

import React, { ReactNode, useEffect } from "react";
import { supabase } from "@/supabase/supabase-client";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userAuth/userAuthSlice";
import { setTheme } from "@/redux/slices/Theme/themeSlice";
import { useRouter } from "next/navigation";
import { setLoading } from "@/redux/slices/loading/loadingSlice";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleUser = async (user: any | null) => {
    if (!user) {
      dispatch(setUser(null));
      return;
    }

    try {
      let { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        const { data: newProfile, error: upsertError } = await supabase
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
        profile = newProfile;
      }

      dispatch(
        setUser({
          uid: user.id,
          email: user.email,
          phoneNumber: user.phone,
          displayName:
            profile?.full_name || user.user_metadata?.full_name || null,
          photoURL:
            profile?.avatar_url || user.user_metadata?.avatar_url || null,
        })
      );
    } catch (e) {
      console.error("profile load error", e);
      dispatch(
        setUser({
          uid: user.id,
          email: user.email,
          phoneNumber: user.phone,
          displayName: user.user_metadata?.full_name || null,
          photoURL: user.user_metadata?.avatar_url || null,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(setLoading(false));
    const theme = localStorage.getItem("theme") as "light" | "dark";
    if (theme) dispatch(setTheme(theme));

    supabase.auth.getSession().then(({ data }) => {
      handleUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <main className="h-full">{children}</main>;
}
