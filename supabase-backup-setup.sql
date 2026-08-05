-- Execute uma vez no Supabase SQL Editor
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('finance-backups','finance-backups',false,5242880,array['application/json'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=array['application/json'];

drop policy if exists "Users can read own finance backups" on storage.objects;
create policy "Users can read own finance backups" on storage.objects for select to authenticated
using (bucket_id='finance-backups' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Users can create own finance backups" on storage.objects;
create policy "Users can create own finance backups" on storage.objects for insert to authenticated
with check (bucket_id='finance-backups' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Users can update own finance backups" on storage.objects;
create policy "Users can update own finance backups" on storage.objects for update to authenticated
using (bucket_id='finance-backups' and (storage.foldername(name))[1]=auth.uid()::text)
with check (bucket_id='finance-backups' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "Users can delete own finance backups" on storage.objects;
create policy "Users can delete own finance backups" on storage.objects for delete to authenticated
using (bucket_id='finance-backups' and (storage.foldername(name))[1]=auth.uid()::text);
