"use client";

import Tenant from "@/components/tenant/navbarTenant";
export default function TenantLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Tenant />
         <main className="flex justify-center overflow-y-auto px-4">{children}</main>;
      </>
   );
}
