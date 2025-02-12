"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const supabase = createServerActionClient({ cookies });

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
  const supabase = createServerActionClient({ cookies });
  const origin = headers().get("origin");

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data.user;
};

export const signInWithGithub = async () => {
  const origin = headers().get("origin");
  const supabase = createServerActionClient({ cookies });

  const res = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (res.data.url) redirect(res.data.url);
  throw res.error;
};

export const signOut = async () => {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  redirect("/vetski");
};
