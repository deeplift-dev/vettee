import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import ConsultsGrid from "~/app/_components/consults/consults-grid";
import SafeArea from "~/app/_components/layout/safe-area";
import LandingHero from "~/app/_components/marketing/landing-hero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();
  return (
    <SafeArea>
      {user.data.user ? (
        <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-8 md:py-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-medium text-white">
                  Consultations
                </h1>
                <p className="mt-1 text-base text-white/60">
                  Manage your consultations and patient records
                </p>
              </div>
            </div>

            <div className="mt-4">
              <ConsultsGrid />
            </div>
          </div>
        </div>
      ) : (
        <LandingHero />
      )}
    </SafeArea>
  );
}
