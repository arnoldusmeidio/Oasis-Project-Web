import OrderBody from "@/components/order/TenantOrderBody";
import React from "react";

export default function OrderPage() {
   return (
      <>
         <div className="flex w-full min-w-[340px] max-w-7xl flex-col gap-8 self-start px-8 py-4">
            <OrderBody />
         </div>
      </>
   );
}
