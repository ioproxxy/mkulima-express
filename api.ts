import { supabase } from './supabaseClient';
import { User, Produce, Contract, Transaction, Message } from './types';
import { mockUsers, mockProduce, mockContracts, mockTransactions, mockMessages } from './constants';

// --- SUPABASE API --- //

// Helper to log errors
const logError = (context: string, error: any) => {
    console.error(`Error in ${context}:`, JSON.stringify(error, null, 2));
};

// --- MAPPERS --- //

// User Mappers
const mapUserToDB = (u: User) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    rating: u.rating,
    reviews: u.reviews,
    location: u.location,
    avatar_url: u.avatarUrl,
    wallet_balance: u.walletBalance,
    lat: u.lat,
    lng: u.lng,
    farm_size: u.farmSize,
    business_name: u.businessName
});

const mapUserFromDB = (data: any): User => ({
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    rating: data.rating,
    reviews: data.reviews,
    location: data.location,
    avatarUrl: data.avatar_url,
    walletBalance: data.wallet_balance,
    lat: data.lat,
    lng: data.lng,
    farmSize: data.farm_size,
    businessName: data.business_name
});

// Produce Mappers
const mapProduceToDB = (p: Produce) => ({
    id: p.id,
    farmer_id: p.farmerId,
    farmer_name: p.farmerName,
    name: p.name,
    type: p.type,
    quantity: p.quantity,
    price_per_kg: p.pricePerKg,
    location: p.location,
    image_url: p.imageUrl,
    description: p.description,
    harvest_date: p.harvestDate
});

const mapProduceFromDB = (data: any): Produce => ({
    id: data.id,
    farmerId: data.farmer_id,
    farmerName: data.farmer_name,
    name: data.name,
    type: data.type,
    quantity: data.quantity,
    pricePerKg: data.price_per_kg,
    location: data.location,
    imageUrl: data.image_url,
    description: data.description,
    harvestDate: data.harvest_date
});

// Contract Mappers
const mapContractToDB = (c: Contract) => {
    // WORKAROUND: Schema does not have created_by column, store in logistics JSONB
    const logisticsPayload = {
        ...(c.logistics || {}),
        created_by_user_id: c.createdBy
    };

    return {
        id: c.id,
        produce_id: c.produceId,
        produce_name: c.produceName,
        farmer_id: c.farmerId,
        vendor_id: c.vendorId,
        farmer_name: c.farmerName,
        vendor_name: c.vendorName,
        quantity: c.quantity,
        total_price: c.totalPrice,
        delivery_deadline: c.deliveryDeadline,
        payment_date: c.paymentDate,
        status: c.status,
        status_history: c.statusHistory,
        dispute_reason: c.disputeReason,
        dispute_filed_by: c.disputeFiledBy,
        logistics: logisticsPayload, // Store createdBy here
    };
};

const mapContractFromDB = (data: any): Contract => ({
    id: data.id,
    produceId: data.produce_id,
    produceName: data.produce_name,
    farmerId: data.farmer_id,
    vendorId: data.vendor_id,
    farmerName: data.farmer_name,
    vendorName: data.vendor_name,
    quantity: data.quantity,
    totalPrice: data.total_price,
    deliveryDeadline: data.delivery_deadline,
    paymentDate: data.payment_date,
    status: data.status,
    statusHistory: data.status_history || [],
    disputeReason: data.dispute_reason,
    disputeFiledBy: data.dispute_filed_by,
    logistics: data.logistics,
    // Read createdBy from logistics if not in top level column
    createdBy: data.created_by || data.logistics?.created_by_user_id || '' 
});

// Transaction Mappers
const mapTransactionToDB = (t: Transaction) => ({
    id: t.id,
    user_id: t.userId,
    type: t.type,
    amount: t.amount,
    description: t.description,
    date: t.date,
    // related_contract_id: t.relatedContractId // Schema does not have this column, removing to prevent error
});

const mapTransactionFromDB = (data: any): Transaction => ({
    id: data.id,
    userId: data.user_id,
    type: data.type,
    amount: data.amount,
    description: data.description,
    date: data.date,
    relatedContractId: undefined // Not available in this schema
});

// Message Mappers
const mapMessageToDB = (m: Message) => ({
    id: m.id,
    contract_id: m.contractId,
    sender_id: m.senderId,
    sender_name: m.senderName,
    text: m.text,
    timestamp: m.timestamp
});

const mapMessageFromDB = (data: any): Message => ({
    id: data.id,
    contractId: data.contract_id,
    senderId: data.sender_id,
    senderName: data.sender_name,
    text: data.text,
    timestamp: data.timestamp
});


// --- Users --- //
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            logError('fetchUsers', error);
            return Object.values(mockUsers);
        }
        return (data || []).map(mapUserFromDB);
    } catch (err) {
        logError('fetchUsers', err);
        return Object.values(mockUsers);
    }
};

