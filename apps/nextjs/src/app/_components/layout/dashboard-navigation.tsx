import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { signOut } from "~/app/auth/actions";

export default async function DashboardNavigation() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();

  return (
    <nav className="flex items-center justify-between border-b border-white border-opacity-10 bg-transparent p-2 dark:bg-transparent md:p-4">
      <div>
        <Link href="/vetski" legacyBehavior>
          <h1 className="bg-gradient-to-br from-white via-slate-100 to-white bg-clip-text font-vetski text-xl leading-normal text-transparent md:text-2xl">
            Vetski
          </h1>
        </Link>
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
        <div className="rounded-full bg-slate-400/10 px-4 py-2 text-white">
          Sign In
        </div>
      </Link>
    );
  }
  return (
    <div className="flex items-center text-sm text-slate-300 transition-colors duration-500 md:gap-6 md:text-base">
      {/* <Link
        className="rounded-full px-4 py-2 transition-colors duration-500 hover:bg-white/10 hover:text-white"
        href="/vetski/consultations"
      >
        Consults
      </Link>
      <Link
        className="rounded-full px-4 py-2 transition-colors duration-500 hover:bg-white/10 hover:text-white"
        href="/vetski/patients"
      >
        Patients
      </Link> */}
      <form action={signOut}>
        <button className="rounded-full px-4 py-2 transition-colors duration-500 hover:bg-white/10 hover:text-white">
          Sign out
        </button>
      </form>
    </div>
  );
};
