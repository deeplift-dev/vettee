"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies().set(name, value, options);
          });
        },
      },
    },
  );
}

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const supabase = createSupabaseServerClient();

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.message === "Invalid login credentials") {
      throw new Error("Invalid login credentials");
    }

    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  const supabase = createSupabaseServerClient();
  const origin = headers().get("origin");

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) throw error;
  return data.user;
};

export const signInWithGoogle = async () => {
  const origin = headers().get("origin");
  const supabase = createSupabaseServerClient();

  const res = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/api/auth/callback` },
  });

  if (res.data.url) redirect(res.data.url);
  throw res.error;
};

export const signOut = async () => {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/app");
};
