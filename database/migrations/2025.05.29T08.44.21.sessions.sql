CREATE TABLE "sessions" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL REFERENCES users(id),
  "accessToken" character varying NOT NULL,
  "refreshToken" character varying NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "UQ_sessions_refresh_token" UNIQUE ("refreshToken"),
  CONSTRAINT "PK_sessions_id" PRIMARY KEY ("id")
);