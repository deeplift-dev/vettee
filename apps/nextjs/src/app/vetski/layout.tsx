import { ReactNode } from "react";

import DashboardNavigation from "../_components/layout/dashboard-navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="h-screen w-full overflow-hidden bg-[#0A0A0A]">
        <DashboardNavigation />
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 h-full overflow-y-auto pb-12">
          {children}
        </div>
      </div>
    </>
  );
}
