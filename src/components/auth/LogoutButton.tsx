"use client";

import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

interface LogoutButtonProps {
   children: React.ReactNode;
   mode?: "modal" | "redirect";
   asChild?: boolean;
}

export default function LogoutButton({ children, mode = "redirect", asChild }: LogoutButtonProps) {
   const router = useRouter();
   const { clearUser } = useUserStore();

   const onClick = async () => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            credentials: "include",
         });
         const data = await response.json();
         if (!data.ok) {
            toast.error(data.message, { duration: 1500 });
         } else {
            router.push("/login");
            clearUser();
            toast(data.message, { duration: 1500 });
            router.refresh();
         }
      } catch (error) {
         console.error(error);
      }
   };

   if (mode === "modal") {
      return <span>TODO: Implement modal!</span>;
   }

   return (
      <span onClick={onClick} className="cursor-pointer">
         {children}
      </span>
   );
}
