export function currency(number: number, currency: string | undefined, rates: number) {
   if (currency == "USD") {
      return new Intl.NumberFormat("en-US", {
         style: "currency",
         currency: "USD",
      }).format(number * rates);
   } else {
      return new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
      }).format(number);
   }
}
