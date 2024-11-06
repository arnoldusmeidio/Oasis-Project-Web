import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/components/ui/carousel/embla.css";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Oasis",
   description: "Discover hidden havens",
};

export default async function RootLayout({
   children,
   params: { locale },
}: {
   children: React.ReactNode;
   params: { locale: string };
}) {
   // Ensure that the incoming `locale` is valid
   if (!routing.locales.includes(locale as any)) {
      notFound();
   }

   // Provide messages for the current locale
   const messages = await getMessages(); // Adjust this if necessary to load locale-specific messages

   return (
      <html lang={locale}>
         <body className={`${inter.className} m-0 min-w-full`}>
            <NextIntlClientProvider messages={messages}>
               {children}
               <Toaster richColors />
            </NextIntlClientProvider>
         </body>
      </html>
   );
}
