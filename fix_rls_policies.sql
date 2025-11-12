-- Ver las políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'hub_users';

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Allow read for login" ON hub_users;
DROP POLICY IF EXISTS "Authenticated users can view hub users" ON hub_users;
DROP POLICY IF EXISTS "Hub users can view other hub users" ON hub_users;
DROP POLICY IF EXISTS "Super admins can manage hub users" ON hub_users;

-- Crear política permisiva para SELECT durante login
-- Esta política permite leer hub_users para cualquier usuario autenticado
CREATE POLICY "Allow authenticated users to read hub_users"
ON hub_users FOR SELECT
TO authenticated
USING (true);

-- Crear política para INSERT (solo super_admin)
CREATE POLICY "Super admins can insert hub users"
ON hub_users FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM hub_users
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- Crear política para UPDATE (solo super_admin)
CREATE POLICY "Super admins can update hub users"
ON hub_users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hub_users
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- Crear política para DELETE (solo super_admin)
CREATE POLICY "Super admins can delete hub users"
ON hub_users FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hub_users
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- Verificar las nuevas políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'hub_users'
ORDER BY cmd, policyname;
