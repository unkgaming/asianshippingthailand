-- Create staff account via SQL
-- Run this in Prisma Studio's SQL tab or your database client

-- First, you need to hash your password using bcrypt
-- You can use this Node.js one-liner to generate a hash:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourPassword123', 10).then(console.log);"

-- Then insert the user (replace the password hash with your generated one)
INSERT INTO "User" (id, email, name, role, password, provider, "createdAt")
VALUES (
  gen_random_uuid()::text,  -- PostgreSQL UUID generator
  'staff@asianshippingthai.com',
  'Staff Admin',
  'employee',
  '$2b$10$...',  -- Replace with your bcrypt hash
  'credentials',
  NOW()
);

-- Then create user config (replace USER_ID with the ID from above)
INSERT INTO "UserConfig" (id, "userId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'USER_ID_FROM_ABOVE',
  NOW(),
  NOW()
);
