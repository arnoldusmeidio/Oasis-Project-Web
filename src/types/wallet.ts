export interface WalletTypes {
   id: string;
   balance: number;
   points: number;
   walletHistory: {
      id: string;
      description: string;
      value: number;
      types: string;
      bp: string;
      createdAt: Date;
   }[];
}
