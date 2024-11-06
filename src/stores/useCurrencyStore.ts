import { create } from "zustand";
import Cookies from "js-cookie";

type CurrencyState = {
   currencyRate: number | null;
   error: string | null;
   getCurrencyRate: () => Promise<void>;
};

const useCurrencyStore = create<CurrencyState>((set) => ({
   currencyRate: null,
   error: null,
   getCurrencyRate: async () => {
      try {
         const rateFromCookie = Cookies.get("currencyRate");

         // Use cookie if available
         if (rateFromCookie) {
            set({ currencyRate: parseFloat(rateFromCookie), error: null });
            return;
         }

         // Fetch from API if no valid cookie is found
         const response = await fetch("https://api.freecurrencyapi.com/v1/latest?currencies=USD&base_currency=IDR", {
            headers: {
               apikey: process.env.NEXT_PUBLIC_FREE_CURRENCY_KEY as string,
            },
         });
         if (!response.ok)
            set({
               currencyRate: null,
               error: "Failed to fetch currency rate.",
            });

         const data = await response.json();
         const rate = data.data.USD;

         // Set rate in Zustand and store in cookie
         set({ currencyRate: rate, error: null });
         Cookies.set("currencyRate", rate.toFixed(6), { expires: 0.5 });
      } catch (error) {
         console.error("Currency rate fetch error:", error);
         set({
            currencyRate: null,
            error: "Could not fetch currency rate. Please try again later.",
         });
      }
   },
}));

export default useCurrencyStore;
