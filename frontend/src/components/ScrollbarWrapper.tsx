import { ReactNode } from "react";

export default function ScrollWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-y-auto scrollbar">
      {children}
    </div>
  );
}