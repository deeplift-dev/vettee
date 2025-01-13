import Link from "next/link";

import ConsultsGrid from "../_components/consults/consults-grid";
import SafeArea from "../_components/layout/safe-area";

export default function DashboardPage() {
  return (
    <SafeArea>
      <div className="mx-auto max-w-screen-xl md:p-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between">
            <h2 className="text-2xl font-bold">Recent consultations</h2>
            <Link href="/dashboard/consults/new">
              <button className="rounded-full bg-white p-2.5 font-normal text-gray-900 transition-all duration-300 hover:bg-white/90">
                New Consultation
              </button>
            </Link>
          </div>
          <ConsultsGrid />
        </div>
      </div>
    </SafeArea>
  );
}
