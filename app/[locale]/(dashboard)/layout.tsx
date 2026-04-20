"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { tokenStore } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = tokenStore.getAccess();
    if (!token) {
      router.push("/login");
      return;
    }

    // Listen for unauthorized events (401 responses)
    const handleUnauthorized = () => {
      tokenStore.clear();
      router.push("/login");
    };

    window.addEventListener("najda:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("najda:unauthorized", handleUnauthorized);
    };
  }, [router]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
