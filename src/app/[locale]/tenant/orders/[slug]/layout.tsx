import Tenant from "@/components/tenant/navbarTenant";

export default function UserLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <main className="flex h-full min-h-screen flex-1 items-center justify-center overflow-y-auto px-4">
            {children}
         </main>
      </>
   );
}
