
import React, { useState, useContext, createContext, useMemo, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import { User, UserRole, Produce, Contract, ContractStatus, Transaction, TransactionType, Message, Logistics } from './types';
import { mockUsers, mockProduce, mockContracts, mockTransactions, mockMessages } from './constants';

// --- ICONS --- //
const HomeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const LeafIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13V8a5 5 0 0 1 10 0v5a7 7 0 0 1-7 7m0 0c-3.33 0-5.46-2.01-6-5h12c-.54 2.99-2.67 5-6 5"></path><path d="M12 13V3"></path></svg>;
const FileTextIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const UserIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const UsersIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const LogOutIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;
const StarIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const ChevronLeftIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>;
const CheckCircleIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
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


// --- DATA CONTEXT --- //
interface DataContextType {
  users: User[];
  produce: Produce[];
  contracts: Contract[];
  transactions: Transaction[];
  messages: Message[];
  updateUser: (updatedUser: User) => void;
  updateContract: (updatedContract: Contract) => void;
  addContract: (newContract: Contract) => void;
  addProduce: (newProduce: Produce) => void;
  addUser: (newUser: User) => User;
  addTransaction: (newTransaction: Transaction) => void;
  addMessage: (newMessage: Message) => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const DataContext = createContext<DataContextType | null>(null);

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>(Object.values(mockUsers));
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [produce, setProduce] = useState<Produce[]>(mockProduce);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [messages, setMessages] = useState<Message[]>(mockMessages);


  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateContract = (updatedContract: Contract) => {
    setContracts(prevContracts => prevContracts.map(c => c.id === updatedContract.id ? updatedContract : c));
  };
  
  const addContract = (newContract: Contract) => {
    setContracts(prev => [newContract, ...prev]);
  };

  const addProduce = (newProduce: Produce) => {
    setProduce(prev => [newProduce, ...prev]);
  }

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }
  
  const addTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const addMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };

  const value = useMemo(() => ({
    users, produce, contracts, transactions, messages,
    updateUser, updateContract, addContract, addProduce, addUser, addTransaction, addMessage, setUsers
  }), [users, produce, contracts, transactions, messages]);

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
type UserRegistrationData = Omit<User, 'id' | 'rating' | 'reviews' | 'avatarUrl' | 'walletBalance'>;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: UserRegistrationData) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { users, addUser } = useData();

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
        setUser(foundUser);
        return true;
    }
    return false;
  };

  const register = (userData: UserRegistrationData) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      rating: 0,
      reviews: 0,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`,
      walletBalance: 0,
    };
    const addedUser = addUser(newUser);
    setUser(addedUser);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, register }), [user, users]);

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

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
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
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};


// --- UI COMPONENTS --- //

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.ACTIVE: return 'text-blue-600 bg-blue-100';
    case ContractStatus.COMPLETED: return 'text-green-600 bg-green-100';
    case ContractStatus.DELIVERY_CONFIRMED: return 'text-yellow-600 bg-yellow-100';
    case ContractStatus.PAYMENT_RELEASED: return 'text-purple-600 bg-purple-100';
    case ContractStatus.PENDING: return 'text-gray-600 bg-gray-100';
    case ContractStatus.DISPUTED: return 'text-orange-600 bg-orange-100';
    default: return 'text-red-600 bg-red-100';
  }
};

const ProduceCard: React.FC<{ produce: Produce }> = ({ produce }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotifier();

  const handleMakeOffer = () => {
    if (user?.role === UserRole.VENDOR) {
      navigate(`/produce/${produce.id}/new-contract`);
    } else {
      notify("Only vendors can make offers.", "info");
    }
  };
  
  const handleCreateContract = () => {
    navigate(`/my-produce/${produce.id}/new-contract`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img src={produce.imageUrl} alt={produce.name} className="w-full h-48 object-cover" />
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
          {user?.role === UserRole.VENDOR && (
            <button 
              onClick={handleMakeOffer}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Make Offer
            </button>
          )}
           {user?.role === UserRole.FARMER && (
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
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {user.name} {isCurrentUser && '(You)'} <br/> ({user.location.split(',')[0]})
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

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/produce', label: 'Produce', icon: LeafIcon },
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
    const [step, setStep] = useState<'role' | 'form'>('role');
    const [selectedRole, setSelectedRole] = useState<UserRole.FARMER | UserRole.VENDOR | null>(null);
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const roleConfig = {
        [UserRole.FARMER]: {
            demoUser: 'juma.mwangi@example.com',
        },
        [UserRole.VENDOR]: {
            demoUser: 'aisha.omar@example.com',
        },
    };

    const handleRoleSelect = (role: UserRole.FARMER | UserRole.VENDOR) => {
        setSelectedRole(role);
        setEmail(roleConfig[role].demoUser);
        setStep('form');
        setError('');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }
        const success = login(email, password);
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

                {step === 'role' && (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Select Your Role</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleRoleSelect(UserRole.FARMER)}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                            >
                                I'm a Farmer
                            </button>
                            <button
                                onClick={() => handleRoleSelect(UserRole.VENDOR)}
                                className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                            >
                                I'm a Vendor
                            </button>
                        </div>
                         <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/onboarding" className="font-semibold text-green-600 hover:text-green-700">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
                {step === 'form' && selectedRole && (
                     <div className="p-8">
                        <div className="flex items-center mb-6">
                            <button onClick={() => setStep('role')} className="text-gray-500 hover:text-gray-800">
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-center text-gray-800 flex-grow">
                                {selectedRole === UserRole.FARMER ? 'Farmer' : 'Vendor'} Login
                            </h2>
                        </div>
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
                                className={`w-full text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                                    selectedRole === UserRole.FARMER 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-amber-500 hover:bg-amber-600'
                                }`}
                            >
                                Login
                            </button>
                        </form>
                         <div className="mt-6 border-t pt-4 text-sm text-gray-500 text-center">
                            <p><span className="font-medium">Demo Email:</span> {roleConfig[selectedRole].demoUser}</p>
                            <p className="mt-1 italic">(Any password will work)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLoginSuccess = () => {
      setIsModalOpen(false);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
  }

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
       <div className="absolute bottom-4 text-center">
            <p className="text-sm text-gray-600">
                Are you an administrator?{' '}
                <Link to="/admin/login" className="font-semibold text-green-600 hover:text-green-700">
                    Login here
                </Link>
            </p>
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

    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }

        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (foundUser && foundUser.role !== UserRole.ADMIN) {
             setError('This login is for administrators only.');
             return;
        }

        const success = login(email, password);

        if (success) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } else {
            setError('Invalid administrator credentials.');
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
                        className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                    >
                        Login
                    </button>
                </form>
                 <div className="mt-6 border-t pt-4 text-sm text-gray-500 text-center">
                    <p><span className="font-medium">Demo Email:</span> admin@mkulima.express</p>
                    <p className="mt-1 italic">(Any password will work)</p>
                </div>
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            notify("Please enter your email address.", "warning");
            return;
        }
        notify(`If an account exists for ${email}, a password reset link has been sent.`, "success");
        navigate('/login');
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
    const [formData, setFormData] = useState({ name: '', email: '', location: '', farmSize: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.location || !formData.farmSize) {
            setError('All fields are required.');
            return;
        }
        register({ ...formData, role: UserRole.FARMER });
        navigate('/dashboard', { replace: true });
    };

    return (
        <Layout showNav={false}>
            <Header title="Farmer Registration" showBack={true} />
            <div className="p-4">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Juma Mwangi" />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="juma@example.com" />
                    <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Nakuru, Kenya" />
                    <InputField label="Farm Size" name="farmSize" value={formData.farmSize} onChange={handleChange} placeholder="15 Acres" />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Register</button>
                </form>
            </div>
        </Layout>
    );
};

const VendorRegistrationScreen = () => {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', location: '', businessName: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.location || !formData.businessName) {
            setError('All fields are required.');
            return;
        }
        register({ ...formData, role: UserRole.VENDOR });
        navigate('/dashboard', { replace: true });
    };

    return (
        <Layout showNav={false}>
            <Header title="Vendor Registration" showBack={true} />
            <div className="p-4">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Aisha Omar" />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="aisha@example.com" />
                    <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Nairobi, Kenya" />
                    <InputField label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Aisha Fresh Produce" />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">Register</button>
                </form>
            </div>
        </Layout>
    );
};

const InputField = ({ label, name, type = 'text', value, onChange, placeholder }: { label: string; name: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            autoComplete={name === 'password' ? 'current-password' : 'email'}
        />
    </div>
);

const DashboardScreen = () => {
    const { user } = useAuth();
    if (!user) return null;

    if (user.role === UserRole.ADMIN) {
        return <AdminDashboardScreen />;
    }
    return <FarmerVendorDashboardScreen />;
}

const FarmerVendorDashboardScreen = () => {
    const { user } = useAuth();
    const { contracts, users } = useData();
    if (!user) return null;

    const isFarmer = user.role === UserRole.FARMER;
    const isVendor = user.role === UserRole.VENDOR;

    const userContracts = contracts.filter(c => isFarmer ? c.farmerId === user.id : c.vendorId === user.id);
    const activeContracts = userContracts.filter(c => c.status === ContractStatus.ACTIVE).length;
    
    const totalRevenue = isFarmer ? userContracts
        .filter(c => c.status === ContractStatus.COMPLETED || c.status === ContractStatus.PAYMENT_RELEASED)
        .reduce((sum, c) => sum + c.totalPrice, 0) : 0;
        
    const totalSpent = isVendor ? userContracts
        .filter(c => c.status === ContractStatus.COMPLETED || c.status === ContractStatus.PAYMENT_RELEASED)
        .reduce((sum, c) => sum + c.totalPrice, 0) : 0;

    const quickStats = isFarmer ? [
        { label: 'Active Contracts', value: activeContracts },
        { label: 'Payments Due', value: userContracts.filter(c => c.status === ContractStatus.DELIVERY_CONFIRMED).length },
        { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}` },
    ] : [
        { label: 'Active Deliveries', value: activeContracts },
        { label: 'Total Spent', value: `KES ${totalSpent.toLocaleString()}` },
        { label: 'Completed Deals', value: userContracts.filter(c => c.status === ContractStatus.COMPLETED).length },
    ];
    
    const recentContract = userContracts.sort((a,b) => new Date(b.deliveryDeadline).getTime() - new Date(a.deliveryDeadline).getTime())[0];
    
    return (
        <Layout>
            <Header title="Dashboard" />
            <div className="p-4 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto -mt-16 border-4 border-white" />
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">Welcome, {user.name.split(' ')[0]}!</h2>
                    <p className="text-gray-500">{user.role}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    {quickStats.map(stat => (
                        <div key={stat.label} className="bg-white p-4 rounded-xl shadow-md">
                            <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Recent Activity</h3>
                    {recentContract ? (
                        <ContractCard contract={recentContract} />
                    ) : (
                        <p className="text-center text-gray-500 bg-white p-4 rounded-lg shadow-md">No recent activity.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">User Locations</h3>
                    <MapView users={users} currentUserId={user.id} />
                </div>
            </div>
        </Layout>
    );
};

const AdminDashboardScreen = () => {
    const [activeTab, setActiveTab] = useState('disputes');
    const { users, contracts, produce, setUsers } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { notify } = useNotifier();

    const stats = {
        users: users.length,
        produce: produce.length,
        contracts: contracts.length,
        disputes: contracts.filter(c => c.status === ContractStatus.DISPUTED).length,
    };

    const handleDeleteUser = (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`)) {
            // Can't delete the admin account
            if (userId === 'admin-01') {
                notify("Cannot delete the primary admin account.", "error");
                return;
            }
            setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
            notify(`User ${userName} has been deleted.`, "success");
        }
    };

    const TabButton = ({ tabName, label, icon: Icon }: { tabName: string, label: string, icon: React.ElementType }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 flex items-center justify-center p-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tabName ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
        >
            <Icon className="w-5 h-5 mr-2" />
            {label}
        </button>
    );
    
    const filteredContracts = useMemo(() => {
        if (!searchTerm) return contracts;
        return contracts.filter(c =>
            c.produceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, contracts]);

    const AdminStatCard = ({ value, label }: { value: number, label: string }) => (
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
            <p className="text-xl font-bold text-green-600">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );

    return (
        <Layout>
            <Header title="Admin Dashboard" />
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AdminStatCard value={stats.users} label="Total Users" />
                    <AdminStatCard value={stats.produce} label="Produce Listings" />
                    <AdminStatCard value={stats.contracts} label="Total Contracts" />
                    <AdminStatCard value={stats.disputes} label="Active Disputes" />
                </div>

                <div className="bg-white rounded-lg shadow-md">
                    <div className="flex border-b border-gray-200">
                        <TabButton tabName="disputes" label="Disputes" icon={ShieldAlertIcon} />
                        <TabButton tabName="users" label="Users" icon={UsersIcon} />
                        <TabButton tabName="contracts" label="Contracts" icon={FileTextIcon} />
                    </div>
                    <div className="p-4">
                        {activeTab === 'disputes' && (
                            <div>
                                {stats.disputes > 0 ? (
                                    contracts.filter(c => c.status === ContractStatus.DISPUTED).map(contract => (
                                        <ContractCard key={contract.id} contract={contract} />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No active disputes.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'users' && (
                            <ul className="divide-y divide-gray-200">
                                {users.map(user => (
                                    <li key={user.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center">
                                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => navigate(`/profile/${user.id}`)} className="p-2 text-gray-500 hover:text-green-600"><UserIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteUser(user.id, user.name)} className="p-2 text-gray-500 hover:text-red-600"><Trash2Icon className="w-5 h-5"/></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {activeTab === 'contracts' && (
                             <div>
                                 <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search contracts..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        aria-label="Search contracts"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <SearchIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                {filteredContracts.length > 0 ? (
                                    filteredContracts.map(contract => (
                                        <ContractCard key={contract.id} contract={contract} />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No contracts found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};


const ProduceListScreen = () => {
    const { user } = useAuth();
    const { produce } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    if (!user) return null;

    const isFarmer = user.role === UserRole.FARMER;
    const listTitle = isFarmer ? "My Produce Listings" : "Available Produce";
    const produceToList = isFarmer ? produce.filter(p => p.farmerId === user.id) : produce;

    const filteredProduce = useMemo(() => {
        if (!searchTerm) {
            return produceToList;
        }
        return produceToList.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, produceToList]);

    return (
        <Layout>
            <Header title={listTitle} />
            <div className="p-4 pb-24">
                 <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by name or type..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-label="Search produce"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                {filteredProduce.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProduce.map(p => (
                            <ProduceCard key={p.id} produce={p} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-16">
                        <LeafIcon className="w-16 h-16 mx-auto text-gray-300" />
                        <p className="mt-4">{searchTerm ? `No produce found for "${searchTerm}".` : (isFarmer ? "You haven't listed any produce yet." : "No produce is currently available.")}</p>
                    </div>
                )}
            </div>
             {user?.role === UserRole.FARMER && (
                <button
                    onClick={() => navigate('/produce/new')}
                    className="fixed bottom-20 right-4 bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-transform hover:scale-110 z-20"
                    aria-label="Add new produce"
                >
                    <PlusIcon className="w-8 h-8" />
                </button>
            )}
        </Layout>
    );
};

const AddProduceScreen = () => {
    const { user } = useAuth();
    const { addProduce } = useData();
    const navigate = useNavigate();
    const { notify } = useNotifier();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        quantity: '',
        pricePerKg: '',
        description: '',
        harvestDate: '',
    });
    const [error, setError] = useState('');

    if (!user || user.role !== UserRole.FARMER) {
        return <Navigate to="/produce" replace />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        for (const key in formData) {
            if (formData[key as keyof typeof formData] === '') {
                setError('All fields are required.');
                return;
            }
        }

        const quantity = parseFloat(formData.quantity);
        const pricePerKg = parseFloat(formData.pricePerKg);

        if (isNaN(quantity) || quantity <= 0) {
            setError('Please enter a valid, positive quantity.');
            return;
        }
        if (isNaN(pricePerKg) || pricePerKg <= 0) {
            setError('Please enter a valid, positive price.');
            return;
        }

        const newProduce: Produce = {
            id: `prod-${Date.now()}`,
            farmerId: user.id,
            farmerName: user.name,
            name: formData.name,
            type: formData.type,
            quantity,
            pricePerKg,
            location: user.location,
            imageUrl: `https://picsum.photos/seed/${formData.name.replace(/\s/g, '-') || Date.now()}/800/600`,
            description: formData.description,
            harvestDate: formData.harvestDate,
        };

        addProduce(newProduce);
        notify('Produce listed successfully!', 'success');
        navigate('/produce');
    };

    return (
        <Layout showNav={false}>
            <Header title="Add New Produce" showBack={true} />
            <div className="p-4">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <InputField label="Produce Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Fresh Tomatoes" />
                    <InputField label="Produce Type" name="type" value={formData.type} onChange={handleChange} placeholder="e.g., Fruit" />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Produce Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                    </div>
                    
                    <InputField label="Quantity (kg)" name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="e.g., 100" />
                    <InputField label="Price per kg (KES)" name="pricePerKg" type="number" value={formData.pricePerKg} onChange={handleChange} placeholder="e.g., 90" />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe your produce..."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">Expected Harvest Date</label>
                        <input
                            type="date"
                            id="harvestDate"
                            name="harvestDate"
                            value={formData.harvestDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">List Produce</button>
                </form>
            </div>
        </Layout>
    );
};


const ContractsScreen = () => {
    const { user } = useAuth();
    const { contracts } = useData();
    if (!user) return null;

    const [selectedStatuses, setSelectedStatuses] = useState<ContractStatus[]>([]);

    const isFarmer = user.role === UserRole.FARMER;
    const isAdmin = user.role === UserRole.ADMIN;
    const userContracts = isAdmin ? contracts : contracts.filter(c => isFarmer ? c.farmerId === user.id : c.vendorId === user.id);

    const handleStatusToggle = (status: ContractStatus) => {
        setSelectedStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };
    
    const filteredAndSortedContracts = useMemo(() => {
        const filtered = selectedStatuses.length === 0
            ? userContracts
            : userContracts.filter(contract => selectedStatuses.includes(contract.status));
        return filtered.sort((a,b) => new Date(b.deliveryDeadline).getTime() - new Date(a.deliveryDeadline).getTime());
    }, [userContracts, selectedStatuses]);

    return (
        <Layout>
            <Header title="My Contracts" />
            <div className="p-4">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-700">Filter by Status</h4>
                        {selectedStatuses.length > 0 && (
                            <button
                                onClick={() => setSelectedStatuses([])}
                                className="text-sm font-semibold text-red-500 hover:text-red-700"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(ContractStatus).map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusToggle(status)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full border-2 transition-colors ${
                                    selectedStatuses.includes(status)
                                        ? `border-green-600 bg-green-100 text-green-800`
                                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredAndSortedContracts.length > 0 ? (
                    filteredAndSortedContracts.map(contract => <ContractCard key={contract.id} contract={contract} />)
                ) : (
                    <div className="text-center text-gray-500 mt-16">
                        <FileTextIcon className="w-16 h-16 mx-auto text-gray-300" />
                        <p className="mt-4">
                            {userContracts.length > 0 ? "No contracts match your filters." : "You have no contracts yet."}
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

const ContractFormScreen = () => {
    const { produceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { produce, addContract } = useData();
    const { notify } = useNotifier();

    const currentProduce = produce.find(p => p.id === produceId);

    const [quantity, setQuantity] = useState('');
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');

    if (!currentProduce || !user) {
        return <Navigate to="/produce" replace />;
    }

    const totalPrice = (parseFloat(quantity) || 0) * currentProduce.pricePerKg;
    const hasSufficientFunds = user.walletBalance >= totalPrice;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numQuantity = parseFloat(quantity);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            setError('Please enter a valid quantity.');
            return;
        }
        if (numQuantity > currentProduce.quantity) {
            setError(`Quantity cannot exceed available ${currentProduce.quantity} kg.`);
            return;
        }
        if (!deadline) {
            setError('Please select a delivery deadline.');
            return;
        }
        if (!hasSufficientFunds) {
            notify("You have insufficient funds to make this offer.", "error");
            return;
        }
        
        const newContract: Contract = {
            id: `contract-${Date.now()}`,
            produceId: currentProduce.id,
            produceName: currentProduce.name,
            farmerId: currentProduce.farmerId,
            vendorId: user.id,
            farmerName: currentProduce.farmerName,
            vendorName: user.name,
            quantity: numQuantity,
            totalPrice: totalPrice,
            deliveryDeadline: deadline,
            status: ContractStatus.PENDING,
            statusHistory: [
                { status: ContractStatus.PENDING, timestamp: new Date().toISOString() }
            ],
        };

        addContract(newContract);
        notify('Your contract offer has been sent to the farmer!', 'success');
        navigate('/contracts');
    };

    return (
        <Layout showNav={false}>
            <Header title="Create Contract Offer" showBack={true} />
            <div className="p-4 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800">{currentProduce.name}</h3>
                    <p className="text-sm text-gray-500">From: {currentProduce.farmerName}</p>
                    <p className="text-sm text-gray-500">Available: {currentProduce.quantity} kg at KES {currentProduce.pricePerKg}/kg</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., 50"
                            max={currentProduce.quantity}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Delivery Deadline</label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => {
                                setDeadline(e.target.value)
                                setError('');
                            }}
                            min={new Date().toISOString().split("T")[0]}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                        <p className="text-gray-600">Total Price</p>
                        <p className="text-2xl font-bold text-green-600">KES {totalPrice.toLocaleString()}</p>
                        {!hasSufficientFunds && totalPrice > 0 && (
                            <p className="text-xs text-red-500 mt-1">Insufficient funds. Your balance is KES {user.walletBalance.toLocaleString()}</p>
                        )}
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex space-x-2">
                         <button
                            type="button"
                            onClick={() => navigate('/produce')}
                            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!hasSufficientFunds}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Submit Offer
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

const FarmerContractFormScreen = () => {
    const { produceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { produce, users, addContract } = useData();
    const { notify } = useNotifier();

    const currentProduce = produce.find(p => p.id === produceId);
    
    const [vendorId, setVendorId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');

    if (!currentProduce || !user || user.role !== UserRole.FARMER) {
        return <Navigate to="/produce" replace />;
    }
    
    const availableVendors = users.filter(u => u.role === UserRole.VENDOR);
    const totalPrice = (parseFloat(quantity) || 0) * currentProduce.pricePerKg;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numQuantity = parseFloat(quantity);
        if (!vendorId) {
            setError('Please select a vendor.');
            return;
        }
        if (isNaN(numQuantity) || numQuantity <= 0) {
            setError('Please enter a valid quantity.');
            return;
        }
        if (numQuantity > currentProduce.quantity) {
            setError(`Quantity cannot exceed available ${currentProduce.quantity} kg.`);
            return;
        }
        if (!deadline) {
            setError('Please select a delivery deadline.');
            return;
        }
        
        const selectedVendor = users.find(u => u.id === vendorId);
        if(!selectedVendor) {
            setError('Selected vendor not found.');
            return;
        }
        
        const newContract: Contract = {
            id: `contract-${Date.now()}`,
            produceId: currentProduce.id,
            produceName: currentProduce.name,
            farmerId: user.id,
            vendorId: selectedVendor.id,
            farmerName: user.name,
            vendorName: selectedVendor.name,
            quantity: numQuantity,
            totalPrice: totalPrice,
            deliveryDeadline: deadline,
            status: ContractStatus.PENDING,
            statusHistory: [{ status: ContractStatus.PENDING, timestamp: new Date().toISOString() }],
        };

        addContract(newContract);
        notify(`Your contract offer has been sent to ${selectedVendor.name}!`, 'success');
        navigate('/contracts');
    };

    return (
        <Layout showNav={false}>
            <Header title="Create New Contract" showBack={true} />
            <div className="p-4 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800">{currentProduce.name}</h3>
                    <p className="text-sm text-gray-500">Available: {currentProduce.quantity} kg at KES {currentProduce.pricePerKg}/kg</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    <div>
                        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Select Vendor</label>
                        <select
                            id="vendor"
                            value={vendorId}
                            onChange={e => {
                                setVendorId(e.target.value);
                                setError('');
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                            <option value="" disabled>Choose a vendor...</option>
                            {availableVendors.map(v => (
                                <option key={v.id} value={v.id}>{v.name} - {v.location}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                        <input
                            type="number" id="quantity" value={quantity}
                            onChange={e => { setQuantity(e.target.value); setError(''); }}
                            placeholder="e.g., 50" max={currentProduce.quantity}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    
                     <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Delivery Deadline</label>
                        <input
                            type="date" id="deadline" value={deadline}
                            onChange={e => { setDeadline(e.target.value); setError(''); }}
                            min={new Date().toISOString().split("T")[0]}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-gray-600">Total Price</p>
                        <p className="text-2xl font-bold text-blue-600">KES {totalPrice.toLocaleString()}</p>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div className="flex space-x-2">
                         <button type="button" onClick={() => navigate('/produce')} className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Send Offer
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};


const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const ScheduleDeliveryModal = ({ contract, onClose }: { contract: Contract, onClose: () => void }) => {
    const { updateContract } = useData();
    const { notify } = useNotifier();
    const [partner, setPartner] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!partner) {
            notify('Please select a logistics partner.', 'warning');
            return;
        }

        const updatedContract: Contract = {
            ...contract,
            logistics: {
                partner,
                status: 'Scheduled',
                pickupTime: new Date().toISOString(),
                pickupQRCode: `MKE-${contract.id.slice(-4)}-PICKUP`,
                deliveryQRCode: `MKE-${contract.id.slice(-4)}-DELIVERY`
            }
        };

        updateContract(updatedContract);
        notify('Delivery has been scheduled successfully!', 'success');
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 text-center">Schedule Delivery</h3>
                    <p className="text-sm text-center text-gray-500">
                        Choose a logistics partner to handle the pickup and delivery for this contract.
                    </p>
                    <div>
                        <label htmlFor="partner" className="block text-sm font-medium text-gray-700">Logistics Partner</label>
                        <select
                            id="partner" value={partner}
                            onChange={e => setPartner(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                            <option value="" disabled>Select a partner...</option>
                            <option value="Kobo Logistics">Kobo Logistics</option>
                            <option value="Sendy">Sendy</option>
                            <option value="Lori Systems">Lori Systems</option>
                            <option value="Local Transporters">Local Transporters</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Confirm Schedule
                    </button>
                </form>
            </div>
        </div>
    );
};

const ContractDetailsScreen = () => {
    const { contractId } = useParams();
    const { user } = useAuth();
    const { contracts, users, produce, updateContract, updateUser, addTransaction } = useData();
    const navigate = useNavigate();
    const { notify } = useNotifier();
    
    const contract = useMemo(() => contracts.find(c => c.id === contractId), [contracts, contractId]);
    
    const [isScheduling, setIsScheduling] = useState(false);
    const [isEditingDispute, setIsEditingDispute] = useState(false);
    const [editedDisputeReason, setEditedDisputeReason] = useState('');
    const [editedDisputeFiledBy, setEditedDisputeFiledBy] = useState('');

    if (!contract || !user) {
        return <Navigate to="/contracts" replace />;
    }

    const sortedStatusHistory = useMemo(() => {
        return [...(contract.statusHistory || [])].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [contract.statusHistory]);

    const currentProduce = produce.find(p => p.id === contract.produceId);
    const farmer = users.find(u => u.id === contract.farmerId);
    const vendor = users.find(u => u.id === contract.vendorId);
    
    if (!currentProduce || !farmer || !vendor) {
        return <p>Loading contract details...</p>; // Or a proper error component
    }

    const handleUpdateStatus = (newStatus: ContractStatus) => {
        const newHistoryEntry = { status: newStatus, timestamp: new Date().toISOString() };
        const updatedContract = {
            ...contract,
            status: newStatus,
            statusHistory: [...(contract.statusHistory || []), newHistoryEntry]
        };

        let notificationMessage = '';
        let notificationType: TypeOptions = 'info';

        switch (newStatus) {
            case ContractStatus.ACTIVE:
                notificationMessage = 'Offer accepted!';
                notificationType = 'success';
                break;
            case ContractStatus.CANCELLED:
                if (contract.status === ContractStatus.PENDING) {
                    notificationMessage = 'Contract offer declined.';
                } else if (contract.status === ContractStatus.DISPUTED) {
                    notificationMessage = 'Dispute resolved in favor of the vendor. Contract is cancelled.';
                } else {
                    notificationMessage = 'Contract cancelled.';
                }
                break;
            case ContractStatus.DELIVERY_CONFIRMED:
                notificationMessage = 'Delivery confirmed by farmer.';
                notificationType = 'success';
                break;
            case ContractStatus.COMPLETED:
                if (contract.status === ContractStatus.DELIVERY_CONFIRMED) {
                    if (vendor.walletBalance < contract.totalPrice) {
                        notify("Insufficient wallet balance to release payment.", "error");
                        return;
                    }
                    const updatedVendor = { ...vendor, walletBalance: vendor.walletBalance - contract.totalPrice };
                    const updatedFarmer = { ...farmer, walletBalance: farmer.walletBalance + contract.totalPrice };
                    updateUser(updatedVendor);
                    updateUser(updatedFarmer);
                    
                    const paymentDate = new Date().toISOString();
                    addTransaction({
                        id: `txn-${Date.now()}-v`, userId: vendor.id, date: paymentDate,
                        type: TransactionType.PAYMENT_SENT, amount: -contract.totalPrice,
                        description: `Payment for ${contract.produceName}`,
                    });
                    addTransaction({
                        id: `txn-${Date.now()}-f`, userId: farmer.id, date: paymentDate,
                        type: TransactionType.PAYMENT_RECEIVED, amount: contract.totalPrice,
                        description: `Payment from ${vendor.name}`,
                    });

                    notificationMessage = 'Payment released. Contract is now complete!';
                    updatedContract.paymentDate = new Date().toISOString().split('T')[0];
                } else if (contract.status === ContractStatus.DISPUTED) {
                    notificationMessage = 'Dispute resolved in favor of the farmer. Contract is complete!';
                    updatedContract.paymentDate = new Date().toISOString().split('T')[0];
                }
                notificationType = 'success';
                break;
        }

        updateContract(updatedContract);

        if (notificationMessage) {
            notify(notificationMessage, notificationType);
        }
    };

    const handleFileDispute = () => {
        const reason = window.prompt("Please state the reason for this dispute:");
        if (reason && reason.trim()) {
            const newHistoryEntry = { status: ContractStatus.DISPUTED, timestamp: new Date().toISOString() };
            const updatedContract = {
                ...contract,
                status: ContractStatus.DISPUTED,
                statusHistory: [...(contract.statusHistory || []), newHistoryEntry],
                disputeReason: reason.trim(),
                disputeFiledBy: user.name,
            };
            updateContract(updatedContract);
            notify('Dispute filed successfully.', 'warning');
        }
    };

    const handleStartEditDispute = () => {
        setEditedDisputeReason(contract.disputeReason || '');
        setEditedDisputeFiledBy(contract.disputeFiledBy || '');
        setIsEditingDispute(true);
    };

    const handleSaveDispute = () => {
        if (!editedDisputeReason.trim() || !editedDisputeFiledBy.trim()) {
            notify('Dispute reason and filer cannot be empty.', 'error');
            return;
        }
        const updatedContract = {
            ...contract,
            disputeReason: editedDisputeReason.trim(),
            disputeFiledBy: editedDisputeFiledBy.trim(),
        };
        updateContract(updatedContract);
        notify('Dispute details updated successfully.', 'success');
        setIsEditingDispute(false);
    };

    const handleCancelEditDispute = () => {
        setIsEditingDispute(false);
        setEditedDisputeReason(contract.disputeReason || '');
        setEditedDisputeFiledBy(contract.disputeFiledBy || '');
    };
    
    const canTrackDelivery = contract.logistics && contract.logistics.status !== 'Pending';
    const canFileDispute = user.role !== UserRole.ADMIN && [ContractStatus.ACTIVE, ContractStatus.DELIVERY_CONFIRMED].includes(contract.status);

    const UserDetailCard = ({ user: profileUser }: { user: User }) => (
      <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
              <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-12 h-12 rounded-full"/>
              <div>
                  <p className="font-bold text-gray-800">{profileUser.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{profileUser.role.toLowerCase()}</p>
                   <div className="flex items-center space-x-1 text-sm">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-gray-700">{profileUser.rating}</span>
                      <span className="text-gray-500">({profileUser.reviews} reviews)</span>
                  </div>
              </div>
          </div>
          <button
              onClick={() => navigate(`/profile/${profileUser.id}`)}
              className="mt-1 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg"
          >
              View Profile
          </button>
      </div>
  );

    return (
        <Layout showNav={true}>
            <Header title="Contract Details" showBack={true} />
            <div className="p-4 space-y-4 pb-40">
                {/* Produce Info */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={currentProduce.imageUrl} alt={currentProduce.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">{currentProduce.name}</h3>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contract.status)} flex-shrink-0`}>{contract.status}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-gray-700 mb-1">Produce Description</h4>
                            <p className="text-sm text-gray-600">{currentProduce.description}</p>
                        </div>
                    </div>
                </div>

                 {/* Dispute Info */}
                {contract.status === ContractStatus.DISPUTED && (
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center">
                                <ShieldAlertIcon className="w-6 h-6 text-orange-600 mr-2" />
                                <h4 className="font-bold text-orange-700 text-lg">Dispute Information</h4>
                             </div>
                             {user.role === UserRole.ADMIN && !isEditingDispute && (
                                <button 
                                    onClick={handleStartEditDispute} 
                                    className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                                    aria-label="Edit dispute"
                                >
                                    <EditIcon className="w-4 h-4 mr-1"/>
                                    Edit
                                </button>
                            )}
                        </div>
                        
                        {isEditingDispute ? (
                            <div className="space-y-2 mt-2">
                                <div>
                                    <label htmlFor="disputeFiledBy" className="text-sm font-medium text-gray-700">Filed by:</label>
                                    <input 
                                        id="disputeFiledBy"
                                        type="text" 
                                        value={editedDisputeFiledBy}
                                        onChange={(e) => setEditedDisputeFiledBy(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="disputeReason" className="text-sm font-medium text-gray-700">Reason:</label>
                                    <textarea
                                        id="disputeReason"
                                        value={editedDisputeReason}
                                        onChange={(e) => setEditedDisputeReason(e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500">Filed by: <span className="font-semibold text-gray-700">{contract.disputeFiledBy}</span></p>
                                <p className="mt-2 text-gray-700 italic">"{contract.disputeReason}"</p>
                            </>
                        )}
                        
                        {user.role === UserRole.ADMIN && (
                            <div className="mt-4 pt-4 border-t flex space-x-2">
                                {isEditingDispute ? (
                                    <>
                                        <button onClick={handleCancelEditDispute} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm">Cancel</button>
                                        <button onClick={handleSaveDispute} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm">Save Changes</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleUpdateStatus(ContractStatus.CANCELLED)} className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 text-sm">Resolve for Vendor</button>
                                        <button onClick={() => handleUpdateStatus(ContractStatus.COMPLETED)} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 text-sm">Resolve for Farmer</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Logistics Hub */}
                {contract.status !== ContractStatus.PENDING && contract.status !== ContractStatus.CANCELLED && (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <TruckIcon className="w-6 h-6 text-gray-700 mr-2" />
                                <h4 className="font-bold text-gray-800 text-lg">Logistics Hub</h4>
                            </div>
                            {!contract.logistics && user.role === UserRole.FARMER && contract.status === ContractStatus.ACTIVE && (
                                <button onClick={() => setIsScheduling(true)} className="bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700">
                                    Schedule
                                </button>
                            )}
                        </div>
                        {contract.logistics ? (
                            <div className="space-y-3 text-sm pt-2 border-t">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Partner:</span>
                                    <span className="font-semibold text-gray-800">{contract.logistics.partner}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="font-semibold text-blue-600">{contract.logistics.status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="text-center bg-gray-50 p-3 rounded-lg">
                                        <QrCodeIcon className="w-8 h-8 mx-auto text-gray-500"/>
                                        <p className="text-xs font-semibold text-gray-600 mt-1">Pickup Code</p>
                                        <p className="font-mono text-xs tracking-wider">{contract.logistics.pickupQRCode}</p>
                                    </div>
                                    <div className="text-center bg-gray-50 p-3 rounded-lg">
                                        <QrCodeIcon className="w-8 h-8 mx-auto text-gray-500"/>
                                        <p className="text-xs font-semibold text-gray-600 mt-1">Delivery Code</p>
                                        <p className="font-mono text-xs tracking-wider">{contract.logistics.deliveryQRCode}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 pt-2 border-t text-sm">Delivery not yet scheduled.</p>
                        )}
                    </div>
                )}

                {/* Participants */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                     <UserDetailCard user={farmer} />
                     <hr/>
                     <UserDetailCard user={vendor} />
                </div>
                
                {/* Contract Terms */}
                <div className="bg-white p-4 rounded-lg shadow-md text-gray-700">
                    <h4 className="font-bold text-gray-800 mb-2">Terms</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Quantity</p>
                            <p className="font-semibold text-base">{contract.quantity} kg</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Total Price</p>
                            <p className="font-semibold text-base">KES {contract.totalPrice.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Delivery Deadline</p>
                            <p className="font-semibold text-base">{contract.deliveryDeadline}</p>
                        </div>
                         {contract.paymentDate && (
                            <div>
                                <p className="text-gray-500">Payment Date</p>
                                <p className="font-semibold text-base">{contract.paymentDate}</p>
                            </div>
                         )}
                    </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                     <h4 className="font-bold text-gray-800 mb-4">Status History</h4>
                    <div className="flow-root">
                        <ul className="-mb-8">
                            {sortedStatusHistory.map((item, index, arr) => (
                                <li key={index}>
                                    <div className="relative pb-8">
                                        {index !== arr.length - 1 ? (
                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        ) : null}
                                        <div className="relative flex items-start space-x-3">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                                    <CheckCircleIcon className="h-5 w-5 text-white" />
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 pt-1.5">
                                                <div className="text-sm font-medium text-gray-800">{item.status}</div>
                                                <p className="mt-0.5 text-sm text-gray-500">{formatDate(item.timestamp)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
             {isScheduling && <ScheduleDeliveryModal contract={contract} onClose={() => setIsScheduling(false)} />}


            {/* Action Buttons */}
            <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t flex space-x-2">
                {user.role === UserRole.FARMER && contract.status === ContractStatus.PENDING && (
                    <>
                        <button onClick={() => handleUpdateStatus(ContractStatus.CANCELLED)} className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600">Decline</button>
                        <button onClick={() => handleUpdateStatus(ContractStatus.ACTIVE)} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">Accept Offer</button>
                    </>
                )}
                 {user.role === UserRole.FARMER && contract.status === ContractStatus.ACTIVE && (
                    <button onClick={() => handleUpdateStatus(ContractStatus.DELIVERY_CONFIRMED)} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Confirm Delivery</button>
                )}
                 {user.role === UserRole.VENDOR && contract.status === ContractStatus.DELIVERY_CONFIRMED && (
                    <button onClick={() => handleUpdateStatus(ContractStatus.COMPLETED)} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">Release Payment</button>
                )}
                {canFileDispute && (
                    <button onClick={handleFileDispute} className="w-1/3 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 flex items-center justify-center text-sm">
                        <ShieldAlertIcon className="w-4 h-4 mr-1" />
                        Dispute
                    </button>
                )}
                {contract.status !== ContractStatus.PENDING && (
                    <button onClick={() => navigate(`/contracts/${contract.id}/chat`)} className="w-1/3 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 flex items-center justify-center text-sm">
                        <MessageSquareIcon className="w-4 h-4 mr-1" />
                        Chat
                    </button>
                )}
                {canTrackDelivery && (
                    <button onClick={() => navigate(`/contracts/${contract.id}/track`)} className="w-1/3 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 flex items-center justify-center text-sm">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        Track
                    </button>
                )}
            </div>
        </Layout>
    );
};

const MapTrackingScreen = () => {
    const { contractId } = useParams();
    const { contracts, users } = useData();
    const contract = contracts.find(c => c.id === contractId);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + 1));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    if (!contract) {
        return <Navigate to="/contracts" replace />;
    }

    const farmer = users.find(u => u.id === contract.farmerId);
    const vendor = users.find(u => u.id === contract.vendorId);
    
    if (!farmer || !vendor || !farmer.lat || !farmer.lng || !vendor.lat || !vendor.lng) {
        return <p>Location data unavailable for tracking.</p>;
    }

    const bounds = { minLat: -5.0, maxLat: 5.0, minLng: 34.0, maxLng: 42.0 };
    const getPosition = (lat: number, lng: number) => {
        const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
        const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
        return { x, y };
    };

    const farmerPos = getPosition(farmer.lat, farmer.lng);
    const vendorPos = getPosition(vendor.lat, vendor.lng);

    const truckX = farmerPos.x + (vendorPos.x - farmerPos.x) * (progress / 100);
    const truckY = farmerPos.y + (vendorPos.y - farmerPos.y) * (progress / 100);

    return (
        <Layout showNav={false}>
            <Header title="Live Delivery Tracking" showBack={true} />
            <div className="p-4 space-y-4">
                <div className="relative w-full h-96 bg-green-100 rounded-lg shadow-md overflow-hidden">
                    <img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-5+f44-0.5(${farmer.lng},${farmer.lat},${vendor.lng},${vendor.lat})/auto/400x300?access_token=pk.eyJ1IjoiZGFuaWVsc2hlYSIsImEiOiJjanl2Z285eWUwZm8wM25udWk0YWM1dHE5In0.kVoL_2Wnx32b3n_84yweJA`} alt="Map of route" className="w-full h-full object-cover opacity-70" />
                    
                    {/* Farmer Pin */}
                    <div style={{ left: `${farmerPos.x}%`, top: `${farmerPos.y}%`, transform: 'translate(-50%, -100%)' }} className="absolute text-center">
                        <MapPinIcon className="w-8 h-8 text-green-600" />
                        <span className="text-xs font-semibold bg-white px-1 rounded">Pickup</span>
                    </div>

                    {/* Vendor Pin */}
                    <div style={{ left: `${vendorPos.x}%`, top: `${vendorPos.y}%`, transform: 'translate(-50%, -100%)' }} className="absolute text-center">
                        <MapPinIcon className="w-8 h-8 text-amber-500" />
                        <span className="text-xs font-semibold bg-white px-1 rounded">Delivery</span>
                    </div>
                    
                    {/* Truck Icon */}
                    <div style={{ left: `${truckX}%`, top: `${truckY}%`, transform: 'translate(-50%, -50%)' }} className="absolute transition-all duration-100 ease-linear">
                        <TruckIcon className="w-10 h-10 text-gray-800 bg-white rounded-full p-1 shadow-lg" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold text-gray-800 mb-2">Delivery Status</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center text-base">
                            <span className="text-gray-500">Live Status:</span>
                            <span className="font-bold text-green-600">{contract.logistics?.status || 'In Transit'}</span>
                        </div>
                         <hr className="my-2"/>
                        <p className="text-xs text-gray-500 text-center">Simulated real-time tracking from {farmer.location.split(',')[0]} to {vendor.location.split(',')[0]}.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const UserProfileScreen = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const { users } = useData();

    // If userId is present, we are viewing someone else's profile.
    // Otherwise, it's the current user's own profile.
    const profileUser = userId ? users.find(u => u.id === userId) : currentUser;

    if (!profileUser) {
        return (
            <Layout showNav={!userId}>
                <Header title="User Not Found" showBack={!!userId} />
                <div className="p-4 text-center">
                    <p>The requested user could not be found.</p>
                </div>
            </Layout>
        );
    }

    return (
      <Layout showNav={false}>
          <Header title="User Profile" showBack={true} />
          <div className="p-4 space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-24 h-24 rounded-full mx-auto" />
                  <h2 className="text-2xl font-bold text-gray-800 mt-4">{profileUser.name}</h2>
                  <p className="text-gray-500">{profileUser.email}</p>
                  <div className="mt-2 flex justify-center items-center text-gray-500">
                      <MapPinIcon className="w-4 h-4 mr-1"/>
                      <span>{profileUser.location}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-green-600 capitalize">{profileUser.role.toLowerCase()}</p>
                  <div className="mt-4 flex justify-center items-center space-x-1">
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-gray-700">{profileUser.rating}</span>
                      <span className="text-gray-500">({profileUser.reviews} reviews)</span>
                  </div>
              </div>

              {profileUser.role === UserRole.FARMER && profileUser.farmSize && (
                  <div className="bg-white rounded-xl shadow-md p-4">
                      <h3 className="font-semibold text-gray-700 mb-2 text-center">Farm Details</h3>
                      <div className="flex justify-between items-center text-sm border-t pt-2">
                          <span className="text-gray-500">Farm Size</span>
                          <span className="font-semibold text-gray-800">{profileUser.farmSize}</span>
                      </div>
                  </div>
              )}
              {profileUser.role === UserRole.VENDOR && profileUser.businessName && (
                  <div className="bg-white rounded-xl shadow-md p-4">
                      <h3 className="font-semibold text-gray-700 mb-2 text-center">Business Details</h3>
                      <div className="flex justify-between items-center text-sm border-t pt-2">
                          <span className="text-gray-500">Business Name</span>
                          <span className="font-semibold text-gray-800">{profileUser.businessName}</span>
                      </div>
                  </div>
              )}
          </div>
      </Layout>
  );
};

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    if (!user) return null;
    
    const handleLogout = () => {
        setShowLogoutConfirm(false);
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <Layout>
            <Header title="Profile" />
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <div className="mt-2 flex justify-center items-center text-gray-500">
                        <MapPinIcon className="w-4 h-4 mr-1"/>
                        <span>{user.location}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-green-600 capitalize">{user.role.toLowerCase()}</p>
                    <div className="mt-4 flex justify-center items-center space-x-1">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold text-gray-700">{user.rating}</span>
                        <span className="text-gray-500">({user.reviews} reviews)</span>
                    </div>
                </div>

                {user.role === UserRole.FARMER && user.farmSize && (
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <h3 className="font-semibold text-gray-700 mb-2 text-center">Farm Details</h3>
                        <div className="flex justify-between items-center text-sm border-t pt-2">
                            <span className="text-gray-500">Farm Size</span>
                            <span className="font-semibold text-gray-800">{user.farmSize}</span>
                        </div>
                    </div>
                )}
                {user.role === UserRole.VENDOR && user.businessName && (
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <h3 className="font-semibold text-gray-700 mb-2 text-center">Business Details</h3>
                        <div className="flex justify-between items-center text-sm border-t pt-2">
                            <span className="text-gray-500">Business Name</span>
                            <span className="font-semibold text-gray-800">{user.businessName}</span>
                        </div>
                    </div>
                )}

                <div>
                    <button 
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center justify-center bg-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                    >
                        <LogOutIcon className="w-6 h-6 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
            
            {showLogoutConfirm && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="logout-dialog-title"
                >
                    <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm">
                        <h3 id="logout-dialog-title" className="text-lg font-bold text-gray-800">Confirm Logout</h3>
                        <p className="text-gray-600 mt-2">Are you sure you want to log out?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

const TransactionModal = ({
    isOpen,
    onClose,
    onSubmit,
    action,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, phone: string) => void;
    action: 'Top-up' | 'Withdraw';
}) => {
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0 && phone.trim()) {
            setIsProcessing(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            onSubmit(numAmount, phone);
            setIsProcessing(false);
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 text-center">{action} Funds</h3>
                    <p className="text-sm text-center text-gray-500">
                      A confirmation will be sent via M-Pesa to complete the transaction.
                    </p>
                    <InputField label="Phone Number" name="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712345678" />
                    <InputField label="Amount (KES)" name="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" />
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full text-white py-3 rounded-lg font-semibold transition-colors ${action === 'Top-up' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'} disabled:bg-gray-400`}
                    >
                        {isProcessing ? 'Processing...' : `Confirm ${action}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

const WalletScreen = () => {
    const { user } = useAuth();
    const { transactions, updateUser, addTransaction } = useData();
    const { notify } = useNotifier();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'Top-up' | 'Withdraw' | null>(null);
    
    if (!user) return null;

    const userTransactions = transactions.filter(t => t.userId === user.id);

    const handleOpenModal = (action: 'Top-up' | 'Withdraw') => {
        setModalAction(action);
        setIsModalOpen(true);
    };

    const handleTransactionSubmit = (amount: number, phone: string) => {
        if (modalAction === 'Top-up') {
            const updatedUser = { ...user, walletBalance: user.walletBalance + amount };
            updateUser(updatedUser);
            addTransaction({
                id: `txn-${Date.now()}`, userId: user.id, date: new Date().toISOString(),
                type: TransactionType.TOP_UP, amount: amount, description: "M-Pesa Top-up",
            });
            notify(`KES ${amount.toLocaleString()} added to your wallet.`, "success");
        } else if (modalAction === 'Withdraw') {
             if (amount > user.walletBalance) {
                notify("Insufficient balance for this withdrawal.", "error");
                return;
            }
            const updatedUser = { ...user, walletBalance: user.walletBalance - amount };
            updateUser(updatedUser);
             addTransaction({
                id: `txn-${Date.now()}`, userId: user.id, date: new Date().toISOString(),
                type: TransactionType.WITHDRAWAL, amount: -amount, description: "M-Pesa Withdrawal",
            });
            notify(`KES ${amount.toLocaleString()} withdrawn from your wallet.`, "success");
        }
    };

    const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
        const isIncome = transaction.amount > 0;
        return (
            <li className="flex items-center justify-between py-3">
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isIncome ? <PlusIcon className="w-5 h-5 text-green-600"/> : <MinusIcon className="w-5 h-5 text-red-600"/>}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                </div>
                <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : ''}KES {Math.abs(transaction.amount).toLocaleString()}
                </p>
            </li>
        );
    };

    return (
        <Layout>
            <Header title="My Wallet" />
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">CURRENT BALANCE</p>
                    <p className="text-4xl font-bold text-gray-800 mt-2">KES {user.walletBalance.toLocaleString()}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleOpenModal('Top-up')}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Add Funds
                        </button>
                        <button
                            onClick={() => handleOpenModal('Withdraw')}
                            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="font-bold text-gray-700 mb-2">Transaction History</h3>
                    {userTransactions.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {userTransactions.map(txn => <TransactionItem key={txn.id} transaction={txn} />)}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No transactions yet.</p>
                    )}
                </div>
            </div>
            {modalAction && (
                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleTransactionSubmit}
                    action={modalAction}
                />
            )}
        </Layout>
    );
};

const ChatScreen = () => {
    const { contractId } = useParams();
    const { user } = useAuth();
    const { contracts, messages, addMessage } = useData();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const contract = contracts.find(c => c.id === contractId);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!contract || !user) {
        return <Navigate to="/contracts" />;
    }

    const contractMessages = messages.filter(m => m.contractId === contractId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const otherPartyName = user.id === contract.farmerId ? contract.vendorName : contract.farmerName;

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            contractId: contract.id,
            senderId: user.id,
            senderName: user.name,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        addMessage(message);
        setNewMessage('');
    };

    return (
        <Layout showNav={false}>
            <Header title={`Chat with ${otherPartyName}`} showBack />
            <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 64px)'}}>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {contractMessages.map(msg => {
                        const isSender = msg.senderId === user.id;
                        return (
                            <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isSender ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${isSender ? 'text-green-100' : 'text-gray-500'} text-right`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                     <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="sticky bottom-0 bg-white p-4 border-t flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button type="submit" className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </Layout>
    );
};

const MarketInsightsScreen = () => {
    const { produce, contracts, users } = useData();

    const priceData = useMemo(() => {
        const types = [...new Set(produce.map(p => p.type))];
        return types.map(type => {
            const items = produce.filter(p => p.type === type);
            const avgPrice = items.length > 0 ? items.reduce((sum, item) => sum + item.pricePerKg, 0) / items.length : 0;
            return { type, avgPrice };
        }).sort((a,b) => b.avgPrice - a.avgPrice);
    }, [produce]);
    
    const maxPrice = Math.max(...priceData.map(d => d.avgPrice), 1); // Avoid division by zero

    const popularityData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        contracts.forEach(c => {
            counts[c.produceName] = (counts[c.produceName] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 3);
    }, [contracts]);

    const regionalData = useMemo(() => {
        const counts: { [key: string]: number } = {};
        contracts.forEach(c => {
            const farmer = users.find(u => u.id === c.farmerId);
            if (farmer) {
                const region = farmer.location.split(',')[0];
                counts[region] = (counts[region] || 0) + 1;
            }
        });
        return Object.entries(counts).map(([region, count]) => ({ region, count })).sort((a, b) => b.count - a.count).slice(0, 3);
    }, [contracts, users]);

    return (
        <Layout>
            <Header title="Market Insights" />
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="font-bold text-gray-700 mb-2">Average Produce Prices (per kg)</h3>
                    <div className="space-y-2">
                        {priceData.map(({ type, avgPrice }) => (
                            <div key={type} className="flex items-center">
                                <span className="w-20 text-sm text-gray-600">{type}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-4">
                                    <div 
                                        className="bg-green-500 h-4 rounded-full text-right pr-2 text-white text-xs flex items-center justify-end"
                                        style={{ width: `${(avgPrice / maxPrice) * 100}%` }}
                                    >
                                        KES {avgPrice.toFixed(0)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <h3 className="font-bold text-gray-700 mb-2">Most Popular</h3>
                        <ul className="space-y-1 text-sm">
                            {popularityData.map(({ name, count }, i) => (
                                <li key={name} className="flex justify-between">
                                    <span>{i+1}. {name}</span>
                                    <span className="font-semibold text-gray-600">{count} deals</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-white rounded-xl shadow-md p-4">
                        <h3 className="font-bold text-gray-700 mb-2">Activity Hotspots</h3>
                        <ul className="space-y-1 text-sm">
                            {regionalData.map(({ region, count }, i) => (
                                <li key={region} className="flex justify-between">
                                    <span>{i+1}. {region}</span>
                                    <span className="font-semibold text-gray-600">{count} deals</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};


// --- MAIN APP COMPONENT --- //
const App = () => {
  return (
    <DataProvider>
        <AuthProvider>
        <NotificationProvider>
            <HashRouter>
            <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/admin/login" element={<AdminLoginScreen />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="/onboarding" element={<OnboardingScreen />} />
                <Route path="/register/farmer" element={<FarmerRegistrationScreen />} />
                <Route path="/register/vendor" element={<VendorRegistrationScreen />} />

                <Route 
                path="/dashboard" 
                element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/produce" 
                element={<ProtectedRoute><ProduceListScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/produce/new" 
                element={<ProtectedRoute><AddProduceScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/contracts" 
                element={<ProtectedRoute><ContractsScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/contracts/:contractId" 
                element={<ProtectedRoute><ContractDetailsScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/contracts/:contractId/track" 
                element={<ProtectedRoute><MapTrackingScreen /></ProtectedRoute>} 
                />
                 <Route 
                path="/contracts/:contractId/chat" 
                element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/produce/:produceId/new-contract" 
                element={<ProtectedRoute><ContractFormScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/my-produce/:produceId/new-contract" 
                element={<ProtectedRoute><FarmerContractFormScreen /></ProtectedRoute>} 
                />
                <Route 
                  path="/wallet"
                  element={<ProtectedRoute><WalletScreen /></ProtectedRoute>}
                />
                 <Route 
                  path="/insights"
                  element={<ProtectedRoute><MarketInsightsScreen /></ProtectedRoute>}
                />
                <Route 
                path="/profile" 
                element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} 
                />
                <Route 
                path="/profile/:userId" 
                element={<ProtectedRoute><UserProfileScreen /></ProtectedRoute>} 
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            </HashRouter>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
        </NotificationProvider>
        </AuthProvider>
    </DataProvider>
  );
};

export default App;