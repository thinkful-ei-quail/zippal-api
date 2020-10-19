CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "display_name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "active_conversations" INTEGER DEFAULT 0,
  "bio" TEXT,
  "country" TEXT,
  "fa_icon" TEXT DEFAULT 'user-circle' 
);