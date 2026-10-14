-- =============================================================================
-- SEED LOCAL UNIQUEMENT — compte administrateur de développement
--   e-mail : admin@soma.local      mot de passe : soma-local-2026
-- Exécuté par `supabase db reset` sur la base LOCALE. Garde-fou : refuse de
-- s'exécuter si la base contient déjà des BL (c.-à-d. une base réelle).
-- =============================================================================
do $$
declare
  v_id uuid := '00000000-0000-4000-a000-000000000001';
begin
  if exists (select 1 from public.deliveries) then
    raise exception 'Seed local refusé : cette base contient déjà des livraisons.';
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', 'admin@soma.local',
    extensions.crypt('soma-local-2026', extensions.gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}', '{"full_name": "Administrateur local"}', now(), now(),
    '', '', '', ''
  ) on conflict (id) do nothing;

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), v_id, v_id::text,
          jsonb_build_object('sub', v_id::text, 'email', 'admin@soma.local', 'email_verified', true),
          'email', now(), now(), now())
  on conflict do nothing;

  perform core.bootstrap_admin('admin@soma.local', 'GROUPE_MOZAIC');
end $$;
