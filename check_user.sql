-- Check auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'hector.temich@deonpay.mx';

-- Check hub_users
SELECT id, user_id, email, role, is_active 
FROM hub_users 
WHERE email = 'hector.temich@deonpay.mx';
