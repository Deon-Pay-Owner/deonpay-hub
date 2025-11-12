-- Query 1: Verificar estado actual
SELECT 
  'auth.users' as table_name,
  id, 
  email, 
  created_at,
  confirmed_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'hector.temich@deonpay.mx'

UNION ALL

SELECT 
  'hub_users' as table_name,
  id::text,
  email,
  created_at,
  NULL as confirmed_at,
  NULL as email_confirmed_at
FROM hub_users 
WHERE email = 'hector.temich@deonpay.mx';

-- Query 2: Fix hub_users if needed (ejecuta esto SOLO si el user_id no coincide)
-- UPDATE hub_users 
-- SET user_id = (SELECT id FROM auth.users WHERE email = 'hector.temich@deonpay.mx'),
--     is_active = true
-- WHERE email = 'hector.temich@deonpay.mx';

-- Query 3: Verificar después del fix
SELECT 
  hu.id as hub_user_id,
  hu.user_id,
  hu.email,
  hu.role,
  hu.is_active,
  au.id as auth_user_id,
  au.email as auth_email,
  CASE 
    WHEN hu.user_id = au.id THEN 'MATCH ✓'
    ELSE 'MISMATCH ✗'
  END as id_match
FROM hub_users hu
LEFT JOIN auth.users au ON hu.email = au.email
WHERE hu.email = 'hector.temich@deonpay.mx';
