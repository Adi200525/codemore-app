-- Supabase SQL Editor'da bir marta ishga tushiring.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  category text not null default 'code',
  price_cents integer not null check (price_cents >= 0),
  cover_url text,
  file_path text,            -- 'products' storage bucket ichidagi yo'l
  tags text[] default '{}',
  formats text,
  license text default 'commercial',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  stripe_session_id text,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists subscriptions (
  id text primary key,       -- Stripe subscription id
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null,
  plan text,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false
);

alter table profiles enable row level security;
alter table products enable row level security;
alter table purchases enable row level security;
alter table subscriptions enable row level security;

-- Foydalanuvchi faqat o'z yozuvlarini o'qiy oladi; yozishni faqat server (service role) bajaradi.
create policy "own profile read" on profiles for select using (auth.uid() = id);
create policy "published products read" on products for select using (published = true);
create policy "own purchases read" on purchases for select using (auth.uid() = user_id);
create policy "own subscriptions read" on subscriptions for select using (auth.uid() = user_id);

-- Fayllar uchun PRIVATE bucket (Storage → New bucket → nomi: products, Public: o'chiq).
insert into storage.buckets (id, name, public) values ('products', 'products', false) on conflict do nothing;
