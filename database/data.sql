-- === Extensions utiles ===
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- === 1. Utilisateurs ===
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_phone ON users(phone);

-- === 2. Comptes (compte principal REELCarte pour chaque user) ===
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(18,2) DEFAULT 0 CHECK (balance >= 0), -- solde disponible sur compte principal
  currency CHAR(3) DEFAULT 'XAF',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX ux_accounts_user ON accounts(user_id);

-- === 3. Types de cartes ===
CREATE TABLE card_types (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- e.g. 'POINTAGE', 'EPARGNE', 'OFFRANT'
  label TEXT NOT NULL,
  description TEXT,
  min_deposit NUMERIC(18,2) DEFAULT 100.00
);

INSERT INTO card_types (code, label, description, min_deposit)
VALUES
 ('POINTAGE','Carte de Pointage','Carte à 30 cases','100'),
 ('EPARGNE','Carte Epargne','Carte d’épargne flexible','100'),
 ('OFFRANT','Carte Offrant','Carte pour offrir/paiements fractionnés','100');

-- === 4. Cartes créées par les clients ===
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_type_id INT NOT NULL REFERENCES card_types(id),
  name TEXT, -- nom personnalisé
  target_amount NUMERIC(18,2) DEFAULT 0, -- montant final visé (pour épargne/offrant)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE,
  interrupted_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_cards_user ON cards(user_id);

-- === 4b. Spécifique : cases pour Carte de Pointage (30 cases) ===
CREATE TABLE card_pointages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  case_number INT NOT NULL CHECK (case_number >= 1 AND case_number <= 30),
  amount NUMERIC(18,2) NOT NULL DEFAULT 0,
  paid_at TIMESTAMPTZ NULL,
  UNIQUE (card_id, case_number)
);

-- === 5. Moyens de paiement (ex: Mobile Money) ===
CREATE TABLE payment_providers (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'MTN', 'AIRTEL', 'MOMO', 'CARD'
  label TEXT
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  provider_id INT REFERENCES payment_providers(id),
  external_reference TEXT, -- ref du fournisseur (transaction id)
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  fee NUMERIC(18,2) DEFAULT 0, -- éventuels frais du provider
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, FAILED
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- === 6. Transactions génériques (caisse interne) ===
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id),
  card_id UUID REFERENCES cards(id),
  type TEXT NOT NULL, -- DEPOSIT, TRANSFER_TO_CARD, WITHDRAW_REQUEST, WITHDRAW_COMPLETE, COMMISSION, REFUND
  amount NUMERIC(18,2) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tx_account ON transactions(account_id);
CREATE INDEX idx_tx_card ON transactions(card_id);

-- === 7. Commission (10%) enregistrée par opération ===
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  rate NUMERIC(6,4) NOT NULL, -- 0.10
  amount NUMERIC(18,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- === 8. Demandes de retrait (24h délai) ===
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  card_id UUID REFERENCES cards(id),
  account_id UUID REFERENCES accounts(id),
  requested_amount NUMERIC(18,2) NOT NULL CHECK (requested_amount > 0),
  commission_amount NUMERIC(18,2) NOT NULL,
  total_amount NUMERIC(18,2) NOT NULL, -- requested + commission (ou selon règle)
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, READY (after 24h), COMPLETED, CANCELLED, FAILED
  requested_at TIMESTAMPTZ DEFAULT now(),
  ready_at TIMESTAMPTZ NULL, -- set when 24h passed
  completed_at TIMESTAMPTZ NULL,
  processed_by UUID NULL -- admin who processed
);

CREATE INDEX idx_withdrawals_user ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- === 9. Notifications (email/SMS backlog) ===
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  channel TEXT NOT NULL, -- 'EMAIL','SMS'
  content TEXT,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ NULL
);

-- === 10. Audit/logs simples ===
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NULL REFERENCES users(id),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- === 11. Admins / roles (backoffice) ===
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'OPER'
);

