import { supabase } from './supabaseClient';
import { User, Produce, Contract, Transaction, Message } from './types';

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
    name: data.name || '',
    email: data.email || '',
    role: data.role || 'FARMER',
    rating: data.rating || 0,
    reviews: data.reviews || 0,
    location: data.location || '',
    avatarUrl: data.avatar_url || '',
    walletBalance: data.wallet_balance || 0,
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
    farmerName: data.farmer_name || '',
    name: data.name || '',
    type: data.type || '',
    quantity: data.quantity || 0,
    pricePerKg: data.price_per_kg || 0,
    location: data.location || '',
    imageUrl: data.image_url || '',
    description: data.description || '',
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
        logistics: logisticsPayload, 
    };
};

const mapContractFromDB = (data: any): Contract => ({
    id: data.id,
    produceId: data.produce_id,
    produceName: data.produce_name || '',
    farmerId: data.farmer_id,
    vendorId: data.vendor_id,
    farmerName: data.farmer_name || '',
    vendorName: data.vendor_name || '',
    quantity: data.quantity || 0,
    totalPrice: data.total_price || 0,
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
});

const mapTransactionFromDB = (data: any): Transaction => ({
    id: data.id,
    userId: data.user_id,
    type: data.type,
    amount: data.amount,
    description: data.description || '',
    date: data.date,
    relatedContractId: undefined 
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
    senderName: data.sender_name || '',
    text: data.text || '',
    timestamp: data.timestamp
});


// --- Users --- //
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            logError('fetchUsers', error);
            return [];
        }
        return (data || []).map(mapUserFromDB);
    } catch (err) {
        logError('fetchUsers', err);
        return [];
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
        return mapUserFromDB(data);
    } catch (err) {
        logError('fetchUserProfile', err);
        return null;
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
            throw error;
        }
        return mapUserFromDB(data);
    } catch (err) {
        logError('updateUser', err);
        throw err;
    }
};

export const addUser = async (newUser: User): Promise<User> => {
    try {
        // We MUST keep the ID for users as it matches Auth ID
        const dbUser = mapUserToDB(newUser);
        const { data, error } = await supabase
            .from('users')
            .insert(dbUser)
            .select()
            .single();

        if (error) {
            logError('addUser', error);
            throw error;
        }
        return mapUserFromDB(data);
    } catch (err) {
        logError('addUser', err);
        throw err;
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
            return [];
        }
        return (data || []).map(mapProduceFromDB);
    } catch (err) {
        logError('fetchProduce', err);
        return [];
    }
};

export const addProduce = async (newProduce: Produce): Promise<Produce> => {
    try {
        // Ensure authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("You must be logged in to add produce.");

        // Fetch profile to confirm role & name freshness (avoid stale client state causing RLS failure)
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, name, role, location')
            .eq('id', user.id)
            .single();
        if (profileError || !profile) throw new Error("User profile not found. Please re-login.");
        if (profile.role !== 'FARMER') throw new Error("Only FARMER accounts can list produce.");

        const dbProduce = mapProduceToDB(newProduce);

        // Force authoritative fields from profile (prevents mismatches triggering policy failures)
        dbProduce.farmer_id = profile.id;
        dbProduce.farmer_name = profile.name || newProduce.farmerName;
        dbProduce.location = profile.location || newProduce.location;

        // Let DB generate id
        const { id, ...produceData } = dbProduce;
        const { data, error } = await supabase
            .from('produce')
            .insert(produceData)
            .select()
            .single();

        if (error) {
            // Provide clearer message for RLS violations
            if ((error as any).code === '42501') {
                throw new Error("Permission denied by Row Level Security. Ensure you are logged in as a FARMER.");
            }
            logError('addProduce', error);
            throw error;
        }
        return mapProduceFromDB(data);
    } catch (err: any) {
        logError('addProduce', err);
        if (err.message?.includes('row-level security')) {
            throw new Error("Unable to list produce: your account is not authorized (must be FARMER)." );
        }
        throw err;
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
            return [];
        }
        return (data || []).map(mapContractFromDB);
    } catch (err) {
        logError('fetchContracts', err);
        return [];
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
            throw error;
        }
        return mapContractFromDB(data);
    } catch (err) {
        logError('updateContract', err);
        throw err;
    }
};

export const addContract = async (newContract: Contract): Promise<Contract> => {
    try {
        // Exclude 'id' to let DB generate it via default uuid_generate_v4()
        const { id, ...contractData } = mapContractToDB(newContract);
        const { data, error } = await supabase
            .from('contracts')
            .insert(contractData)
            .select()
            .single();

        if (error) {
            logError('addContract', error);
            throw error;
        }
        return mapContractFromDB(data);
    } catch (err) {
        logError('addContract', err);
        throw err;
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
            return [];
        }
        return (data || []).map(mapTransactionFromDB);
    } catch (err) {
        logError('fetchTransactions', err);
        return [];
    }
};

export const addTransaction = async (newTransaction: Transaction): Promise<Transaction> => {
    try {
        // Exclude 'id' to let DB generate it via default uuid_generate_v4()
        const { id, ...transactionData } = mapTransactionToDB(newTransaction);
        const { data, error } = await supabase
            .from('transactions')
            .insert(transactionData)
            .select()
            .single();

        if (error) {
            logError('addTransaction', error);
            throw error;
        }
        return mapTransactionFromDB(data);
    } catch (err) {
        logError('addTransaction', err);
        throw err;
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
            return [];
        }
        return (data || []).map(mapMessageFromDB);
    } catch (err) {
        logError('fetchMessages', err);
        return [];
    }
};

export const addMessage = async (newMessage: Message): Promise<Message> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User must be authenticated to send messages");

         // Exclude 'id' to let DB generate it via default uuid_generate_v4()
        const dbMessage = mapMessageToDB(newMessage);
        
        // Strictly override sender_id
        dbMessage.sender_id = user.id;
        
        const { id, ...messageData } = dbMessage;

        const { data, error } = await supabase
            .from('messages')
            .insert(messageData)
            .select()
            .single();

        if (error) {
            logError('addMessage', error);
            throw error;
        }
        return mapMessageFromDB(data);
    } catch (err) {
        logError('addMessage', err);
        throw err;
    }
};
