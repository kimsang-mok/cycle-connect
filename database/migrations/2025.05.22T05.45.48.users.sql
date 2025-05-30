CREATE TABLE "users" (
  "id" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "email" character varying,
  "phone" character varying,
  "password" character varying NOT NULL,
  "role" character varying NOT NULL,
  CONSTRAINT "UQ_users_email" UNIQUE ("email"),
  CONSTRAINT "UQ_users_phone" UNIQUE ("phone"),
  CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
);
