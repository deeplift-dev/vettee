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
        <div>{children}</div>
      </div>
    </>
  );
}
