-- Supabase Database Schema for Mkulima Express
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('FARMER', 'VENDOR', 'ADMIN')),
  location TEXT NOT NULL,
  farm_size TEXT,
  business_name TEXT,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  avatar_url TEXT,
  wallet_balance NUMERIC DEFAULT 0,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produce table
CREATE TABLE IF NOT EXISTS produce (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  harvest_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produce_id UUID REFERENCES produce(id) ON DELETE CASCADE,
  produce_name TEXT NOT NULL,
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  delivery_deadline DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ACTIVE', 'DELIVERY_CONFIRMED', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'PAYMENT_RELEASED')),
  status_history JSONB DEFAULT '[]'::jsonb,
  payment_date DATE,
  dispute_reason TEXT,
  dispute_filed_by TEXT,
  logistics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('TOP_UP', 'WITHDRAWAL', 'PAYMENT_SENT', 'PAYMENT_RECEIVED')),
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_produce_farmer_id ON produce(farmer_id);
CREATE INDEX idx_contracts_farmer_id ON contracts(farmer_id);
CREATE INDEX idx_contracts_vendor_id ON contracts(vendor_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_messages_contract_id ON messages(contract_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies: Anyone can read, users can update their own record
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own record" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Produce policies: Anyone can read, farmers can manage their own
CREATE POLICY "Produce is viewable by everyone" ON produce FOR SELECT USING (true);
CREATE POLICY "Farmers can insert own produce" ON produce FOR INSERT WITH CHECK (
  farmer_id = auth.uid()
);
CREATE POLICY "Farmers can update own produce" ON produce FOR UPDATE USING (farmer_id = auth.uid());
CREATE POLICY "Farmers can delete own produce" ON produce FOR DELETE USING (farmer_id = auth.uid());

-- Contracts policies: Parties can view and manage contracts they're part of
CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT USING (
  farmer_id = auth.uid() OR vendor_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Users can insert contracts" ON contracts FOR INSERT WITH CHECK (
  farmer_id = auth.uid() OR vendor_id = auth.uid()
);
CREATE POLICY "Contract parties can update" ON contracts FOR UPDATE USING (
  farmer_id = auth.uid() OR vendor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Transactions policies: Users can view and create their own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());

-- Messages policies: Contract parties can view and send
CREATE POLICY "Contract parties can view messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM contracts 
    WHERE id = contract_id AND (farmer_id = auth.uid() OR vendor_id = auth.uid())
  )
);
CREATE POLICY "Contract parties can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM contracts 
    WHERE id = contract_id AND (farmer_id = auth.uid() OR vendor_id = auth.uid())
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produce_updated_at BEFORE UPDATE ON produce
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo admin user (password will be set via Supabase Auth)
INSERT INTO users (id, email, name, role, location, rating, reviews, avatar_url, wallet_balance)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@mkulima.express',
  'Administrator',
  'ADMIN',
  'Nairobi, Kenya',
  5.0,
  0,
  'https://picsum.photos/seed/admin/200',
  0
) ON CONFLICT (id) DO NOTHING;
