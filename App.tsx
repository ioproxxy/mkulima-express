
import React, { useState, useContext, createContext, useMemo, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import { User, UserRole, Produce, Contract, ContractStatus, Transaction, TransactionType, Message, Logistics } from './types';
import * as api from './api';
import { supabase } from './supabaseClient';

// --- ICONS --- //
const HomeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const LeafIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13V8a5 5 0 0 1 10 0v5a7 7 0 0 1-7 7m0 0c-3.33 0-5.46-2.01-6-5h12c-.54 2.99-2.67 5-6 5"></path><path d="M12 13V3"></path></svg>;
const FileTextIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const UserIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const UsersIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const LogOutIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;
const StarIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const ChevronLeftIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>;
const CheckCircleIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><path d="M22 11.08V12a10 10 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const MapPinIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const TruckIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 17h4V5H2v12h3"/><path d="M22 17h-2.42a1 1 0 0 0-.9-.58h-1.36a1 1 0 0 0-.9.58H14V5h8v12Z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
const ShieldAlertIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
const SearchIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const Trash2Icon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>;
const PlusIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const XIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const EditIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const WalletIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>;
const MinusIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const BarChartIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>;
const MessageSquareIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const QrCodeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" x2="14.01" y1="14" y2="14"></line><line x1="17" x2="21" y1="14" y2="14"></line><line x1="14" x2="14" y1="17" y2="21"></line><line x1="17" x2="17" y1="17" y2="17.01"></line><line x1="21" x2="21" y1="17" y2="17.01"></line><line x1="21" x2="21" y1="21" y2="21.01"></line></svg>;
const RefreshCwIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;


// --- UI COMPONENTS --- //

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.ACTIVE: return 'text-blue-600 bg-blue-100';
    case ContractStatus.COMPLETED: return 'text-green-600 bg-green-100';
    case ContractStatus.DELIVERY_CONFIRMED: return 'text-yellow-600 bg-yellow-100';
    case ContractStatus.PAYMENT_RELEASED: return 'text-purple-600 bg-purple-100';
    case ContractStatus.PENDING: return 'text-gray-600 bg-gray-100';
    case ContractStatus.DISPUTED: return 'text-orange-600 bg-orange-100';
    case ContractStatus.CANCELLED: return 'text-red-600 bg-red-100';
    default: return 'text-red-600 bg-red-100';
  }
};

const InfoItem = ({ label, value }: { label: string, value: string }) => (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
);

const ProfileInfoItem = ({ icon: Icon, label, value }: { icon: React.FC<{className?:string}>, label: string, value: string }) => (
    <div className="flex items-center border-b last:border-b-0 py-3">
        <Icon className="w-5 h-5 text-gray-400 mr-4" />
        <div>
            <p className="text-gray-500 text-xs">{label}</p>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    </div>
);

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isCredit = transaction.amount > 0;
    return (
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isCredit ? <PlusIcon className="w-6 h-6"/> : <MinusIcon className="w-6 h-6"/>}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-gray-800 text-sm">{transaction.description}</p>
                <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
               {isCredit ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
            </p>
        </div>
    );
}

