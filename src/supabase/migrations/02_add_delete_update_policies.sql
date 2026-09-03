-- ========================================================
-- 02_add_delete_update_policies.sql
-- Add DELETE and UPDATE RLS policies for all content tables
-- ========================================================

-- Drop if re-running
drop policy if exists "Allow delete access on services" on public.services;
drop policy if exists "Allow update access on services" on public.services;

drop policy if exists "Allow delete access on promos" on public.promos;
drop policy if exists "Allow update access on promos" on public.promos;

drop policy if exists "Allow delete access on patient_feedback" on public.patient_feedback;
drop policy if exists "Allow update access on patient_feedback" on public.patient_feedback;

-- SERVICES
create policy "Allow delete access on services"
  on public.services for delete using (true);

create policy "Allow update access on services"
  on public.services for update using (true) with check (true);

-- PROMOS
create policy "Allow delete access on promos"
  on public.promos for delete using (true);

create policy "Allow update access on promos"
  on public.promos for update using (true) with check (true);

-- PATIENT FEEDBACK
create policy "Allow delete access on patient_feedback"
  on public.patient_feedback for delete using (true);

create policy "Allow update access on patient_feedback"
  on public.patient_feedback for update using (true) with check (true);
