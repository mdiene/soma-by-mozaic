-- =============================================================================
-- SEED LOCAL — après le chargement de la copie de production (10_*.sql)
--   * efface les mots de passe en clair copiés depuis l'ancienne application ;
--   * recale les compteurs et statuts dérivés.
-- =============================================================================
update public.user_preferences set user_pswd = null where user_pswd is not null;

-- Statut des allocations recalculé à partir des BL chargés (triggers inactifs pendant la copie).
select public.recalc_allocation_status_for_id(id) from public.allocations;
