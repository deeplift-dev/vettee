import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(90,90,90,0.1),rgba(100,100,100,0))]"></div>
      <div className="flex h-screen flex-row items-center justify-center">
        <div className="w-full">{children}</div>
      </div>
    </>
  );
}
