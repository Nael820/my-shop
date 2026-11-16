create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  description text,
  in_stock boolean not null default true,
  badge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  product_id uuid not null references public.products,
  quantity integer not null default 1 check (quantity > 0)
);

create index orders_user_created_at_idx on public.orders (user_id, created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "products are public"
  on public.products for select
  using (true);
