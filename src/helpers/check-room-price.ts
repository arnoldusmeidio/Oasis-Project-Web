import { RoomStatus } from "@/types/room-status";

export function checkRoomPrice(
   date: Date,
   roomStatus: RoomStatus | undefined,
   currencyRate?: number | null,
): number | undefined {
   const roomPrice = roomStatus?.roomPrice;
   const targetTime = date.getTime();

   if (roomPrice) {
      for (const price of roomPrice) {
         const startTime = new Date(price.startDate).getTime();
         const endTime = new Date(price.endDate).getTime();

         if (targetTime >= startTime && targetTime <= endTime) {
            if (currencyRate) {
               return Math.ceil(price.price * currencyRate);
            }
            return price.price / 1000;
         }
      }
   }

   const initPrice = roomStatus?.defaultPrice;
   if (currencyRate && initPrice) {
      return Math.ceil(initPrice * currencyRate);
   }
   return initPrice! / 1000;
}
