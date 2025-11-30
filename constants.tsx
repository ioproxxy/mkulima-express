
import { User, Produce, Contract, UserRole, ContractStatus, Transaction, TransactionType, Message } from './types';

// UUID constants can remain if needed for reference, but mock data arrays are removed.
export const F1_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

// Empty exports to prevent import errors if referenced elsewhere before cleanup, 
// though api.ts will be updated to stop using them.
export const mockUsers: { [key: string]: User } = {};
export const mockProduce: Produce[] = [];
export const mockContracts: Contract[] = [];
export const mockMessages: Message[] = [];
export const mockTransactions: Transaction[] = [];
