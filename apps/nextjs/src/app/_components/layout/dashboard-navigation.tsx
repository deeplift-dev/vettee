import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Bell,
  CircleUserRoundIcon,
  LogOutIcon,
  RowsIcon,
  Search,
} from "lucide-react";

import { signOut } from "~/app/auth/actions";
import NewConsultButton from "../consults/new-consult-button";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const dynamic = "force-dynamic";

export default async function DashboardNavigation() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0A0A0A]/80 p-2 backdrop-blur-md md:p-2">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/app">
            <h1 className="bg-gradient-to-bl from-white via-slate-100 to-white bg-clip-text font-vetski text-lg leading-normal text-transparent md:text-xl">
              Vetskii
            </h1>
          </Link>

          {user.data.user && (
            <div className="items-center gap-4 md:flex md:gap-6">
              <NewConsultButton />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <MenuItems user={user.data.user} />
          <DashboarDropdown />
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
  return <div className="flex items-center gap-2 md:gap-4"></div>;
};

const DashboarDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-white">
        <CircleUserRoundIcon className="h-6 w-6 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border-gray-700 bg-black text-slate-50"
        align="end"
      >
        <DropdownMenuItem>
          {" "}
          <Link
            className="flex flex-row items-center space-x-4"
            href="/app/consultations"
          >
            <RowsIcon className="h-4 w-4" />
            <div>Consults</div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {" "}
          <form className="flex items-center space-x-4" action={signOut}>
            <LogOutIcon className="h-4 w-4" />
            <button>Sign out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
