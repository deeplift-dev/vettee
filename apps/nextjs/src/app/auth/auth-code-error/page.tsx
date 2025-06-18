import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/20 bg-white/5 p-8 shadow-lg backdrop-blur-md">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Authentication Error
          </h1>
          <p className="mb-6 text-white/70">
            There was an error with the authentication process. Please try again.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg bg-white px-6 py-3 font-medium text-slate-900 transition-colors hover:bg-white/90"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}