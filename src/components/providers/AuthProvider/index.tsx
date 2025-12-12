"use client";

import React, { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userAuth/userAuthSlice";
import { setTheme } from "@/redux/slices/Theme/themeSlice";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/supabase/supabase-client";

type AuthProviderProps = { children: ReactNode };

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/forgot-password"];

function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

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

      if (PUBLIC_ROUTES.includes(pathname)) {
        router.push("/");
      }
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
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          dispatch(setUser(null));
          if (!PUBLIC_ROUTES.includes(pathname)) {
            router.push("/sign-in");
          }
        }
      } catch (err) {
        console.error(err);
        dispatch(setUser(null));
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.push("/sign-in");
        }
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          dispatch(setUser(null));
          if (!PUBLIC_ROUTES.includes(pathname)) {
            router.push("/sign-in");
          }
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [pathname]);

  return <main className="h-full">{children}</main>;
}

export default AuthProvider;
