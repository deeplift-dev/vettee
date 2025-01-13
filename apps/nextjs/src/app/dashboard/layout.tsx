import { ReactNode } from "react";

import DashboardNavigation from "../_components/layout/dashboard-navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="h-screen w-full overflow-hidden">
        <DashboardNavigation />
        <div className="h-full overflow-y-auto pb-12">{children}</div>
      </div>
    </>
  );
}
