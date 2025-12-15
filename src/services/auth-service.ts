import { supabase } from "@/supabase/supabase-client";

class AuthService {
  async signUp(email: string, password: string, fullName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + "/email-confirmed",
      },
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error("User not created");

    return authData.user;
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

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return data.url;
  }

  async handleOAuthCallback() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user?.email) return null;

    await supabase.from("users").upsert(
      {
        email: user.email,
        full_name: user.user_metadata.full_name ?? "",
        created_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    return user;
  }

  async upsertUserProfile(user: { email: string; full_name?: string }) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (existingUser) {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: user.full_name ?? existingUser.full_name,
        })
        .eq("email", user.email);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from("users").insert([
        {
          email: user.email,
          full_name: user.full_name ?? "",
          created_at: new Date().toISOString(),
        },
      ]);
      if (insertError) throw insertError;
    }
  }
}

export const authService = new AuthService();
