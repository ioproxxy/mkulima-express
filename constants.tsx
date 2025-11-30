
import { User, Produce, Contract, UserRole, ContractStatus, Transaction, TransactionType, Message } from './types';

// Constants for UUIDs to maintain relationships in mock data
const F1_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const V1_ID = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';
const F2_ID = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33';
const AD_ID = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44';

const P1_ID = 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55';
const P2_ID = 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f66';
const P3_ID = '10eebc99-9c0b-4ef8-bb6d-6bb9bd380177';

const C1_ID = '20eebc99-9c0b-4ef8-bb6d-6bb9bd380288';
const C2_ID = '30eebc99-9c0b-4ef8-bb6d-6bb9bd380399';
const C3_ID = '40eebc99-9c0b-4ef8-bb6d-6bb9bd380400';

const M1_ID = '50eebc99-9c0b-4ef8-bb6d-6bb9bd380511';
const M2_ID = '60eebc99-9c0b-4ef8-bb6d-6bb9bd380622';
const M3_ID = '70eebc99-9c0b-4ef8-bb6d-6bb9bd380733';

const TX1_ID = '80eebc99-9c0b-4ef8-bb6d-6bb9bd380844';
const TX2_ID = '90eebc99-9c0b-4ef8-bb6d-6bb9bd380955';
const TX3_ID = '00eebc99-9c0b-4ef8-bb6d-6bb9bd380066';
const TX4_ID = 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77';


export const mockUsers: { [key: string]: User } = {
  'farmer-01': {
    id: F1_ID,
    name: 'Juma Mwangi',
    email: 'juma.mwangi@example.com',
    role: UserRole.FARMER,
    rating: 4.8,
    reviews: 120,
    location: 'Nakuru, Kenya',
    avatarUrl: 'https://picsum.photos/seed/farmer/200',
    walletBalance: 15500,
    lat: -0.3031,
    lng: 36.08,
    farmSize: '15 Acres',
  },
  'vendor-01': {
    id: V1_ID,
    name: 'Aisha Omar',
    email: 'aisha.omar@example.com',
    role: UserRole.VENDOR,
    rating: 4.9,
    reviews: 85,
    location: 'Nairobi, Kenya',
    avatarUrl: 'https://picsum.photos/seed/vendor/200',
    walletBalance: 50000,
    lat: -1.2921,
    lng: 36.8219,
    businessName: 'Aisha Fresh Produce',
  },
  'farmer-02': {
    id: F2_ID,
    name: 'Mary Wanjiru',
    email: 'mary.wanjiru@example.com',
    role: UserRole.FARMER,
    rating: 4.7,
    reviews: 95,
    location: 'Naivasha, Kenya',
    avatarUrl: 'https://picsum.photos/seed/farmer2/200',
    walletBalance: 6000,
    lat: -0.7167,
    lng: 36.4333,
    farmSize: '10 Acres',
  },
  'admin-01': {
    id: AD_ID,
    name: 'Admin User',
    email: 'admin@mkulima.express',
    role: UserRole.ADMIN,
    rating: 5.0,
    reviews: 0,
    location: 'Platform HQ',
    avatarUrl: 'https://picsum.photos/seed/admin/200',
    walletBalance: 0,
  }
};

export const mockProduce: Produce[] = [
  {
    id: P1_ID,
    farmerId: F1_ID,
    farmerName: 'Juma Mwangi',
    name: 'Fresh Sukuma Wiki (Kale)',
    type: 'Vegetable',
    quantity: 200,
    pricePerKg: 50,
    location: 'Nakuru',
    imageUrl: 'https://picsum.photos/seed/kale/400/300',
    description: 'Organically grown, ready for harvest.',
    harvestDate: '2024-08-10',
  },
  {
    id: P2_ID,
    farmerId: F1_ID,
    farmerName: 'Juma Mwangi',
    name: 'Ripe Avocados',
    type: 'Fruit',
    quantity: 500,
    pricePerKg: 120,
    location: 'Nakuru',
    imageUrl: 'https://picsum.photos/seed/avocado/400/300',
    description: 'Hass avocados, perfect for export.',
    harvestDate: '2024-08-15',
  },
  {
    id: P3_ID,
    farmerId: F2_ID,
    farmerName: 'Mary Wanjiru',
    name: 'Red Onions',
    type: 'Vegetable',
    quantity: 150,
    pricePerKg: 80,
    location: 'Naivasha',
    imageUrl: 'https://picsum.photos/seed/onions/400/300',
    description: 'High-quality red onions, great for stews.',
    harvestDate: '2024-08-05',
  },
];

