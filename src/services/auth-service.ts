import { supabase } from "@/supabase/supabase-client";

class AuthService {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (authError) throw authError;
    if (!data.user) throw new Error("User not created");

    const { error: profileError } = await supabase.from("users").insert([
      {
        email: email,
        full_name: fullName,
        created_at: new Date().toISOString(),
      },
    ]);
    if (profileError) throw profileError;

    return data.user;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
}

export const authService = new AuthService();
