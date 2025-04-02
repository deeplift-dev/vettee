import { ReactNode } from "react";

interface SafeAreaProps {
  children: ReactNode;
}

export default function SafeArea({ children }: SafeAreaProps) {
  return <div className="pt-20 text-white">{children}</div>;
}