-- === Triggers to update updated_at ===
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER accounts_set_updated_at BEFORE UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER cards_set_updated_at BEFORE UPDATE ON cards
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- === Fonctions transactionnelles : dépôt vers compte principal (confirmé) ===

-- 1) Effectuer un dépôt confirmé (ex: provider confirme)
CREATE OR REPLACE FUNCTION deposit_confirm(payment_id UUID) RETURNS VOID AS $$
DECLARE
  p payments%ROWTYPE;
  acc accounts%ROWTYPE;
  tx_id UUID;
  comm_amount NUMERIC(18,2);
  commission_rate NUMERIC := 0.10;
BEGIN
  SELECT * INTO p FROM payments WHERE id = payment_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found';
  END IF;
  IF p.status = 'CONFIRMED' THEN
    RAISE NOTICE 'Payment already confirmed';
    RETURN;
  END IF;

  -- lock account
  SELECT * INTO acc FROM accounts WHERE id = p.account_id FOR UPDATE;
  -- create transaction record (DEPOSIT to account)
  tx_id := uuid_generate_v4();
  INSERT INTO transactions(id, account_id, type, amount, metadata, created_at)
    VALUES (tx_id, p.account_id, 'DEPOSIT', p.amount, jsonb_build_object('payment_id', p.id), now());

  -- update account balance
  UPDATE accounts SET balance = balance + p.amount, updated_at = now() WHERE id = p.account_id;

  -- update payment
  UPDATE payments SET status = 'CONFIRMED', updated_at = now() WHERE id = p.id;

  -- Note: deposit to account does not apply REELCarte 10% commission yet.
  -- Commission is applied when user transfers from account to a card (see transfer_to_card)
END;
$$ LANGUAGE plpgsql;

-- 2) Transferer depuis compte principal vers une carte (applique commission 10%)
-- params: account_id, card_id, desired_deposit_amount (montant que client veut créditer sur la carte)
CREATE OR REPLACE FUNCTION transfer_to_card(p_account_id UUID, p_card_id UUID, p_desired_amount NUMERIC) RETURNS VOID AS $$
DECLARE
  acc accounts%ROWTYPE;
  cd cards%ROWTYPE;
  tx_id UUID;
  commission_rate NUMERIC := 0.10;
  commission_amt NUMERIC(18,2);
  total_charge NUMERIC(18,2);
BEGIN
  IF p_desired_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be > 0';
  END IF;

  SELECT * INTO acc FROM accounts WHERE id = p_account_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found';
  END IF;

  SELECT * INTO cd FROM cards WHERE id = p_card_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Card not found';
  END IF;

  commission_amt := round(p_desired_amount * commission_rate, 2);
  total_charge := p_desired_amount + commission_amt;

  IF acc.balance < total_charge THEN
    RAISE EXCEPTION 'Insufficient funds. Require % - available %', total_charge, acc.balance;
  END IF;

  -- debit account
  UPDATE accounts SET balance = balance - total_charge, updated_at = now() WHERE id = acc.id;

  -- create transaction for transfer_to_card
  tx_id := uuid_generate_v4();
  INSERT INTO transactions(id, account_id, card_id, type, amount, metadata, created_at)
    VALUES (tx_id, acc.id, cd.id, 'TRANSFER_TO_CARD', p_desired_amount, jsonb_build_object('commission', commission_amt), now());

  -- record commission
  INSERT INTO commissions(id, transaction_id, rate, amount, created_at)
    VALUES (uuid_generate_v4(), tx_id, commission_rate, commission_amt, now());

  -- For Card de pointage: if card_type = POINTAGE, insert into next available case
  IF (SELECT code FROM card_types WHERE id = cd.card_type_id) = 'POINTAGE' THEN
    -- find first unpaid case
    INSERT INTO card_pointages(id, card_id, case_number, amount, paid_at)
    SELECT uuid_generate_v4(), cd.id, n, p_desired_amount, now()
    FROM generate_series(1,30) AS n
    WHERE NOT EXISTS (
      SELECT 1 FROM card_pointages cp WHERE cp.card_id = cd.id AND cp.case_number = n
    )
    ORDER BY n
    LIMIT 1;
  ELSE
    -- for EPARGNE/OFFRANT: store an entry in transactions; the card balance is derived from transactions
    -- optional: track card balance materialized via sum(transactions)
    NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 3) Request withdrawal from a card (start 24h delay). withdrawal.total_amount = requested_amount - commission?
