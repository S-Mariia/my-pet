"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabase-client";

export default function NotFoundRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const pathname = window.location.pathname;
      if (pathname.startsWith("/reset-password")) return;

      if (session?.user) {
        router.replace("/");
      } else {
        router.replace("/sign-in");
      }
    };

    checkUser();
  }, [router]);

  return null;
}
