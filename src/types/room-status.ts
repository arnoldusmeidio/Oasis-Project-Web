export interface RoomStatus {
   id: string;
   title: string;
   defaultPrice: number;
   roomPrice: { startDate: string; endDate: string; price: number }[];
   bookings: { startDate: string; endDate: string }[];
}
