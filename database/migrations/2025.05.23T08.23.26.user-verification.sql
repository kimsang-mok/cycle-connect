CREATE TABLE "user_verifications" (
  "id" UUID PRIMARY KEY,
  "userId" UUID NOT NULL REFERENCES users(id),
  "code" VARCHAR NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);
