CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "display_name" TEXT,
  "password" TEXT NOT NULL,
  "bio" TEXT,
  "country" TEXT,
  "fa_icon" TEXT DEFAULT 'user-circle' 
);