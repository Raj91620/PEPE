export interface PaymentSystem {
  id: string;
  name: string;
  emoji: string;
  minWithdrawal: number;
  fee: number;
  feeType: 'fixed' | 'percentage';
}

export const PAYMENT_SYSTEMS: PaymentSystem[] = [
  { id: 'mgb_wallet', name: 'MGB Wallet', emoji: '💎', minWithdrawal: 0, fee: 0, feeType: 'fixed' }
];
