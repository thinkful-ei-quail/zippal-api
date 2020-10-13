CREATE TABLE "conversation" (
  "id" SERIAL PRIMARY KEY,
  "user_1" INTEGER REFERENCES "user"(id),
  "user_2" INTEGER REFERENCES "user"(id),
  "date_created" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "is_active" BOOLEAN DEFAULT TRUE,
  "user_1_turn" BOOLEAN DEFAULT TRUE,
  "user_2_turn" BOOLEAN DEFAULT FALSE 
);