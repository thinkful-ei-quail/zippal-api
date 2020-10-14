CREATE TYPE "sender_status" AS ENUM (
  'Pending', 
  'Sent',
  'Awaiting Reply'
);

CREATE TYPE "receiver_status" AS ENUM (
  'Awaiting Message',
  'Received',
  'Read'
);

CREATE TABLE "message" (
  "id" SERIAL PRIMARY KEY,
  "conversation_id" INTEGER REFERENCES "conversation"(id) ON DELETE CASCADE,
  "sender_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
  "sender_status" sender_status DEFAULT 'Pending',
  "receiver_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
  "receiver_status" receiver_status DEFAULT 'Awaiting Message',
  "content" TEXT NOT NULL,
  "date_sent" TIMESTAMPTZ DEFAULT NULL,
  "is_read" BOOLEAN DEFAULT FALSE
);