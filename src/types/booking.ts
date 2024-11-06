export interface Booking {
   id: string;
   bookingNumber: string;
   paymentStatus: string;
   paymentType: string;
   startDate: Date;
   endDate: Date;
   amountToPay: number;
   pictureUrl: string;
   type: string;
   room: {
      price: number;
      type: string;
      description: string;
      property: {
         id: any;
         name: string;
         address: string;
         city: string;
         description: string;
         category: string;
      };
   };
   customer: {
      user: {
         name: string;
         email: string;
      };
   };
}
