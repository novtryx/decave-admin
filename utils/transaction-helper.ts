/**
 * Safely parse transaction quantity from API response
 * Handles common issues like string concatenation and incorrect data types
 */
export function parseTransactionQuantity(transaction: any): number {
  // If quantity is already a valid number
  if (typeof transaction.quantity === 'number' && !isNaN(transaction.quantity)) {
    return transaction.quantity;
  }

  // If quantity is a string, parse it
  if (typeof transaction.quantity === 'string') {
    const parsed = parseInt(transaction.quantity, 10);
    return !isNaN(parsed) ? parsed : 0;
  }

  // If tickets is an array, count the items
  if (Array.isArray(transaction.tickets)) {
    return transaction.tickets.length;
  }

  // If ticketsPurchased exists and is a number
  if (typeof transaction.ticketsPurchased === 'number') {
    return transaction.ticketsPurchased;
  }

  // If ticketQuantity exists (alternative field name)
  if (typeof transaction.ticketQuantity === 'number') {
    return transaction.ticketQuantity;
  }

  // Default fallback
  return 0;
}

/**
 * Transform raw API transaction data to properly formatted Transaction objects
 */
export function transformTransactionData(rawTransaction: any): any {
  return {
    ...rawTransaction,
    quantity: parseTransactionQuantity(rawTransaction),
    // Ensure amount is a number
    amount: typeof rawTransaction.amount === 'string' 
      ? parseFloat(rawTransaction.amount) 
      : rawTransaction.amount,
  };
}

/**
 * Process array of transactions from API
 */
export function processTransactionsFromAPI(transactions: any[]): any[] {
  if (!Array.isArray(transactions)) {
    return [];
  }
  
  return transactions.map(transformTransactionData);
}