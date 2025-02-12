"use client";

import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import SafeArea from "~/app/_components/layout/safe-area";
import { useToast } from "~/hooks/use-toast";
import { signInWithGoogle, signInWithPassword } from "../actions";

export default function LoginPage() {
  return (
    <SafeArea>
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="bg-gradient-to-bl from-white via-slate-200 to-white bg-clip-text font-vetski text-3xl leading-normal text-transparent">
            Vetski
          </div>
          <LoginForm />
        </div>
      </div>
    </SafeArea>
  );
}

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-6">
      <h1 className="text-xl font-light tracking-tight">Sign In</h1>
      <form className="flex w-full flex-col gap-3">
        <input
          className="w-full rounded-full bg-white bg-opacity-5 px-4 py-3 text-lg font-light text-zinc-200 transition hover:bg-white/10"
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="w-full rounded-full bg-white bg-opacity-5 px-4 py-3 text-lg font-light text-zinc-200 transition hover:bg-white/10"
          type="password"
          name="password"
          placeholder="Password"
        />

        <button
          className="w-full rounded-full bg-slate-400/10 py-3 font-semibold text-zinc-50 no-underline transition hover:bg-slate-400/20"
          formAction={async (formData) => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
              const res = await signInWithPassword(email, password);
              router.push("/vetski");
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
          }}
        >
          Sign In
        </button>
        {/* <button
          className="text-sm text-zinc-50"
          formAction={async (formData) => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            await signUp(email, password);
            alert("Check your email for a confirmation link.");
          }}
        >
          {`Don't have an account? Sign up.`}
        </button> */}
      </form>

      <div className="relative flex w-full justify-center border-b border-white/10 py-2">
        <span className="absolute top-1 px-2 text-white">or</span>
      </div>

      <button
        className="flex w-full items-center justify-center gap-1 rounded-full border border-white border-opacity-10 bg-transparent px-4 py-3 text-zinc-50 no-underline transition hover:bg-white/10"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle size={20} />
        Continue with Google
      </button>
    </div>
  );
};
