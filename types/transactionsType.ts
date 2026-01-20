// types/transactionsType.ts
export interface Transaction {
  _id: string;
  txnId: string;
  event: {
    eventType: string;
    eventTitle: string;
    eventTheme: string;
    supportingText: string;
    eventBanner: string;
    startDate: string;
    endDate: string;
    venue: string;
    address: string;
    brandColor: {
      primaryColor: string;
      secondaryColor: string;
    };
    eventVisibility: boolean;
  };
  paystackId: string;
  ticket: {
    ticketName: string;
    price: number;
    currency: string;
    initialQuantity: number;
    availableQuantity: number;
    benefits: string[];
    _id: string;
  };
  buyers: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}