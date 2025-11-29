// Supabase integration utilities and helpers
import { supabase } from './supabaseClient';

// Helper to convert snake_case to camelCase
export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

// Helper to convert camelCase to snake_case
export const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

// Initialize auth session and sync with profile
export const initAuthSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const email = session.user.email?.toLowerCase();
  if (!email) return null;
  
  // Try to get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  return profile ? toCamelCase(profile) : null;
};

// Send OTP to email
export const sendOTP = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  
  if (error) throw error;
  localStorage.setItem('pendingEmail', email);
  return true;
};

// Verify OTP
export const verifyOTP = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  
  if (error) throw error;
  localStorage.removeItem('pendingEmail');
  
  // Get user profile after verification
  const profile = await initAuthSession();
  return { session: data.session, profile };
};

// Sign out
export const signOut = async () => {
  await supabase.auth.signOut();
};

// Database operations with camelCase conversion
export const dbOperations = {
  // Users
  async getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async createUser(user: any) {
    const { data, error } = await supabase
      .from('users')
      .insert(toSnakeCase(user))
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async updateUser(user: any) {
    const { data, error } = await supabase
      .from('users')
      .upsert(toSnakeCase(user))
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async deleteUser(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },
  
  // Produce
  async getProduce() {
    const { data, error } = await supabase.from('produce').select('*');
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async createProduce(produce: any) {
    // Build payload explicitly to satisfy RLS and snake_case naming.
    // Do NOT send client-generated id; let DB default generate.
    const { data: authData } = await supabase.auth.getUser();
    const authUid = authData?.user?.id;

    const payload = {
      farmer_id: authUid, // must match auth.uid() for RLS
      farmer_name: produce.farmerName,
      name: produce.name,
      type: produce.type,
      quantity: produce.quantity,
      price_per_kg: produce.pricePerKg,
      location: produce.location,
      image_url: produce.imageUrl || '',
      description: produce.description,
      harvest_date: produce.harvestDate,
    };

    const { data, error } = await supabase
      .from('produce')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async updateProduce(produce: any) {
    const { data, error } = await supabase
      .from('produce')
      .upsert(toSnakeCase(produce))
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  // Contracts
  async getContracts() {
    const { data, error } = await supabase.from('contracts').select('*');
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async createContract(contract: any) {
    const { data, error } = await supabase
      .from('contracts')
      .insert(toSnakeCase(contract))
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async updateContract(contract: any) {
    const { data, error } = await supabase
      .from('contracts')
      .upsert(toSnakeCase(contract))
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  // Transactions
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async createTransaction(transaction: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(toSnakeCase(transaction))
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
  
  // Messages
  async getMessages() {
    const { data, error } = await supabase.from('messages').select('*');
    if (error) throw error;
    return toCamelCase(data);
  },
  
  async createMessage(message: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert(toSnakeCase(message))
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data);
  },
};

// Realtime subscription helper
export const subscribeToMessages = (callback: (message: any) => void) => {
  const channel = supabase
    .channel('realtime:messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        callback(toCamelCase(payload.new));
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

// Subscribe to auth changes
export const subscribeToAuthChanges = (callback: (session: any) => void) => {
  const { data: subscription } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      if (session) {
        const profile = await initAuthSession();
        callback({ session, profile });
      } else {
        callback({ session: null, profile: null });
      }
    }
  );
  
  return () => {
    subscription.subscription.unsubscribe();
  };
};