export const updateUser = async (updatedUser: User): Promise<User> => {
    try {
        const dbUser = mapUserToDB(updatedUser);
        const { data, error } = await supabase
            .from('users')
            .update(dbUser)
            .eq('id', updatedUser.id)
            .select()
            .single();
        
        if (error) {
            logError('updateUser', error);
            return updatedUser; // Fallback
        }
        return mapUserFromDB(data);
    } catch (err) {
        logError('updateUser', err);
        return updatedUser;
    }
};

export const addUser = async (newUser: User): Promise<User> => {
    try {
        const dbUser = mapUserToDB(newUser);
        const { data, error } = await supabase
            .from('users')
            .insert(dbUser)
            .select()
            .single();

        if (error) {
            logError('addUser', error);
            return newUser; // Fallback
        }
        return mapUserFromDB(data);
    } catch (err) {
        logError('addUser', err);
        return newUser;
    }
};

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            logError('fetchUserProfile', error);
            return null;
        }
        return data ? mapUserFromDB(data) : null;
    } catch (err) {
        logError('fetchUserProfile', err);
        return null;
    }
};


// --- Produce --- //
export const fetchProduce = async (): Promise<Produce[]> => {
    try {
        const { data, error } = await supabase
            .from('produce')
            .select('*')
            .order('harvest_date', { ascending: false }); 
        
        if (error) {
            logError('fetchProduce', error);
            return mockProduce;
        }
        return (data || []).map(mapProduceFromDB);
    } catch (err) {
        logError('fetchProduce', err);
        return mockProduce;
    }
};

export const addProduce = async (newProduce: Produce): Promise<Produce> => {
    try {
        const dbProduce = mapProduceToDB(newProduce);
        const { data, error } = await supabase
            .from('produce')
            .insert(dbProduce)
            .select()
            .single();

        if (error) {
            logError('addProduce', error);
            return newProduce; // Fallback
        }
        return mapProduceFromDB(data);
    } catch (err) {
        logError('addProduce', err);
        return newProduce;
    }
}

// --- Contracts --- //
export const fetchContracts = async (): Promise<Contract[]> => {
    try {
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .order('delivery_deadline', { ascending: true });
        
        if (error) {
            logError('fetchContracts', error);
            return mockContracts;
        }
        return (data || []).map(mapContractFromDB);
    } catch (err) {
        logError('fetchContracts', err);
        return mockContracts;
    }
};

export const updateContract = async (updatedContract: Contract): Promise<Contract> => {
    try {
        const dbContract = mapContractToDB(updatedContract);
        const { data, error } = await supabase
            .from('contracts')
            .update(dbContract)
            .eq('id', updatedContract.id)
            .select()
            .single();

        if (error) {
            logError('updateContract', error);
            return updatedContract; // Fallback
        }
        return mapContractFromDB(data);
    } catch (err) {
        logError('updateContract', err);
        return updatedContract;
    }
};

export const addContract = async (newContract: Contract): Promise<Contract> => {
    try {
        const dbContract = mapContractToDB(newContract);
        const { data, error } = await supabase
            .from('contracts')
            .insert(dbContract)
            .select()
            .single();

        if (error) {
            logError('addContract', error);
            return newContract; // Fallback
        }
        return mapContractFromDB(data);
    } catch (err) {
        logError('addContract', err);
        return newContract;
    }
};

// --- Transactions --- //
export const fetchTransactions = async (): Promise<Transaction[]> => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            logError('fetchTransactions', error);
            return mockTransactions;
        }
        return (data || []).map(mapTransactionFromDB);
    } catch (err) {
        logError('fetchTransactions', err);
        return mockTransactions;
    }
};

export const addTransaction = async (newTransaction: Transaction): Promise<Transaction> => {
    try {
        const dbTransaction = mapTransactionToDB(newTransaction);
        const { data, error } = await supabase
            .from('transactions')
            .insert(dbTransaction)
            .select()
            .single();

        if (error) {
            logError('addTransaction', error);
            return newTransaction; // Fallback
        }
        return mapTransactionFromDB(data);
    } catch (err) {
        logError('addTransaction', err);
        return newTransaction;
    }
};

// --- Messages --- //
export const fetchMessages = async (): Promise<Message[]> => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: true });

        if (error) {
            logError('fetchMessages', error);
            return mockMessages;
        }
        return (data || []).map(mapMessageFromDB);
    } catch (err) {
        logError('fetchMessages', err);
        return mockMessages;
    }
};

export const addMessage = async (newMessage: Message): Promise<Message> => {
    try {
        const dbMessage = mapMessageToDB(newMessage);
        const { data, error } = await supabase
            .from('messages')
            .insert(dbMessage)
            .select()
            .single();

        if (error) {
            logError('addMessage', error);
            return newMessage; // Fallback
        }
        return mapMessageFromDB(data);
    } catch (err) {
        logError('addMessage', err);
        return newMessage;
    }
};