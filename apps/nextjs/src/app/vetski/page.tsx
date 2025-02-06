import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusCircleIcon } from "lucide-react";

import ConsultsGrid from "../_components/consults/consults-grid";
import SafeArea from "../_components/layout/safe-area";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();
  return (
    <SafeArea>
      <div className="mx-auto max-w-screen-xl md:p-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between">
            {user.data.user ? (
              <Link href="/vetski/consults/new">
                <button className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-4 py-2 text-center text-zinc-50 transition-all duration-300 hover:bg-white/10 sm:w-auto">
                  <PlusCircleIcon
                    size={18}
                    className="text-zinc-400 transition-colors duration-200 group-hover:text-zinc-50"
                  />
                  New Consultation
                </button>
              </Link>
            ) : null}
          </div>
          {user.data.user ? (
            <ConsultsGrid />
          ) : (
            <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
              <Link href="/auth/login">
                <button className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-4 py-2 text-center text-zinc-50 transition-all duration-300 hover:bg-white/10 sm:w-auto">
                  Sign in to start consulting
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </SafeArea>
  );
}
