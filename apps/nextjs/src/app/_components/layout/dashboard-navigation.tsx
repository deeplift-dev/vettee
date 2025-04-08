import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Bell, RowsIcon, Search } from "lucide-react";

import { signOut } from "~/app/auth/actions";
import NewConsultButton from "../consults/new-consult-button";
import { Button } from "../ui/button";

export default async function DashboardNavigation() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0A0A0A]/80 p-2 backdrop-blur-md md:p-2">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/vetski">
            <h1 className="bg-gradient-to-bl from-white via-slate-100 to-white bg-clip-text font-vetski text-lg leading-normal text-transparent md:text-xl">
              Vetski
            </h1>
          </Link>

          {user.data.user && (
            <div className="hidden items-center gap-4 md:flex md:gap-6">
              <Link
                className="flex items-center space-x-2 text-xs font-medium text-white/70 transition-colors hover:text-white md:text-sm"
                href="/vetski/consultations"
              >
                <RowsIcon className="h-4 w-4" />
                <div>Consults</div>
              </Link>
              <NewConsultButton />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <MenuItems user={user.data.user} />
        </div>
      </div>
    </nav>
  );
}

type User = any;

const MenuItems = ({ user }: { user: User }) => {
  if (!user) {
    return (
      <Link href="/auth/login">
        <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#0A0A0A] transition-colors hover:bg-white/90 md:px-4 md:py-2 md:text-sm">
          Sign In
        </div>
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <form action={signOut}>
        <button className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/10 md:px-4 md:py-2 md:text-sm">
          Sign out
        </button>
      </form>
    </div>
  );
};
