// // types/transactionsType.ts
// export interface Transaction {
//   _id: string;
//   txnId: string;
//   event: {
//     eventType: string;
//     eventTitle: string;
//     eventTheme: string;
//     supportingText: string;
//     eventBanner: string;
//     startDate: string;
//     endDate: string;
//     venue: string;
//     address: string;
//     brandColor: {
//       primaryColor: string;
//       secondaryColor: string;
//     };
//     eventVisibility: boolean;
//   };
//   paystackId: string;
//   ticket: {
//     ticketName: string;
//     price: number;
//     currency: string;
//     initialQuantity: number;
//     availableQuantity: number;
//     benefits: string[];
//     _id: string;
//   };
//   buyers: string;
//   status: 'completed' | 'pending' | 'failed';
//   createdAt: string;
// }


export interface Transaction {
  _id: string;
  txnId: string;
  paystackId: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  quantity: number;
  revenue: number;
  buyerEmail: string;
  ticket: {
    ticketName: string;
    price: number;
    currency: string;
    initialQuantity: number;
    availableQuantity: number;
    benefits: string[];
    _id: string;
  };
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
}

export interface TransactionStats {
  _id: null;
  totalRevenue: number;
  totalPending: number;
  totalFailed: number;
  totalCompleted: number;
}

export interface TransactionPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TransactionResponse {
  message: string;
  success: boolean;
  data: Transaction[];
  stats: TransactionStats;
  pagination: TransactionPagination;
}