import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Bell, Search } from "lucide-react";

import { signOut } from "~/app/auth/actions";

export default async function DashboardNavigation() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0A0A0A]/80 p-3 backdrop-blur-md md:p-4">
      <div className="flex items-center gap-8">
        <Link href="/vetski">
          <h1 className="bg-gradient-to-bl from-white via-slate-100 to-white bg-clip-text font-vetski text-xl leading-normal text-transparent">
            Vetski
          </h1>
        </Link>

        {user.data.user && (
          <div className="hidden items-center gap-6 md:flex">
            <Link
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              href="/vetski/consultations"
            >
              Consults
            </Link>
            <Link
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              href="/vetski/patients"
            >
              Patients
            </Link>
          </div>
        )}
      </div>
      <div>
        <MenuItems user={user.data.user} />
      </div>
    </nav>
  );
}

type User = any;

const MenuItems = ({ user }: { user: User }) => {
  if (!user) {
    return (
      <Link href="/auth/login">
        <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-white/90">
          Sign In
        </div>
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-4 md:gap-6">
      <button className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white">
        <Search className="h-5 w-5" />
      </button>
      <button className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white">
        <Bell className="h-5 w-5" />
      </button>
      <form action={signOut}>
        <button className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
          Sign out
        </button>
      </form>
    </div>
  );
};
