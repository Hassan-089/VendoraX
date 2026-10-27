-- READ ONLY. Run against the current development database to inspect before migration design.
-- Contains no user records or secrets. Do not replace this with a database reset.
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,ordinal_position;
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname='public' ORDER BY tablename,policyname;
SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint WHERE connamespace='public'::regnamespace ORDER BY conrelid::regclass::text,conname;
SELECT schemaname, tablename, indexname, indexdef FROM pg_indexes WHERE schemaname='public';
SELECT trigger_schema,event_object_table,trigger_name,action_statement
FROM information_schema.triggers WHERE trigger_schema='public';
SELECT routine_name,security_type FROM information_schema.routines WHERE routine_schema='public';
SELECT id, name, public, file_size_limit, allowed_mime_types FROM storage.buckets;
SELECT tablename,policyname,cmd,qual,with_check FROM pg_policies WHERE schemaname='storage';
