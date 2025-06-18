"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "~/utils/supabase/client";

export default function OAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      const handleOAuthCallback = async () => {
        try {
          const supabase = createClient();
          
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Error exchanging code for session:", error);
            // Clear the code from URL and show login form
            router.push("/auth/login");
            return;
          }

          // Success - redirect to app
          router.push("/app");
        } catch (error) {
          console.error("OAuth callback error:", error);
          router.push("/auth/login");
        }
      };

      handleOAuthCallback();
    }
  }, [code, router]);

  if (code) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
          <p>Completing sign in...</p>
        </div>
      </div>
    );
  }

  return null;
}