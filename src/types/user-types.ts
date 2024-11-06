export enum Language {
   ENGLISH = "ENGLISH",
   INDONESIA = "INDONESIA",
}

export enum Currency {
   IDR = "IDR",
   USD = "USD",
}

export interface User {
   id: number;
   name: string;
   password: string;
   email: string;
   role: string;
   tenant: {};
   customer: {
      refCode: string;
      hasRedeemedRefCode: boolean;
   };
   accountProvider: string;
   pictureUrl: string;
   currency: Currency;
   language: Language;
   wallet: {
      balance: number;
      points: number;
   };
}
