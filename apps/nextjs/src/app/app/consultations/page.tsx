import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowRight, PlusCircleIcon } from "lucide-react";

import ConsultsGrid from "~/app/_components/consults/consults-grid";
import SafeArea from "~/app/_components/layout/safe-area";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();
  return (
    <SafeArea>
      <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-8 md:py-10">
        <div className="flex flex-col gap-8">
          {user.data.user && (
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-medium text-white">
                  Consultations
                </h1>
                <p className="mt-1 text-base text-white/60">
                  Manage your consultations and patient records
                </p>
              </div>

              <Link href="/app">
                <button className="group flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-[#0A0A0A] shadow-sm transition-all duration-200 hover:shadow-md">
                  <PlusCircleIcon
                    size={18}
                    className="text-[#0A0A0A] transition-colors duration-200"
                  />
                  New Consultation
                  <ArrowRight
                    size={16}
                    className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </Link>
            </div>
          )}

          {user.data.user ? (
            <>
              <div className="mt-4">
                <ConsultsGrid />
              </div>
            </>
          ) : (
            <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
              <div className="flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-8 text-center shadow-md backdrop-blur-sm">
                <h2 className="text-2xl font-medium text-white">
                  Welcome to Vetskii
                </h2>
                <p className="max-w-md text-white/70">
                  Sign in to start managing your veterinary practice with our
                  advanced consultation tools.
                </p>
                <Link href="/auth/login">
                  <button className="mt-2 flex items-center gap-2 rounded-md bg-white px-5 py-2 text-sm font-medium text-[#0A0A0A] transition-all duration-200 hover:bg-white/90">
                    Sign in to continue
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </SafeArea>
  );
}
