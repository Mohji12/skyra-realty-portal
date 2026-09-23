import { useEffect, type ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { CompareTray } from "./CompareTray";
import { incrementVisits } from "@/lib/skyra/storage";

export function SiteLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = "skyra.visitCounted.session";
    if (sessionStorage.getItem(key)) return;
    incrementVisits();
    sessionStorage.setItem(key, "1");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-24">{children}</main>
      <Footer />
      <CompareTray />
    </div>
  );
}
