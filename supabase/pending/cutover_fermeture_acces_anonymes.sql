-- =============================================================================
-- À APPLIQUER AU MOMENT DE LA BASCULE (pas avant) — fermeture des accès anonymes
--
-- Effet : l'ancienne application « MASAE Delivery Tracker » (clé anon, sans
-- authentification réelle) cesse de fonctionner. À n'appliquer qu'une fois :
--   1. tous les utilisateurs invités dans Supabase Auth et rattachés à un rôle ;
--   2. le nouveau front déployé et recetté sur les livraisons ;
--   3. la clé anon régénérée (Dashboard > Settings > API) puisqu'elle a été
--      publiée dans le dépôt public Mozaic-delivery-2025.
-- Pour l'appliquer : déplacer ce fichier dans supabase/migrations/ avec un
-- horodatage du jour, puis `npx supabase db push`.
-- =============================================================================

do $$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public'
      and (policyname = 'legacy_full_access' or roles && array['anon', 'public']::name[])
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;

-- Les vues historiques doivent respecter la RLS de l'utilisateur.
alter view public.view_bon_livraison set (security_invoker = true);
alter view public.view_fin_de_cession set (security_invoker = true);

-- Mots de passe en clair : suppression définitive.
alter table public.user_preferences drop column if exists user_pswd;
