"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Tenant from "@/components/tenant/navbarTenant";
import { useUserStore } from "@/stores/useUserStore";

export default function UserLayout({ children }: { children: React.ReactNode }) {
   const { user } = useUserStore();

   return (
      <>
         {user?.tenant ? <Tenant /> : <Navbar />}
         <main className="flex h-full min-h-screen flex-1 items-center justify-center overflow-y-auto px-4">
            {children}
         </main>
         <Footer />
      </>
   );
}