export const mockContracts: Contract[] = [
  {
    id: C1_ID,
    produceId: P1_ID,
    produceName: 'Fresh Sukuma Wiki (Kale)',
    farmerId: F1_ID,
    vendorId: V1_ID,
    farmerName: 'Juma Mwangi',
    vendorName: 'Aisha Omar',
    quantity: 50,
    totalPrice: 2500,
    deliveryDeadline: '2024-08-12',
    status: ContractStatus.ACTIVE,
    statusHistory: [
        { status: ContractStatus.PENDING, timestamp: '2024-08-10T10:00:00Z' },
        { status: ContractStatus.ACTIVE, timestamp: '2024-08-10T11:30:00Z' },
    ],
    logistics: {
        partner: 'Kobo Logistics',
        status: 'Scheduled',
        pickupTime: '2024-08-11T09:00:00Z',
        pickupQRCode: 'MKE-C01-PICKUP',
        deliveryQRCode: 'MKE-C01-DELIVERY',
    }
  },
  {
    id: C2_ID,
    produceId: P2_ID,
    produceName: 'Ripe Avocados',
    farmerId: F1_ID,
    vendorId: V1_ID,
    farmerName: 'Juma Mwangi',
    vendorName: 'Aisha Omar',
    quantity: 100,
    totalPrice: 12000,
    deliveryDeadline: '2024-08-20',
    status: ContractStatus.DELIVERY_CONFIRMED,
    paymentDate: '2024-08-22',
    statusHistory: [
        { status: ContractStatus.PENDING, timestamp: '2024-08-18T09:00:00Z' },
        { status: ContractStatus.ACTIVE, timestamp: '2024-08-18T12:00:00Z' },
        { status: ContractStatus.DELIVERY_CONFIRMED, timestamp: '2024-08-20T16:00:00Z' },
    ],
    logistics: {
        partner: 'Sendy',
        status: 'Delivered',
        pickupTime: '2024-08-19T10:00:00Z',
        deliveryTime: '2024-08-20T15:30:00Z',
        pickupQRCode: 'MKE-C02-PICKUP',
        deliveryQRCode: 'MKE-C02-DELIVERY',
    }
  },
  {
    id: C3_ID,
    produceId: P3_ID,
    produceName: 'Red Onions',
    farmerId: F2_ID,
    vendorId: V1_ID,
    farmerName: 'Mary Wanjiru',
    vendorName: 'Aisha Omar',
    quantity: 75,
    totalPrice: 6000,
    deliveryDeadline: '2024-08-08',
    status: ContractStatus.COMPLETED,
    paymentDate: '2024-08-09',
    statusHistory: [
        { status: ContractStatus.PENDING, timestamp: '2024-08-06T14:00:00Z' },
        { status: ContractStatus.ACTIVE, timestamp: '2024-08-06T15:00:00Z' },
        { status: ContractStatus.DELIVERY_CONFIRMED, timestamp: '2024-08-08T10:00:00Z' },
        { status: ContractStatus.COMPLETED, timestamp: '2024-08-09T11:00:00Z' },
    ],
    logistics: {
        partner: 'Local Transporters',
        status: 'Delivered',
        pickupTime: '2024-08-07T11:00:00Z',
        deliveryTime: '2024-08-08T09:45:00Z',
        pickupQRCode: 'MKE-C03-PICKUP',
        deliveryQRCode: 'MKE-C03-DELIVERY',
    }
  },
];

export const mockMessages: Message[] = [
  {
    id: M1_ID,
    contractId: C1_ID,
    senderId: V1_ID,
    senderName: 'Aisha Omar',
    text: 'Hi Juma, looking forward to the delivery. Please confirm the pickup time.',
    timestamp: '2024-08-10T11:35:00Z',
  },
  {
    id: M2_ID,
    contractId: C1_ID,
    senderId: F1_ID,
    senderName: 'Juma Mwangi',
    text: 'Hello Aisha, the logistics partner will be there tomorrow morning around 9 AM.',
    timestamp: '2024-08-10T11:40:00Z',
  },
  {
    id: M3_ID,
    contractId: C1_ID,
    senderId: V1_ID,
    senderName: 'Aisha Omar',
    text: 'Perfect, thank you!',
    timestamp: '2024-08-10T11:41:00Z',
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: TX1_ID,
    userId: V1_ID,
    type: TransactionType.PAYMENT_SENT,
    amount: -6000,
    description: 'Payment for Red Onions',
    date: '2024-08-09',
    relatedContractId: C3_ID,
  },
  {
    id: TX2_ID,
    userId: F2_ID,
    type: TransactionType.PAYMENT_RECEIVED,
    amount: 6000,
    description: 'Received payment for Red Onions',
    date: '2024-08-09',
    relatedContractId: C3_ID,
  },
  {
    id: TX3_ID,
    userId: V1_ID,
    type: TransactionType.TOP_UP,
    amount: 20000,
    description: 'Wallet Top-up',
    date: '2024-08-01',
  },
  {
    id: TX4_ID,
    userId: F1_ID,
    type: TransactionType.TOP_UP,
    amount: 5000,
    description: 'Wallet Top-up',
    date: '2024-08-02',
  },
];