-- Business rule in description: "Le client a la possibilité d’interrompre la carte ... argent disponible sur compte principal qu’après 24 heures".
-- We'll charge commission on deposit; on withdrawal we transfer card funds back to account without commission (or if business requires, you can apply commission again). Here we assume no extra commission on withdrawal.
CREATE OR REPLACE FUNCTION request_withdrawal(p_user_id UUID, p_card_id UUID, p_requested_amount NUMERIC) RETURNS UUID AS $$
DECLARE
  cd cards%ROWTYPE;
  acc accounts%ROWTYPE;
  w_id UUID := uuid_generate_v4();
  commission_rate NUMERIC := 0.10;
  commission_amt NUMERIC;
  total_amt NUMERIC;
BEGIN
  SELECT * INTO cd FROM cards WHERE id = p_card_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Card not found';
  END IF;
  IF cd.user_id <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO acc FROM accounts WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found';
  END IF;

  -- compute commission on withdrawal if needed. Here we set commission 0 (only charged on deposits).
  commission_amt := 0;
  total_amt := p_requested_amount - commission_amt;
  IF total_amt < 0 THEN
    RAISE EXCEPTION 'Invalid amounts';
  END IF;

  INSERT INTO withdrawals(id, user_id, card_id, account_id, requested_amount, commission_amount, total_amount, status, requested_at)
  VALUES (w_id, p_user_id, p_card_id, acc.id, p_requested_amount, commission_amt, total_amt, 'PENDING', now());

  RETURN w_id;
END;
$$ LANGUAGE plpgsql;

-- 4) Worker function to mark withdrawals ready after 24h and optionally complete them
CREATE OR REPLACE FUNCTION process_pending_withdrawals(mark_ready_only BOOLEAN DEFAULT TRUE) RETURNS VOID AS $$
DECLARE
  rec RECORD;
BEGIN
  -- Mark PENDING withdrawals older than 24h as READY
  FOR rec IN
    SELECT * FROM withdrawals WHERE status = 'PENDING' AND requested_at <= now() - INTERVAL '24 hours'
  LOOP
    UPDATE withdrawals SET status = 'READY', ready_at = now() WHERE id = rec.id;
  END LOOP;

  IF NOT mark_ready_only THEN
    -- Complete READY withdrawals (this step should be done carefully: process payments to user via provider)
    FOR rec IN
      SELECT * FROM withdrawals WHERE status = 'READY'
    LOOP
      -- 1) credit account balance
      UPDATE accounts SET balance = balance + rec.total_amount, updated_at = now() WHERE id = rec.account_id;

      -- 2) insert transaction record
      INSERT INTO transactions(id, account_id, card_id, type, amount, metadata, created_at)
      VALUES (uuid_generate_v4(), rec.account_id, rec.card_id, 'WITHDRAW_COMPLETE', rec.total_amount, jsonb_build_object('withdrawal_id', rec.id), now());

      -- 3) set completed
      UPDATE withdrawals SET status = 'COMPLETED', completed_at = now() WHERE id = rec.id;
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- === Example helper: calc card balance (materialized via view) ===
CREATE OR REPLACE VIEW card_balances AS
SELECT c.id AS card_id,
       c.user_id,
       c.card_type_id,
       COALESCE(
         (SELECT SUM(t.amount) FROM transactions t WHERE t.card_id = c.id AND t.type IN ('TRANSFER_TO_CARD','DEPOSIT_CARD')), 0
       ) - COALESCE(
         (SELECT SUM(w.requested_amount) FROM withdrawals w WHERE w.card_id = c.id AND w.status IN ('PENDING','READY','COMPLETED')), 0
       ) AS balance
FROM cards c;

