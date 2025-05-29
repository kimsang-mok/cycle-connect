CREATE TABLE "user_verifications" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL REFERENCES users(id),
  "target" character varying NOT NULL,
  "token" character varying NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "PK_user_verification_id" PRIMARY KEY ("id")
);
