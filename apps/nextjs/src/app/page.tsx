import { MoveRight } from "lucide-react";

import LogoText from "~/ui/logo-text";

export const runtime = "edge";

export default async function HomePage() {
  return (
    <main className="via-gay-100 to-white-100 flex h-screen items-center justify-around bg-gradient-to-br from-green-100">
      <div className="mx-auto flex w-full max-w-6xl flex-row items-center px-24">
        <div className="container float-right mt-12 flex h-full flex-col justify-center gap-4 py-8">
          <LogoText />
          <div className="mb-4"></div>
          <div className="max-w-xl cursor-pointer text-6xl font-light leading-[0.9] text-slate-700 duration-300">
            The ultimate companion for your companion.
          </div>
          <div>
            <div className="text-2xl font-light text-slate-700">
              Access a unique, high quality pet care experience from the comfort
              of your home.
            </div>
          </div>
          <div>
            <div className="flex w-48 cursor-pointer items-center justify-center space-x-2 rounded-full border border-gray-200 bg-slate-50 px-2.5 py-1 text-lg font-light text-slate-900 shadow-sm transition-all duration-300 hover:bg-slate-900 hover:text-slate-50 hover:shadow-none">
              <div>Request an invite</div>
              <div>
                <MoveRight />
              </div>
            </div>
          </div>
        </div>
        <div className="pr-24">
          <img
            className="h-full object-contain"
            src="https://jtgxffbpsnibgzbhaewx.supabase.co/storage/v1/object/public/assets/animal-profile.svg"
            alt="Vettee"
          />
        </div>
      </div>
    </main>
  );
}
