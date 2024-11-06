import Footer from "@/components/Footer";
import SearchNavbar from "@/components/header/SearchNavbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <SearchNavbar />
         <main className="bg-background flex h-full min-h-screen w-full flex-col items-center justify-center">
            {children}
         </main>
         <Footer />
      </>
   );
}
