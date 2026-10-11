-- ============================================
-- Faktura Database Schema
-- ============================================

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. PROFILES
-- ============================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. COMPANIES
-- ============================================
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name text NOT NULL DEFAULT '',
  nif text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  sector text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  billing_email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  legal_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own company" ON companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own company" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own company" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. REGIONAL SETTINGS
-- ============================================
CREATE TABLE regional_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  country text NOT NULL DEFAULT 'Togo',
  tva_rate numeric NOT NULL DEFAULT 18,
  currency text NOT NULL DEFAULT 'FCFA (XOF)',
  invoice_prefix text NOT NULL DEFAULT 'FAK',
  payment_delay text NOT NULL DEFAULT '30 jours',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE regional_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own regional" ON regional_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own regional" ON regional_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own regional" ON regional_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER regional_settings_updated_at BEFORE UPDATE ON regional_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 4. CLIENTS
-- ============================================
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. INVOICES
-- ============================================
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  number text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('paid','sent','draft','overdue')),
  issue_date date NOT NULL,
  due_date date NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON invoices FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. INVOICE LINES
-- ============================================
CREATE TABLE invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoice lines" ON invoice_lines
  FOR SELECT USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_lines.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can insert own invoice lines" ON invoice_lines
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_lines.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can update own invoice lines" ON invoice_lines
  FOR UPDATE USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_lines.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can delete own invoice lines" ON invoice_lines
  FOR DELETE USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_lines.invoice_id AND invoices.user_id = auth.uid()));

-- ============================================
-- 7. TRANSACTIONS
-- ============================================
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('income','expense')),
  category text NOT NULL DEFAULT '',
  date date NOT NULL,
  client_name text,
  invoice_number text,
  payment_method text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 8. WALLET ACCOUNTS
-- ============================================
CREATE TABLE wallet_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  bank text NOT NULL,
  balance numeric NOT NULL DEFAULT 0,
  account_number text NOT NULL,
  type text NOT NULL CHECK (type IN ('checking','savings')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wallet" ON wallet_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON wallet_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON wallet_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallet" ON wallet_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER wallet_accounts_updated_at BEFORE UPDATE ON wallet_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 9. AUTO-CREATE USER SETTINGS ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.email, ''),
    '',
    ''
  );

  INSERT INTO public.companies (user_id, name, nif, address, sector, website, billing_email, phone, legal_text)
  VALUES (NEW.id, '', '', '', '', '', '', '', '');

  INSERT INTO public.regional_settings (user_id, country, tva_rate, currency, invoice_prefix, payment_delay)
  VALUES (NEW.id, 'Togo', 18, 'FCFA (XOF)', 'FAK', '30 jours');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
