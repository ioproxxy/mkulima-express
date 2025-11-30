
import React from 'react';

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
  walletBalance: number;
  lat?: number;
  lng?: number;
  farmSize?: string;
  businessName?: string;
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
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DELIVERY_CONFIRMED = 'DELIVERY_CONFIRMED',
  PAYMENT_RELEASED = 'PAYMENT_RELEASED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export interface Logistics {
  partner: string;
  status: 'Pending' | 'Scheduled' | 'In Transit' | 'Delivered';
  pickupTime?: string;
  deliveryTime?: string;
  pickupQRCode: string;
  deliveryQRCode: string;
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
  statusHistory: { status: ContractStatus; timestamp: string }[];
  disputeReason?: string;
  disputeFiledBy?: string;
  logistics?: Logistics;
  createdBy: string;
}

export interface Message {
  id: string;
  contractId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export enum TransactionType {
  PAYMENT_SENT = 'Payment Sent',
  PAYMENT_RECEIVED = 'Payment Received',
  TOP_UP = 'Top-up',
  WITHDRAWAL = 'Withdrawal',
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  relatedContractId?: string;
}

export type FormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
