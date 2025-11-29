// Data Context with Supabase Integration
import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { User, Produce, Contract, Transaction, Message, ContractStatus, TransactionDirection } from '../types';
import { dbOperations, subscribeToMessages } from '../supabaseHelpers';
import { toast } from 'react-toastify';

interface DataContextType {
  users: User[];
  produce: Produce[];
  contracts: Contract[];
  transactions: Transaction[];
  messages: Message[];
  updateUser: (updatedUser: User) => Promise<void>;
  updateContract: (updatedContract: Contract) => Promise<void>;
  addContract: (newContract: Contract) => Promise<void>;
  addProduce: (newProduce: Produce) => Promise<void>;
  addUser: (newUser: User) => Promise<User>;
  addTransaction: (newTransaction: Transaction) => Promise<void>;
  addMessage: (newMessage: Message) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  // Escrow & offers
  proposeContract: (offer: Contract) => Promise<Contract>;
  acceptContract: (contractId: string) => Promise<void>;
  rejectContract: (contractId: string) => Promise<void>;
  confirmDelivery: (contractId: string) => Promise<void>;
  releaseEscrow: (contractId: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial data fetch from Supabase
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [usersData, produceData, contractsData, transactionsData, messagesData] = await Promise.all([
          dbOperations.getUsers(),
          dbOperations.getProduce(),
          dbOperations.getContracts(),
          dbOperations.getTransactions(),
          dbOperations.getMessages(),
        ]);
        
        setUsers(usersData || []);
        setProduce(produceData || []);
        setContracts(contractsData || []);
        setTransactions(transactionsData || []);
        setMessages(messagesData || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Subscribe to realtime message updates
  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessage) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return unsubscribe;
  }, []);

  const updateUser = async (updatedUser: User) => {
    try {
      const result = await dbOperations.updateUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? result : u));
    } catch (error: any) {
      toast.error('Failed to update user: ' + error.message);
      throw error;
    }
  };

  const updateContract = async (updatedContract: Contract) => {
    try {
      const result = await dbOperations.updateContract(updatedContract);
      setContracts(prev => prev.map(c => c.id === updatedContract.id ? result : c));
    } catch (error: any) {
      toast.error('Failed to update contract: ' + error.message);
      throw error;
    }
  };

  const addContract = async (newContract: Contract) => {
    try {
      const result = await dbOperations.createContract(newContract);
      setContracts(prev => [result, ...prev]);
    } catch (error: any) {
      toast.error('Failed to create contract: ' + error.message);
      throw error;
    }
  };

  const addProduce = async (newProduce: Produce) => {
    try {
      const result = await dbOperations.createProduce(newProduce);
      setProduce(prev => [result, ...prev]);
    } catch (error: any) {
      toast.error('Failed to add produce: ' + error.message);
      throw error;
    }
  };

  const addUser = async (newUser: User) => {
    try {
      const result = await dbOperations.createUser(newUser);
      setUsers(prev => [...prev, result]);
      return result;
    } catch (error: any) {
      toast.error('Failed to create user: ' + error.message);
      throw error;
    }
  };

  const addTransaction = async (newTransaction: Transaction) => {
    try {
      const result = await dbOperations.createTransaction(newTransaction);
      setTransactions(prev => [result, ...prev].sort((a,b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error: any) {
      toast.error('Failed to add transaction: ' + error.message);
      throw error;
    }
  };

  const addMessage = async (newMessage: Message) => {
    try {
      const result = await dbOperations.createMessage(newMessage);
      setMessages(prev => {
        if (prev.some(m => m.id === result.id)) return prev;
        return [...prev, result];
      });
    } catch (error: any) {
      toast.error('Failed to send message: ' + error.message);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await dbOperations.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error: any) {
      toast.error('Failed to delete user: ' + error.message);
      throw error;
    }
  };

  // --- Escrow helpers --- //
  const findUser = (id: string) => users.find(u => u.id === id);

  const recordTransaction = async (userId: string, amount: number, description: string, relatedContractId?: string) => {
    const txn: Transaction = {
      id: '',
      userId,
      amount,
      type: amount < 0 ? TransactionDirection.DEBIT : TransactionDirection.CREDIT,
      description,
      date: new Date().toISOString(),
      relatedContractId,
    };
    await addTransaction(txn);
  };

  const updateWalletBalance = async (userId: string, delta: number) => {
    const u = findUser(userId);
    if (!u) throw new Error('User not found');
    const updated: User = { ...u, walletBalance: (u.walletBalance || 0) + delta };
    await updateUser(updated);
  };

  // Vendor proposes an offer and funds escrow immediately
  const proposeContract = async (offer: Contract): Promise<Contract> => {
    try {
      // Validate
      const vendor = findUser(offer.vendorId);
      const farmer = findUser(offer.farmerId);
      if (!vendor || !farmer) throw new Error('Invalid parties');
      if ((vendor.walletBalance || 0) < offer.totalPrice) throw new Error('Insufficient wallet balance to fund escrow');

      // Create contract in PENDING status
      const pending: Contract = {
        ...offer,
        status: ContractStatus.PENDING,
      };
      const created = await dbOperations.createContract(pending);
      setContracts(prev => [created, ...prev]);

      // Hold funds in escrow: debit vendor
      await updateWalletBalance(vendor.id, -offer.totalPrice);
      await recordTransaction(vendor.id, -offer.totalPrice, `Escrow hold for ${offer.produceName}`, created.id);
      toast.success('Offer sent and escrow funded');
      return created;
    } catch (error: any) {
      toast.error('Failed to propose contract: ' + error.message);
      throw error;
    }
  };

  // Farmer accepts: activate contract
  const acceptContract = async (contractId: string) => {
    const c = contracts.find(x => x.id === contractId);
    if (!c) throw new Error('Contract not found');
    const updated: Contract = { ...c, status: ContractStatus.ACTIVE };
    await updateContract(updated);
    toast.success('Contract accepted');
  };

  // Farmer rejects: refund escrow to vendor and cancel contract
  const rejectContract = async (contractId: string) => {
    const c = contracts.find(x => x.id === contractId);
    if (!c) throw new Error('Contract not found');
    // Refund vendor
    await updateWalletBalance(c.vendorId, c.totalPrice);
    await recordTransaction(c.vendorId, c.totalPrice, `Escrow refund for ${c.produceName}`, c.id);
    const updated: Contract = { ...c, status: ContractStatus.CANCELLED };
    await updateContract(updated);
    toast.info('Offer rejected and escrow refunded');
  };

  // Vendor or farmer confirms delivery
  const confirmDelivery = async (contractId: string) => {
    const c = contracts.find(x => x.id === contractId);
    if (!c) throw new Error('Contract not found');
    if (c.status !== ContractStatus.ACTIVE) throw new Error('Contract not active');
    const updated: Contract = { ...c, status: ContractStatus.DELIVERY_CONFIRMED };
    await updateContract(updated);
    toast.success('Delivery confirmed');
  };

  // Release escrow to farmer
  const releaseEscrow = async (contractId: string) => {
    const c = contracts.find(x => x.id === contractId);
    if (!c) throw new Error('Contract not found');
    if (c.status !== ContractStatus.DELIVERY_CONFIRMED && c.status !== ContractStatus.ACTIVE) throw new Error('Delivery not confirmed');
    // Credit farmer, mark payment released/completed
    await updateWalletBalance(c.farmerId, c.totalPrice);
    await recordTransaction(c.farmerId, c.totalPrice, `Payment released for ${c.produceName}`, c.id);
    const updated: Contract = { ...c, status: ContractStatus.PAYMENT_RELEASED, paymentDate: new Date().toISOString() };
    await updateContract(updated);
    toast.success('Escrow released to farmer');
  };

  const value = useMemo(() => ({
    users, produce, contracts, transactions, messages,
    updateUser, updateContract, addContract, addProduce, addUser, addTransaction, addMessage, deleteUser,
    // escrow & offer methods
    proposeContract, acceptContract, rejectContract, confirmDelivery, releaseEscrow,
    loading
  }), [users, produce, contracts, transactions, messages, loading]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
