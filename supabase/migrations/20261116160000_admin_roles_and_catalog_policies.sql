create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer'
    check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
grant select on public.profiles to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "users can read own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "admins can read all profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

create policy "admins can insert products"
  on public.products for insert to authenticated
  with check (public.is_admin());

create policy "admins can update products"
  on public.products for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete products"
  on public.products for delete to authenticated
  using (public.is_admin());

grant insert, update, delete on public.products to authenticated;

create policy "admins can read all orders"
  on public.orders for select to authenticated
  using (public.is_admin());

create policy "admins can read all order items"
  on public.order_items for select to authenticated
  using (public.is_admin());
