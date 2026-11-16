grant select on public.products to anon, authenticated;
grant select, insert on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;

create policy "users can read own orders"
  on public.orders for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "users can create own orders"
  on public.orders for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can read own order items"
  on public.order_items for select to authenticated
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = (select auth.uid())
    )
  );

create policy "users can create own order items"
  on public.order_items for insert to authenticated
  with check (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = (select auth.uid())
    )
  );

create or replace function public.place_order(p_items jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_order_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Une session est requise pour commander.'
      using errcode = '42501';
  end if;

  if p_items is null or jsonb_typeof(p_items) is distinct from 'array'
    or jsonb_array_length(p_items) = 0 then
    raise exception 'Le panier doit contenir au moins un article.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as input(item)
    where coalesce(jsonb_typeof(input.item), '') <> 'object'
      or coalesce(input.item ->> 'product_id', '') = ''
      or coalesce(input.item ->> 'quantity', '') !~ '^[1-9][0-9]*$'
  ) then
    raise exception 'Les articles du panier sont invalides.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as input(item)
    left join public.products as product
      on product.id = (input.item ->> 'product_id')::uuid
    where product.id is null or not product.in_stock
  ) then
    raise exception 'Un ou plusieurs produits ne sont plus disponibles.'
      using errcode = '22023';
  end if;

  insert into public.orders (user_id)
  values (auth.uid())
  returning id into new_order_id;

  insert into public.order_items (order_id, product_id, quantity)
  select
    new_order_id,
    (input.item ->> 'product_id')::uuid,
    (input.item ->> 'quantity')::integer
  from jsonb_array_elements(p_items) as input(item);

  return new_order_id;
end;
$$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to authenticated;
