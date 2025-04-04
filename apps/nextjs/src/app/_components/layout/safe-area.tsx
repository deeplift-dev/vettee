import { ReactNode } from "react";

interface SafeAreaProps {
  children: ReactNode;
}

export default function SafeArea({ children }: SafeAreaProps) {
  return <div className="overflow-y-hidden pt-14 text-white">{children}</div>;
}
