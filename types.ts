export enum UserRole {
  FARMER = 'FARMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rating: number;
  reviews: number;
  location: string;
  avatarUrl: string;
  lat?: number;
  lng?: number;
  farmSize?: string;
  businessName?: string;
  walletBalance: number;
}

export interface Produce {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  type: string;
  quantity: number; // in kg
  pricePerKg: number;
  location: string;
  imageUrl: string;
  description: string;
  harvestDate: string;
}

export enum ContractStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  DELIVERY_CONFIRMED = 'Delivery Confirmed',
  PAYMENT_RELEASED = 'Payment Released',
  COMPLETED = 'Completed',
  DISPUTED = 'Disputed',
  CANCELLED = 'Cancelled',
}

export interface StatusHistory {
  status: ContractStatus;
  timestamp: string; // ISO string date
}

export interface Contract {
  id: string;
  produceId: string;
  produceName: string;
  farmerId: string;
  vendorId: string;
  farmerName: string;
  vendorName: string;
  quantity: number;
  totalPrice: number;
  deliveryDeadline: string;
  paymentDate?: string;
  status: ContractStatus;
  statusHistory: StatusHistory[];
  disputeReason?: string;
  disputeFiledBy?: string;
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  PAYMENT_SENT = 'Payment Sent',
  PAYMENT_RECEIVED = 'Payment Received',
}

export interface Transaction {
  id: string;
  userId: string;
  date: string; // ISO string
  type: TransactionType;
  amount: number;
  description: string;
}