const QRCodeDisplay = ({ value }: { value: string }) => (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md mt-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">Scan for Logistics</p>
        <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${value}`} 
            alt="Contract QR Code" 
            className="w-32 h-32"
        />
        <p className="text-xs text-gray-400 mt-2">ID: {value.slice(0, 8)}...</p>
    </div>
);

const ActionCenter = ({ user, contracts }: { user: User, contracts: Contract[] }) => {
    const navigate = useNavigate();
    
    const actions = useMemo(() => {
        const list: { id: string, title: string, desc: string, link: string, color: string }[] = [];
        
        // 1. Pending Offers (Received)
        contracts
            .filter(c => c.status === ContractStatus.PENDING && c.createdBy !== user.id && (c.farmerId === user.id || c.vendorId === user.id))
            .forEach(c => {
                list.push({
                    id: c.id,
                    title: 'Review Offer',
                    desc: `${c.produceName} - ${c.quantity}kg`,
                    link: `/contracts/${c.id}`,
                    color: 'bg-blue-100 text-blue-800'
                });
            });

        // 2. Vendor Actions
        if (user.role === UserRole.VENDOR) {
            contracts
                .filter(c => c.status === ContractStatus.ACTIVE && c.vendorId === user.id)
                .forEach(c => {
                    list.push({
                         id: c.id,
                         title: 'Confirm Delivery',
                         desc: `For ${c.produceName}`,
                         link: `/contracts/${c.id}`,
                         color: 'bg-yellow-100 text-yellow-800'
                    });
                });
            
             contracts
                .filter(c => c.status === ContractStatus.DELIVERY_CONFIRMED && c.vendorId === user.id)
                .forEach(c => {
                    list.push({
                         id: c.id,
                         title: 'Release Payment',
                         desc: `For ${c.produceName}`,
                         link: `/contracts/${c.id}`,
                         color: 'bg-green-100 text-green-800'
                    });
                });
        }
        
        return list;
    }, [contracts, user]);

    if (actions.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Action Center</h3>
            <div className="space-y-3">
                {actions.map(action => (
                    <div 
                        key={action.id} 
                        onClick={() => navigate(action.link)}
                        className={`p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer ${action.color} border border-opacity-20 border-current`}
                    >
                        <div>
                            <p className="font-bold">{action.title}</p>
                            <p className="text-sm opacity-80">{action.desc}</p>
                        </div>
                        <ChevronLeftIcon className="w-5 h-5 transform rotate-180" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- DATA CONTEXT --- //
interface DataContextType {
  users: User[];
  produce: Produce[];
  contracts: Contract[];
  transactions: Transaction[];
  messages: Message[];
  loading: boolean;
  updateUser: (updatedUser: User) => Promise<void>;
  updateContract: (updatedContract: Contract) => Promise<void>;
  addContract: (newContract: Contract) => Promise<Contract>;
  addProduce: (newProduce: Produce) => Promise<void>;
  deleteProduce: (produceId: string) => Promise<void>;
  addUser: (newUser: User) => Promise<User>;
  addTransaction: (newTransaction: Transaction) => Promise<void>;
  addMessage: (newMessage: Message) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, contractsData, produceData, transactionsData, messagesData] = await Promise.all([
        api.fetchUsers(),
        api.fetchContracts(),
        api.fetchProduce(),
        api.fetchTransactions(),
        api.fetchMessages(),
      ]);
      setUsers(usersData);
      setContracts(contractsData);
      setProduce(produceData);
      setTransactions(transactionsData);
      setMessages(messagesData);
    } catch (error) {
      console.error("Failed to load app data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // -- Realtime Subscriptions -- //
    
    // Subscribe to new messages
    const messageSubscription = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
             const newMessage = api.mapMessageFromDB(payload.new);
             setMessages(prev => {
                // Prevent duplicates if already added locally
                if (prev.find(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
             });
        })
        .subscribe();

    // Subscribe to contract updates
    const contractSubscription = supabase
        .channel('public:contracts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, (payload) => {
            if (payload.eventType === 'INSERT') {
                const newContract = api.mapContractFromDB(payload.new);
                setContracts(prev => {
                    // Prevent duplicates if already added locally
                    if (prev.find(c => c.id === newContract.id)) return prev;
                    return [newContract, ...prev];
                });
            } else if (payload.eventType === 'UPDATE') {
                const updatedContract = api.mapContractFromDB(payload.new);
                setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(messageSubscription);
        supabase.removeChannel(contractSubscription);
    };
  }, []);

  const updateUser = async (updatedUser: User) => {
    await api.updateUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateContract = async (updatedContract: Contract) => {
    await api.updateContract(updatedContract);
    // Optimistic UI update
    setContracts(prevContracts => prevContracts.map(c => c.id === updatedContract.id ? updatedContract : c));
  };
  
  const addContract = async (newContract: Contract): Promise<Contract> => {
    const savedContract = await api.addContract(newContract);
    // Optimistic update for immediate feedback
    setContracts(prev => [savedContract, ...prev]);
    return savedContract;
  };

  const addProduce = async (newProduce: Produce) => {
    const savedProduce = await api.addProduce(newProduce);
    setProduce(prev => [savedProduce, ...prev]);
  }

  const deleteProduce = async (produceId: string) => {
      await api.deleteProduce(produceId);
      setProduce(prev => prev.filter(p => p.id !== produceId));
  }

  const addUser = async (newUser: User): Promise<User> => {
    const savedUser = await api.addUser(newUser);
    setUsers(prev => [...prev, savedUser]);
    return savedUser;
  }
  
  const addTransaction = async (newTransaction: Transaction) => {
    const savedTransaction = await api.addTransaction(newTransaction);
    setTransactions(prev => [savedTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const addMessage = async (newMessage: Message) => {
    const savedMessage = await api.addMessage(newMessage);
    // Optimistic update
    setMessages(prev => [...prev, savedMessage]);
  };

  const value = useMemo(() => ({
    users, produce, contracts, transactions, messages, loading,
    updateUser, updateContract, addContract, addProduce, deleteProduce, addUser, addTransaction, addMessage, refreshData: loadData
  }), [users, produce, contracts, transactions, messages, loading]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// --- AUTHENTICATION CONTEXT --- //
type UserRegistrationData = Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl' | 'walletBalance'> & { password?: string };

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: UserRegistrationData) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { addUser, updateUser, refreshData } = useData();
  const { notify } = useNotifier();

  useEffect(() => {
    const checkUser = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.warn("Session check error:", error.message);
                // If the refresh token is missing or invalid, we must clear the local session
                if (error.message.includes("Refresh Token") || error.message.includes("Invalid Refresh Token")) {
                    await supabase.auth.signOut();
                }
                setUser(null);
                setLoading(false);
                return;
            }

            if (session?.user) {
                const profile = await api.fetchUserProfile(session.user.id);
                if (profile) {
                    setUser(profile);
                } else {
                    console.error("User authenticated but no profile found.");
                    setUser(null); 
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Unexpected auth error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Handle explicit sign-out or session expiration events
        if (event === 'SIGNED_OUT') {
            setUser(null);
            setLoading(false);
            return;
        }

        if (session?.user) {
            const profile = await api.fetchUserProfile(session.user.id);
            setUser(profile);
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        setLoading(false);
        console.error("Login Error:", error.message);
        return false;
    }
    await refreshData();
    // User state will be updated by onAuthStateChange
    return true;
  };

  const register = async (userData: UserRegistrationData) => {
    if (!userData.password) {
        throw new Error("Password is required for registration");
    }
    
    setLoading(true);
    console.log(`Registering user with role: ${userData.role}`);

    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                full_name: userData.name,
                role: userData.role, // Pass role in metadata so triggers can pick it up
                location: userData.location,
                farm_size: userData.farmSize,
                business_name: userData.businessName
            }
        }
    });

    if (error) {
        setLoading(false);
        console.error("Registration Error:", error.message);
        throw error;
    }

    if (data.user && data.session) {
        // Generate random coordinates within Kenya for demo purposes
        // Bounds: Lat (-4 to 4), Lng (34 to 41)
        const lat = -1.2921 + (Math.random() - 0.5) * 4;
        const lng = 36.8219 + (Math.random() - 0.5) * 4;

        // User created and session active (email confirmation likely off or not required immediately)
        const newUser: User = {
            id: data.user.id, // Use the Auth ID
            name: userData.name,
            email: userData.email,
            role: userData.role,
            location: userData.location,
            farmSize: userData.farmSize,
            businessName: userData.businessName,
            rating: 0,
            reviews: 0,
            avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`,
            walletBalance: 0,
            lat: lat,
            lng: lng,
        };
        
        try {
            await addUser(newUser);
            await refreshData();
        } catch (dbError: any) {
             console.error("Database Insert Error:", dbError);
             // Error 42501: RLS Policy violation (Permission denied)
             // Error 23505: Duplicate key (Unique violation)
             // If these occur, it usually means a trigger already created the user row, or we don't have insert permissions but might have update permissions.
             if (dbError.code === '42501' || dbError.code === '23505') {
                 console.log("Attempting profile update instead of insert due to existing row or policy restriction.");
                 try {
                     await updateUser(newUser);
                     await refreshData();
                 } catch (updateError) {
                     console.error("Database Update Error:", updateError);
                     throw updateError;
                 }
             } else {
                 throw dbError;
             }
        }
    } else if (data.user && !data.session) {
        // User created but no session. Email confirmation likely required.
        notify("Registration successful! Please check your email to verify your account.", "success");
        setLoading(false);
        // Do not redirect automatically as they need to verify first.
        // Returning here prevents the auto-redirect in RegistrationScreen's useEffect
        return; 
    }
  };

  const logout = async () => {
    // Optimistically clear local state immediately to give instant feedback
    setUser(null);
    notify("Logged out successfully", "info");

    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error signing out:", error);
        // User is already cleared locally, so no need to alert on error unless debugging
    }
  };

  // Removed useMemo wrapper because logout/login/register functions are recreated on every render 
  // (due to dependencies on other hooks/context) but were not properly included in the dependency array.
  // This ensures consumers always get the latest valid function references.
  const value = { user, login, logout, register, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- NOTIFICATION CONTEXT --- //
interface NotificationContextType {
  notify: (message: string, type?: TypeOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = (message: string, type: TypeOptions = 'info') => {
    toast(message, { type, position: "top-center" });
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifier must be used within a NotificationProvider');
  }
  return context;
};


// --- ROUTING --- //
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-4 text-center">Loading authentication...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const ProduceCard: React.FC<{ produce: Produce }> = ({ produce }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotifier();
  const { deleteProduce } = useData();

  const handleMakeOffer = () => {
    navigate(`/produce/${produce.id}/new-contract`);
  };
  
  const handleCreateContract = () => {
    navigate(`/my-produce/${produce.id}/new-contract`);
  };

  const handleDelete = async () => {
      if(window.confirm("Are you sure you want to delete this listing?")) {
          try {
              await deleteProduce(produce.id);
              notify("Produce deleted successfully.", "success");
          } catch (error) {
              notify("Failed to delete produce.", "error");
          }
      }
  }

  const isMyProduce = user?.id === produce.farmerId;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 relative">
      <img src={produce.imageUrl} alt={produce.name} className="w-full h-48 object-cover" />
       {user?.role === UserRole.FARMER && isMyProduce && (
          <button 
              onClick={handleDelete}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
              title="Delete Listing"
          >
              <Trash2Icon className="w-4 h-4" />
          </button>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{produce.name}</h3>
        <p className="text-sm text-gray-500">{produce.type}</p>
        <div className="mt-2 text-sm text-gray-700">
          <p>By: <span className="font-semibold">{produce.farmerName}</span></p>
          <p>Location: <span className="font-semibold">{produce.location}</span></p>
          <p>Quantity: <span className="font-semibold">{produce.quantity} kg</span></p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold text-green-600">KES {produce.pricePerKg}<span className="text-sm font-normal text-gray-500">/kg</span></p>
          {user?.role === UserRole.VENDOR && !isMyProduce && (
            <button 
              onClick={handleMakeOffer}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Make Offer
            </button>
          )}
           {user?.role === UserRole.FARMER && isMyProduce && (
            <button 
              onClick={handleCreateContract}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Contract
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ContractCard: React.FC<{ contract: Contract }> = ({ contract }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/contracts/${contract.id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800">{contract.produceName}</h3>
          <p className="text-sm text-gray-500">
            {contract.farmerName} to {contract.vendorName}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
          {contract.status}
        </span>
      </div>
      <div className="mt-4 border-t pt-4 text-sm grid grid-cols-2 gap-2 text-gray-700">
        <div>
          <p className="text-gray-500">Quantity</p>
          <p className="font-semibold">{contract.quantity} kg</p>
        </div>
        <div>
          <p className="text-gray-500">Total Price</p>
          <p className="font-semibold">KES {contract.totalPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Deadline</p>
          <p className="font-semibold">{contract.deliveryDeadline}</p>
        </div>
        {contract.paymentDate && (
          <div>
            <p className="text-gray-500">Paid On</p>
            <p className="font-semibold">{contract.paymentDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MapView: React.FC<{ users: User[]; currentUserId?: string }> = ({ users, currentUserId }) => {
    // Define a bounding box for Kenya to normalize coordinates
    const bounds = {
        minLat: -5.0, maxLat: 5.0,
        minLng: 34.0, maxLng: 42.0,
    };

    const getPosition = (lat: number, lng: number) => {
        const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
        const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
        return { x, y };
    };

    return (
        <div className="relative w-full h-64 bg-green-100 rounded-lg shadow-md overflow-hidden">
            <img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/38,0,3/400x300?access_token=pk.eyJ1IjoiZGFuaWVsc2hlYSIsImEiOiJjanl2Z285eWUwZm8wM25udWk0YWM1dHE5In0.kVoL_2Wnx32b3n_84yweJA`} alt="Map of Kenya" className="w-full h-full object-cover opacity-70" />
            {users.map(user => {
                if (!user.lat || !user.lng) return null;
                const { x, y } = getPosition(user.lat, user.lng);
                const isFarmer = user.role === UserRole.FARMER;
                const isCurrentUser = user.id === currentUserId;
                return (
                    <div
                        key={user.id}
                        className="absolute group"
                        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
                    >
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {user.name} {isCurrentUser && '(You)'} <br/> ({(user.location || '').split(',')[0]})
                        </div>
                        <MapPinIcon className={`w-8 h-8 ${isCurrentUser ? 'text-blue-500' : isFarmer ? 'text-green-600' : 'text-amber-500'} drop-shadow-lg`} />
                    </div>
                );
            })}
        </div>
    );
};


// --- LAYOUT --- //
const Layout = ({ children, showNav = true }: { children?: React.ReactNode, showNav?: boolean }) => {
  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen flex flex-col font-sans">
      <main className={`flex-grow ${showNav ? 'pb-20' : ''}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

const BottomNav = () => {
  const { user } = useAuth();

  const produceNavItem = user?.role === UserRole.FARMER
    ? { path: '/my-produce', label: 'My Produce', icon: LeafIcon }
    : { path: '/produce', label: 'Produce', icon: LeafIcon };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    produceNavItem,
    { path: '/contracts', label: 'Contracts', icon: FileTextIcon },
    { path: '/insights', label: 'Insights', icon: BarChartIcon },
  ];

  if (user?.role !== UserRole.ADMIN) {
      navItems.push({ path: '/wallet', label: 'Wallet', icon: WalletIcon });
  }
  
  navItems.push({ path: '/profile', label: 'Profile', icon: UserIcon });


  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-t-md">
      <div className="flex justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center justify-center w-full text-sm font-medium transition-colors ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'}`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

const Header = ({ title, showBack = false }: { title: string, showBack?: boolean }) => {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 bg-white shadow-sm z-10 p-4 flex items-center">
            {showBack && (
                <button onClick={() => navigate(-1)} className="absolute left-4">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
            )}
            <h1 className="text-xl font-bold text-center text-gray-800 flex-grow">{title}</h1>
        </header>
    );
};


// --- SCREENS --- //

const LoginModal = ({ 
    onClose, 
    onLoginSuccess 
}: { 
    onClose: () => void; 
    onLoginSuccess: () => void;
}) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }
        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);
        if (success) {
            onLoginSuccess();
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm transition-all duration-300 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                        <div>
                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                                <div className="text-right mt-1">
                                <Link 
                                    to="/forgot-password" 
                                    onClick={onClose} 
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 bg-green-600 hover:bg-green-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/onboarding" onClick={onClose} className="font-semibold text-green-600 hover:text-green-700">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const handleLoginSuccess = () => {
      setIsModalOpen(false);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
  }

  if (loading) return null;

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="text-center mb-12">
        <LeafIcon className="w-16 h-16 text-green-600 mx-auto" />
        <h1 className="text-4xl font-bold text-green-800 mt-4">Mkulima Express</h1>
        <p className="text-gray-600 mt-2">Connecting Farmers & Vendors with Trust</p>
      </div>
      <div className="w-full max-w-sm">
         <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Login or Sign Up
          </button>
      </div>
    </div>
    {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
    </>
  );
};

const AdminLoginScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();
    const { users } = useData();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }

        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);

        if (success) {
            // Role check happens after login in AuthContext/useEffect
        } else {
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-4">
             <div className="text-center mb-8">
                <ShieldAlertIcon className="w-12 h-12 text-green-400 mx-auto" />
                <h1 className="text-3xl font-bold text-white mt-4">Admin Access</h1>
            </div>
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Administrator Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@mkulima.express"
                    />
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                    >
                         {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/login" className="font-semibold text-sm text-green-600 hover:text-green-700">
                       &larr; Back to main site
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ForgotPasswordScreen = () => {
    const navigate = useNavigate();
    const { notify } = useNotifier();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            notify("Please enter your email address.", "warning");
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
             notify("Error sending reset link: " + error.message, "error");
        } else {
             notify(`If an account exists for ${email}, a password reset link has been sent.`, "success");
             navigate('/login');
        }
    };

    return (
        <Layout showNav={false}>
            <Header title="Forgot Password" showBack={true} />
            <div className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                    <h2 className="text-xl font-semibold text-center text-gray-700 mb-2">Reset Your Password</h2>
                    <p className="text-center text-gray-500 mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Send Reset Link
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

const OnboardingScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
            <div className="text-center mb-12">
                <LeafIcon className="w-16 h-16 text-green-600 mx-auto" />
                <h1 className="text-4xl font-bold text-green-800 mt-4">Join Mkulima Express</h1>
                <p className="text-gray-600 mt-2">Select your role to get started.</p>
            </div>
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">I am a...</h2>
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/register/farmer')}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Farmer
                    </button>
                    <button
                        onClick={() => navigate('/register/vendor')}
                        className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Vendor
                    </button>
                </div>
                 <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const FarmerRegistrationScreen = () => {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', location: '', farmSize: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.email || !formData.password || !formData.location || !formData.farmSize) {
            setError('All fields are required.');
            return;
        }
        setIsSubmitting(true);
        try {
            await register({ ...formData, role: UserRole.FARMER });
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
             setError(err.message || 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout showNav={false}>
            <Header title="Farmer Registration" showBack={true} />
            <div className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                    <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Tell Us About Your Farm</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                        <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                        <InputField label="Location (e.g., Nakuru)" name="location" value={formData.location} onChange={handleChange} />
                        <InputField label="Farm Size (e.g., 10 Acres)" name="farmSize" value={formData.farmSize} onChange={handleChange} />
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

const VendorRegistrationScreen = () => {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', location: '', businessName: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.email || !formData.password || !formData.location || !formData.businessName) {
            setError('All fields are required.');
            return;
        }
        setIsSubmitting(true);
        try {
            await register({ ...formData, role: UserRole.VENDOR });
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout showNav={false}>
            <Header title="Vendor Registration" showBack={true} />
            <div className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                    <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Tell Us About Your Business</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                        <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                        <InputField label="Location (e.g., Nairobi)" name="location" value={formData.location} onChange={handleChange} />
                        <InputField label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} />
                         {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                        >
                             {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

const DashboardScreen = () => {
  const { user } = useAuth();
  const { contracts, produce, users, refreshData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
      setIsRefreshing(true);
      await refreshData();
      setIsRefreshing(false);
  }

  if (!user) return null;

  const relevantContracts = contracts.filter(c => c.farmerId === user.id || c.vendorId === user.id);
  const activeContracts = relevantContracts.filter(c => c.status === ContractStatus.ACTIVE || c.status === ContractStatus.DELIVERY_CONFIRMED);
  const myProduce = produce.filter(p => p.farmerId === user.id);
  
  const greeting = `Good afternoon, ${(user.name || '').split(' ')[0]}!`;

  return (
    <Layout>
      <Header title="Dashboard" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-semibold text-gray-700">{greeting}</h2>
             <button onClick={handleRefresh} className={`p-2 bg-white rounded-full shadow-sm hover:shadow-md ${isRefreshing ? 'animate-spin' : ''}`}>
                 <RefreshCwIcon className="w-5 h-5 text-gray-600"/>
             </button>
        </div>
        
        {/* Action Center - Immediate Tasks */}
        <ActionCenter user={user} contracts={contracts} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-3xl font-bold text-green-600">{activeContracts.length}</p>
            <p className="text-sm text-gray-500">Active Contracts</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-3xl font-bold text-blue-600">
                {user.role === UserRole.FARMER ? myProduce.length : produce.length}
            </p>
            <p className="text-sm text-gray-500">{user.role === UserRole.FARMER ? 'Your Listings' : 'Available Produce'}</p>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Contract Activity</h3>
          <div className="space-y-3">
            {relevantContracts.slice(0, 3).map(c => <ContractCard key={c.id} contract={c}/>)}
            {relevantContracts.length === 0 && <p className="text-sm text-gray-500 bg-white p-4 rounded-lg shadow-md">No recent contract activity.</p>}
          </div>
        </div>

        {/* Map View */}
         <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Partner Locations</h3>
          <MapView users={users.filter(u => u.role !== UserRole.ADMIN)} currentUserId={user.id}/>
        </div>

      </div>
    </Layout>
  );
};

const ProduceScreen = () => {
    const { produce } = useData();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const produceTypes = ['All', ...new Set(produce.map(p => p.type))];

    const filteredProduce = produce
        .filter(p => filter === 'All' || p.type === filter)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Layout>
            <Header title="Available Produce" />
            <div className="p-4">
                <div className="mb-4 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for produce..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {produceTypes.map(type => (
                            <button 
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                    filter === type 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProduce.map(p => <ProduceCard key={p.id} produce={p} />)}
                    {filteredProduce.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-10">
                            <p className="text-gray-500">No produce matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

const MyProduceScreen = () => {
    const { user } = useAuth();
    const { produce } = useData();
    const navigate = useNavigate();

    if (!user) return null;

    const myProduce = produce.filter(p => p.farmerId === user.id);

    return (
        <Layout>
            <Header title="My Produce" />
            <div className="p-4">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate('/my-produce/add')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-green-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        List New Produce
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myProduce.map(p => <ProduceCard key={p.id} produce={p} />)}
                    {myProduce.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-lg shadow-md">
                            <LeafIcon className="w-12 h-12 text-gray-300 mx-auto" />
                            <p className="mt-2 text-gray-500">You haven't listed any produce yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

const AddProduceScreen = () => {
    const { user } = useAuth();
    const { addProduce } = useData();
    const navigate = useNavigate();
    const { notify } = useNotifier();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Vegetable',
        quantity: '100',
        pricePerKg: '50',
        description: '',
        harvestDate: new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !formData.name || !formData.quantity || !formData.pricePerKg || !formData.harvestDate) {
            notify("Please fill all required fields.", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            const newProduce: Produce = {
                id: self.crypto.randomUUID(),
                farmerId: user.id,
                farmerName: user.name,
                name: formData.name,
                type: formData.type,
                quantity: parseFloat(formData.quantity),
                pricePerKg: parseFloat(formData.pricePerKg),
                location: user.location,
                imageUrl: `https://picsum.photos/seed/${formData.name.replace(/\s/g, '')}/400/300`,
                description: formData.description,
                harvestDate: formData.harvestDate,
            };

            await addProduce(newProduce);
            notify("Produce listed successfully!", "success");
            navigate('/my-produce');
        } catch (error: any) {
            console.error("Error adding produce:", error);
            const errorMsg = error.message ? error.message : JSON.stringify(error);
            notify(`Failed to add produce: ${errorMsg}`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Header title="List New Produce" showBack={true} />
            <div className="p-4">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4 space-y-4">
                    <InputField label="Produce Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Fresh Tomatoes" />
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Produce Type</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option>Vegetable</option>
                            <option>Fruit</option>
                            <option>Grain</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <InputField label="Quantity (kg)" name="quantity" type="number" value={formData.quantity} onChange={handleChange} min="1" step="0.1" />
                    <InputField label="Price per Kg (KES)" name="pricePerKg" type="number" value={formData.pricePerKg} onChange={handleChange} min="1" step="0.01" />
                    <InputField label="Harvest Date" name="harvestDate" type="date" value={formData.harvestDate} onChange={handleChange} />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Organically grown, sweet and juicy."></textarea>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Adding Produce...' : 'Add to My Listings'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

const ContractsScreen = () => {
  const { user } = useAuth();
  const { contracts } = useData();
  const [filter, setFilter] = useState<ContractStatus | 'All'>('All');

  const relevantContracts = contracts.filter(c => c.farmerId === user?.id || c.vendorId === user?.id);
  const filteredContracts = filter === 'All' ? relevantContracts : relevantContracts.filter(c => c.status === filter);

  const statuses: (ContractStatus | 'All')[] = ['All', ...Object.values(ContractStatus)];

  return (
    <Layout>
      <Header title="Your Contracts" />
      <div className="p-4">
        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {filteredContracts.map(c => <ContractCard key={c.id} contract={c} />)}
          {filteredContracts.length === 0 && (
             <div className="text-center py-10">
                <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="mt-2 text-gray-500">No contracts in this category.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const StatusTimeline = ({ statusHistory }: { statusHistory: { status: ContractStatus, timestamp: string }[] }) => {
    // A simplified visual timeline
    const allStatuses = [
        ContractStatus.PENDING,
        ContractStatus.ACTIVE,
        ContractStatus.DELIVERY_CONFIRMED,
        ContractStatus.PAYMENT_RELEASED
    ];

    const currentStatus = statusHistory[statusHistory.length - 1].status;
    const currentIndex = allStatuses.indexOf(currentStatus);
    const isCancelledOrDisputed = currentStatus === ContractStatus.CANCELLED || currentStatus === ContractStatus.DISPUTED;

    if (isCancelledOrDisputed) return null; // Don't show standard timeline for these states

    return (
        <div className="flex items-center justify-between mb-6 px-2 relative">
             {/* Progress Bar Background */}
             <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 mx-4"></div>
             {/* Active Progress Bar */}
             <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 mx-4 transition-all duration-500" 
                  style={{ width: `${(Math.max(0, currentIndex) / (allStatuses.length - 1)) * 100}%` }}></div>

             {allStatuses.map((s, idx) => {
                 const isCompleted = idx <= currentIndex;
                 return (
                     <div key={s} className="flex flex-col items-center">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                             {isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : idx + 1}
                         </div>
                         <p className={`text-[10px] mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                             {s.replace('_', ' ')}
                         </p>
                     </div>
                 );
             })}
        </div>
    );
};

const DisputeModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (reason: string) => void }) => {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Raise a Dispute</h3>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Describe the issue with this order..."
                    className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    rows={4}
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                    <button onClick={() => onSubmit(reason)} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">Submit Dispute</button>
                </div>
            </div>
        </div>
    );
}

const ContractDetailScreen = () => {
  const { id } = useParams();
  const { contracts, users, updateUser, updateContract, addTransaction, messages, addMessage } = useData();
  const { user } = useAuth();
  const { notify } = useNotifier();
  const navigate = useNavigate();

  const [messageText, setMessageText] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contract = contracts.find(c => c.id === id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!contract) return <Layout><Header title="Contract Not Found" showBack={true} /><p className="p-4">Could not find the requested contract.</p></Layout>;

  const otherParty = user?.id === contract.farmerId
    ? users.find(u => u.id === contract.vendorId)
    : users.find(u => u.id === contract.farmerId);

  const handleStatusUpdate = (newStatus: ContractStatus, additionalData?: any) => {
    let updatedContract: Contract = { 
        ...contract, 
        status: newStatus, 
        statusHistory: [...contract.statusHistory, { status: newStatus, timestamp: new Date().toISOString() }]
    };

    if (newStatus === ContractStatus.DISPUTED && additionalData) {
        updatedContract.disputeReason = additionalData.reason;
        updatedContract.disputeFiledBy = user?.id;
    }
    
    // Logic for payment release when status becomes PAYMENT_RELEASED
    if (newStatus === ContractStatus.PAYMENT_RELEASED) {
      const farmer = users.find(u => u.id === contract.farmerId);
      const vendor = users.find(u => u.id === contract.vendorId);
      
      if (farmer && vendor && vendor.walletBalance >= contract.totalPrice) {
        const updatedVendor = { ...vendor, walletBalance: vendor.walletBalance - contract.totalPrice };
        const updatedFarmer = { ...farmer, walletBalance: farmer.walletBalance + contract.totalPrice };

        updateUser(updatedVendor);
        updateUser(updatedFarmer);
        
        addTransaction({
            id: self.crypto.randomUUID(),
            userId: vendor.id,
            type: TransactionType.PAYMENT_SENT,
            amount: -contract.totalPrice,
            description: `Payment for ${contract.produceName} (Contract: ${contract.id.slice(0, 8)}...)`,
            date: new Date().toISOString().split('T')[0],
            relatedContractId: contract.id,
        });

        addTransaction({
            id: self.crypto.randomUUID(),
            userId: farmer.id,
            type: TransactionType.PAYMENT_RECEIVED,
            amount: contract.totalPrice,
            description: `Payment for ${contract.produceName} (Contract: ${contract.id.slice(0, 8)}...)`,
            date: new Date().toISOString().split('T')[0],
            relatedContractId: contract.id,
        });

        updatedContract.paymentDate = new Date().toISOString().split('T')[0];
        notify("Payment successfully transferred!", "success");

      } else {
        notify("Insufficient funds for payment transfer.", "error");
        return; // Don't update status if payment fails
      }
    }
    
    updateContract(updatedContract);
    notify(`Contract status updated to ${newStatus}`, "success");
  };

  const handleDisputeSubmit = (reason: string) => {
      if (!reason.trim()) {
          notify("Please provide a reason for the dispute.", "warning");
          return;
      }
      handleStatusUpdate(ContractStatus.DISPUTED, { reason });
      setShowDisputeModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;
    const newMessage: Message = {
      id: self.crypto.randomUUID(),
      contractId: contract.id,
      senderId: user.id,
      senderName: user.name,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(newMessage);
    setMessageText('');
  }

  const contractMessages = messages.filter(m => m.contractId === contract.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const isCreator = user?.id === contract.createdBy;

  return (
    <Layout>
      <Header title="Contract Details" showBack={true} />
      <div className="p-4 space-y-6">
        {/* Status Timeline */}
        <StatusTimeline statusHistory={contract.statusHistory} />

        {/* Contract Info */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{contract.produceName}</h2>
              <p className="text-sm text-gray-500">with {otherParty?.name}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contract.status)}`}>
              {contract.status}
            </span>
          </div>
          {contract.status === ContractStatus.DISPUTED && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3 mb-4 rounded-md">
                  <p className="text-sm font-bold text-orange-800">Dispute Filed</p>
                  <p className="text-sm text-orange-700">{contract.disputeReason}</p>
              </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <InfoItem label="Quantity" value={`${contract.quantity} kg`} />
            <InfoItem label="Total Price" value={`KES ${contract.totalPrice.toLocaleString()}`} />
            <InfoItem label="Farmer" value={contract.farmerName} />
            <InfoItem label="Vendor" value={contract.vendorName} />
            <InfoItem label="Delivery Deadline" value={contract.deliveryDeadline} />
            {contract.paymentDate && <InfoItem label="Paid On" value={contract.paymentDate} />}
          </div>
        </div>
        
        {/* Logistics - QR Code */}
        {(contract.status === ContractStatus.ACTIVE || contract.status === ContractStatus.DELIVERY_CONFIRMED) && (
            <QRCodeDisplay value={contract.id} />
        )}

        {/* Action Buttons */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3 text-center">Contract Actions</h3>
          <div className="grid grid-cols-2 gap-3">
             {/* Pending Actions */}
             {contract.status === ContractStatus.PENDING && (
                <>
                  {!isCreator ? (
                      <>
                        <button 
                            onClick={() => handleStatusUpdate(ContractStatus.ACTIVE)} 
                            className="bg-blue-600 text-white p-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Accept Offer
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate(ContractStatus.CANCELLED)} 
                            className="bg-red-500 text-white p-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
                        >
                            Decline Offer
                        </button>
                      </>
                  ) : (
                       <button 
                            onClick={() => handleStatusUpdate(ContractStatus.CANCELLED)} 
                            className="bg-red-500 text-white p-2 rounded-lg text-sm font-semibold hover:bg-red-600 col-span-2 transition-colors shadow-sm"
                       >
                            Cancel Offer
                       </button>
                  )}
                </>
             )}

             {/* Active Actions */}
             {contract.status === ContractStatus.ACTIVE && user?.role === UserRole.VENDOR && (
              <button onClick={() => handleStatusUpdate(ContractStatus.DELIVERY_CONFIRMED)} className="bg-yellow-500 text-white p-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 col-span-2 shadow-sm">
                Confirm Delivery
              </button>
            )}

            {/* Delivery Confirmed Actions */}
             {contract.status === ContractStatus.DELIVERY_CONFIRMED && user?.role === UserRole.VENDOR && (
              <button onClick={() => handleStatusUpdate(ContractStatus.PAYMENT_RELEASED)} className="bg-green-500 text-white p-2 rounded-lg text-sm font-semibold hover:bg-green-600 col-span-2 shadow-sm">
                Release Payment
              </button>
            )}

            {contract.status !== ContractStatus.COMPLETED && contract.status !== ContractStatus.CANCELLED && contract.status !== ContractStatus.DISPUTED && contract.status !== ContractStatus.PAYMENT_RELEASED && (
                 <button onClick={() => setShowDisputeModal(true)} className="bg-orange-500 text-white p-2 rounded-lg text-sm font-semibold hover:bg-orange-600 col-span-2 shadow-sm">
                    Raise Dispute
                </button>
            )}
            
            {(contract.status === ContractStatus.COMPLETED || contract.status === ContractStatus.PAYMENT_RELEASED || contract.status === ContractStatus.CANCELLED) && (
                <p className="col-span-2 text-center text-sm text-gray-500">No further actions available.</p>
            )}
          </div>
        </div>

        {/* Messaging */}
        <div className="bg-white rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-800 p-4 border-b flex items-center"><MessageSquareIcon className="w-5 h-5 mr-2" /> Chat with {otherParty?.name}</h3>
            <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                {contractMessages.map(msg => (
                    <div key={msg.id} className={`flex mb-3 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-3 py-2 max-w-xs ${msg.senderId === user?.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                           <p className="text-sm">{msg.text}</p>
                           <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex">
                <input 
                    type="text"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow border rounded-l-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button type="submit" className="bg-green-600 text-white px-4 rounded-r-lg font-semibold text-sm hover:bg-green-700">
                    Send
                </button>
            </form>
        </div>
      </div>
      {showDisputeModal && <DisputeModal onClose={() => setShowDisputeModal(false)} onSubmit={handleDisputeSubmit} />}
    </Layout>
  );
};


const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const { updateUser } = useData();
    const { notify } = useNotifier();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', location: '', farmSize: '', businessName: '' });

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name,
                location: user.location,
                farmSize: user.farmSize || '',
                businessName: user.businessName || ''
            });
        }
    }, [user]);

    if (!user) return null;

    const handleSave = async () => {
        try {
            const updatedUser = { ...user, ...editForm };
            await updateUser(updatedUser);
            setIsEditing(false);
            notify("Profile updated successfully!", "success");
        } catch (error) {
            notify("Failed to update profile.", "error");
        }
    };

    return (
        <Layout>
            <Header title="My Profile" />
            <div className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
                    <button 
                        onClick={() => setIsEditing(!isEditing)} 
                        className="absolute top-4 right-4 text-gray-500 hover:text-green-600"
                    >
                        {isEditing ? <XIcon className="w-6 h-6" /> : <EditIcon className="w-6 h-6" />}
                    </button>

                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-200" />
                    
                    {isEditing ? (
                        <div className="space-y-3 mt-4 text-left">
                            <InputField label="Name" name="name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                            <InputField label="Location" name="location" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                            {user.role === UserRole.FARMER && (
                                <InputField label="Farm Size" name="farmSize" value={editForm.farmSize} onChange={e => setEditForm({...editForm, farmSize: e.target.value})} />
                            )}
                            {user.role === UserRole.VENDOR && (
                                <InputField label="Business Name" name="businessName" value={editForm.businessName} onChange={e => setEditForm({...editForm, businessName: e.target.value})} />
                            )}
                            <button onClick={handleSave} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 mt-2">Save Changes</button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className={`text-sm font-semibold uppercase mt-1 ${user.role === UserRole.FARMER ? 'text-green-600' : 'text-amber-600'}`}>{user.role}</p>
                            <div className="flex justify-center items-center mt-2">
                                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                                <span className="font-bold text-gray-700">{user.rating.toFixed(1)}</span>
                                <span className="text-gray-500 text-sm ml-1">({user.reviews} reviews)</span>
                            </div>
                        </>
                    )}
                </div>
                
                {!isEditing && (
                    <div className="bg-white p-4 rounded-lg shadow-md mt-6 text-sm">
                        <ProfileInfoItem icon={UserIcon} label="Email" value={user.email} />
                        <ProfileInfoItem icon={MapPinIcon} label="Location" value={user.location} />
                        {user.farmSize && <ProfileInfoItem icon={LeafIcon} label="Farm Size" value={user.farmSize} />}
                        {user.businessName && <ProfileInfoItem icon={UsersIcon} label="Business Name" value={user.businessName} />}
                    </div>
                )}

                <div className="mt-6">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                        <LogOutIcon className="w-5 h-5 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </Layout>
    );
};

const WalletModal = ({ onClose, onTopUp, onWithdraw }: { onClose: () => void, onTopUp: (amount: number) => void, onWithdraw: (amount: number) => void }) => {
    const [action, setAction] = useState<'topup' | 'withdraw'>('topup');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (val > 0) {
            if (action === 'topup') onTopUp(val);
            else onWithdraw(val);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-lg shadow-xl w-full max-w-xs p-6">
                <div className="flex justify-around mb-6 border-b pb-2">
                    <button onClick={() => setAction('topup')} className={`font-semibold pb-1 ${action === 'topup' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}>Top Up</button>
                    <button onClick={() => setAction('withdraw')} className={`font-semibold pb-1 ${action === 'withdraw' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}>Withdraw</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputField 
                        label="Amount (KES)" 
                        name="amount" 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        min="1"
                        placeholder="Enter amount"
                    />
                    <button 
                        type="submit" 
                        className={`w-full mt-4 py-2 rounded-lg text-white font-semibold ${action === 'topup' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        {action === 'topup' ? 'Top Up Wallet' : 'Withdraw Funds'}
                    </button>
                </form>
                 <button onClick={onClose} className="w-full mt-2 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
             </div>
        </div>
    )
}

const WalletScreen = () => {
  const { user } = useAuth();
  const { transactions, updateUser, addTransaction } = useData();
  const { notify } = useNotifier();
  const [showModal, setShowModal] = useState(false);

  if(!user) return null;

  const userTransactions = transactions.filter(t => t.userId === user.id);

  const handleTopUp = async (amount: number) => {
      try {
          const newBalance = user.walletBalance + amount;
          await updateUser({ ...user, walletBalance: newBalance });
          await addTransaction({
              id: self.crypto.randomUUID(),
              userId: user.id,
              type: TransactionType.TOP_UP,
              amount: amount,
              description: "Wallet Top Up",
              date: new Date().toISOString()
          });
          notify(`Successfully topped up KES ${amount}`, "success");
      } catch (error) {
          notify("Top up failed.", "error");
      }
  };

  const handleWithdraw = async (amount: number) => {
      if (amount > user.walletBalance) {
          notify("Insufficient funds.", "error");
          return;
      }
      try {
          const newBalance = user.walletBalance - amount;
          await updateUser({ ...user, walletBalance: newBalance });
          await addTransaction({
              id: self.crypto.randomUUID(),
              userId: user.id,
              type: TransactionType.WITHDRAWAL,
              amount: -amount,
              description: "Wallet Withdrawal",
              date: new Date().toISOString()
          });
          notify(`Successfully withdrew KES ${amount}`, "success");
      } catch (error) {
          notify("Withdrawal failed.", "error");
      }
  };

  return (
    <Layout>
        <Header title="My Wallet" />
        <div className="p-4">
            <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-6 rounded-xl shadow-lg mb-6">
                <p className="text-sm opacity-80">Current Balance</p>
                <p className="text-4xl font-bold mt-1">KES {user.walletBalance.toLocaleString()}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <button onClick={() => setShowModal(true)} className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg text-sm font-semibold flex items-center justify-center">
                        <PlusIcon className="w-5 h-5 mr-2" /> Manage Funds
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Transaction History</h3>
                <div className="space-y-3">
                    {userTransactions.length > 0 ? (
                        userTransactions.map(tx => <TransactionItem key={tx.id} transaction={tx} />)
                    ) : (
                        <p className="text-sm text-gray-500 bg-white p-4 rounded-lg shadow-md">No transactions yet.</p>
                    )}
                </div>
            </div>
            {showModal && <WalletModal onClose={() => setShowModal(false)} onTopUp={handleTopUp} onWithdraw={handleWithdraw} />}
        </div>
    </Layout>
  )
};

const NewContractScreen = () => {
    const { produceId } = useParams();
    const { produce, users, addContract } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { notify } = useNotifier();

    const selectedProduce = produce.find(p => p.id === produceId);
    const [quantity, setQuantity] = useState(1);
    const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    if (!selectedProduce || !user) {
        return <Navigate to="/produce" replace />;
    }
    
    const farmer = users.find(u => u.id === selectedProduce.farmerId);
    const totalPrice = quantity * selectedProduce.pricePerKg;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (quantity > selectedProduce.quantity) {
            notify("Cannot offer for more than available quantity.", "error");
            return;
        }
        if (!deadline) {
            notify("Please set a delivery deadline.", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            const newContract: Contract = {
                id: self.crypto.randomUUID(),
                produceId: selectedProduce.id,
                produceName: selectedProduce.name,
                farmerId: selectedProduce.farmerId,
                vendorId: user.id,
                farmerName: selectedProduce.farmerName,
                vendorName: user.name,
                quantity: quantity,
                totalPrice: totalPrice,
                deliveryDeadline: deadline,
                status: ContractStatus.PENDING,
                statusHistory: [{ status: ContractStatus.PENDING, timestamp: new Date().toISOString() }],
                createdBy: user.id, // Track creator
            };
            const savedContract = await addContract(newContract);
            notify("Offer submitted successfully!", "success");
            // Navigate to the specific contract details to see the "Splash Card"
            navigate(`/contracts/${savedContract.id}`);
        } catch (error) {
             notify("Failed to submit offer.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Header title="Make an Offer" showBack={true} />
            <div className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800">{selectedProduce.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">From: {selectedProduce.farmerName}</p>
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>Available: <span className="font-semibold">{selectedProduce.quantity} kg</span></p>
                        <p>Price: <span className="font-semibold">KES {selectedProduce.pricePerKg}/kg</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-center">Your Offer</h3>
                    <InputField 
                        label="Quantity (kg)"
                        name="quantity"
                        type="number"
                        value={String(quantity)}
                        onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        min="1"
                        max={String(selectedProduce.quantity)}
                    />
                     <InputField 
                        label="Delivery Deadline"
                        name="deadline"
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                    />

                    <div className="pt-4 border-t text-center">
                        <p className="text-gray-600">Total Price</p>
                        <p className="text-3xl font-bold text-green-600">KES {totalPrice.toLocaleString()}</p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Offer'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

const FarmerNewContractScreen = () => {
    const { produceId } = useParams();
    const { produce, users, addContract } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { notify } = useNotifier();

    const selectedProduce = produce.find(p => p.id === produceId);

    const [vendorId, setVendorId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const vendors = users.filter(u => u.role === UserRole.VENDOR);

    useEffect(() => {
        if (vendors.length > 0) {
            setVendorId(vendors[0].id);
        }
    }, []); // Run only once

    if (!selectedProduce || !user || user.id !== selectedProduce.farmerId) {
        return <Navigate to="/my-produce" replace />;
    }

    const totalPrice = quantity * selectedProduce.pricePerKg;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorId) {
            notify("Please select a vendor.", "error");
            return;
        }
        if (quantity > selectedProduce.quantity) {
            notify("Cannot offer for more than available quantity.", "error");
            return;
        }
        if (!deadline) {
            notify("Please set a delivery deadline.", "warning");
            return;
        }
        
        const selectedVendor = users.find(u => u.id === vendorId);
        if(!selectedVendor) {
            notify("Selected vendor not found.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const newContract: Contract = {
                id: self.crypto.randomUUID(),
                produceId: selectedProduce.id,
                produceName: selectedProduce.name,
                farmerId: user.id,
                vendorId: selectedVendor.id,
                farmerName: user.name,
                vendorName: selectedVendor.name,
                quantity: quantity,
                totalPrice: totalPrice,
                deliveryDeadline: deadline,
                status: ContractStatus.PENDING,
                statusHistory: [{ status: ContractStatus.PENDING, timestamp: new Date().toISOString() }],
                createdBy: user.id, // Track creator
            };
            const savedContract = await addContract(newContract);
            notify(`Contract offer sent to ${selectedVendor.name}!`, "success");
            navigate(`/contracts/${savedContract.id}`);
        } catch (error) {
             notify("Failed to create contract.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Header title="Create New Contract" showBack={true} />
            <div className="p-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800">{selectedProduce.name}</h2>
                    <div className="mt-2 space-y-2 text-sm text-gray-700">
                        <p>Available Quantity: <span className="font-semibold">{selectedProduce.quantity} kg</span></p>
                        <p>Listing Price: <span className="font-semibold">KES {selectedProduce.pricePerKg}/kg</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-center">Contract Details</h3>
                    <div>
                        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Select Vendor</label>
                        <select id="vendor" name="vendor" value={vendorId} onChange={e => setVendorId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name} - {v.businessName}</option>)}
                        </select>
                    </div>
                    <InputField 
                        label="Quantity (kg)"
                        name="quantity"
                        type="number"
                        value={String(quantity)}
                        onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        min="1"
                        max={String(selectedProduce.quantity)}
                    />
                     <InputField 
                        label="Delivery Deadline"
                        name="deadline"
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                    />

                    <div className="pt-4 border-t text-center">
                        <p className="text-gray-600">Total Price</p>
                        <p className="text-3xl font-bold text-green-600">KES {totalPrice.toLocaleString()}</p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Contract Offer'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

const InsightsScreen = () => {
    return (
        <Layout>
            <Header title="Insights" />
            <div className="p-4 text-center mt-10">
                <BarChartIcon className="w-16 h-16 mx-auto text-gray-300" />
                <h2 className="mt-4 text-xl font-semibold text-gray-700">Coming Soon!</h2>
                <p className="text-gray-500 mt-2">We're working on providing you with valuable insights about your performance, market trends, and more.</p>
            </div>
        </Layout>
    );
};


// Generic Input Field Component
interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    [x: string]: any; // for other props like min, max, etc.
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange, placeholder, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            {...props}
        />
    </div>
);


function App() {
  return (
    <DataProvider>
      <NotificationProvider>
        <AuthProvider>
          <HashRouter>
            <AppRoutes />
            <ToastContainer />
          </HashRouter>
        </AuthProvider>
      </NotificationProvider>
    </DataProvider>
  );
}

const AppRoutes = () => {
    const { loading } = useData();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <LeafIcon className="w-16 h-16 text-green-600 mx-auto animate-spin"/>
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading Mkulima Express...</h2>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/admin/login" element={<AdminLoginScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/register/farmer" element={<FarmerRegistrationScreen />} />
            <Route path="/register/vendor" element={<VendorRegistrationScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
            <Route path="/produce" element={<ProtectedRoute><ProduceScreen /></ProtectedRoute>} />
            <Route path="/my-produce" element={<ProtectedRoute><MyProduceScreen /></ProtectedRoute>} />
            <Route path="/my-produce/add" element={<ProtectedRoute><AddProduceScreen /></ProtectedRoute>} />
            <Route path="/my-produce/:produceId/new-contract" element={<ProtectedRoute><FarmerNewContractScreen /></ProtectedRoute>} />
            <Route path="/produce/:produceId/new-contract" element={<ProtectedRoute><NewContractScreen/></ProtectedRoute>} />
            <Route path="/contracts" element={<ProtectedRoute><ContractsScreen /></ProtectedRoute>} />
            <Route path="/contracts/:id" element={<ProtectedRoute><ContractDetailScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><WalletScreen /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><InsightsScreen /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default App;
