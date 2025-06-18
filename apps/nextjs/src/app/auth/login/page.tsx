"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { useToast } from "~/hooks/use-toast";
import { signInWithGoogle, signInWithPassword } from "../actions";

export default function LoginPage() {
  return (
    <div className="relative ">
      
      {/* Back button */}
      <div className="absolute left-4">
        <Link
          href="/"
          className="rounded border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 px-2 py-1 font-sans text-sm font-medium uppercase text-white transition-colors hover:from-gray-900 hover:to-gray-800"
        >
          Back
        </Link>
      </div>

      {/* Center the sign-in card */}
      <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-white/20 bg-white/5 p-8 shadow-lg backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-bl from-white via-slate-200 to-white bg-clip-text font-vetski text-4xl leading-none text-transparent">
              Vetskii
            </h1>
            <p className="mt-2 text-sm text-zinc-200/80">
              Sign in to your account
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div className="flex w-full flex-col gap-6">
      <form className="flex w-full flex-col gap-4">
        <Input
          className="border-white/20 bg-white/10 py-3 text-white placeholder:text-white/60 focus-visible:ring-white/30"
          type="email"
          name="email"
          placeholder="Email"
        />
        <Input
          className="border-white/20 bg-white/10 py-3 text-white placeholder:text-white/60 focus-visible:ring-white/30"
          type="password"
          name="password"
          placeholder="Password"
        />

        <Button
          className="w-full rounded-lg bg-white py-3 font-medium text-slate-900 transition-colors hover:bg-white/90"
          formAction={
            (async (formData: FormData) => {
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;

              try {
                const res = await signInWithPassword(email, password);
                router.push("/app");
              } catch (error) {
                console.error("Error signing in:", error);
                if (
                  error instanceof Error &&
                  error.message === "Invalid login credentials"
                ) {
                  toast({
                    title: "Invalid login credentials",
                    description: "Please check your email and password.",
                  });
                }
                return;
              }
            }) as unknown as string
          }
        >
          Sign In
        </Button>
      </form>

      <div className="relative flex w-full justify-center border-b border-white/10 py-2">
        <span className="relative z-10 bg-white/5 px-2 text-white">or</span>
      </div>

      <Button
        variant="outline"
        className="flex w-full items-center justify-center gap-2 rounded-lg border-white/20 bg-transparent px-4 py-3 text-zinc-50 transition-colors hover:bg-white/10"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle size={20} />
        Continue with Google
      </Button>
    </div>
  );
};
