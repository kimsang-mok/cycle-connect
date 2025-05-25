CREATE TABLE "bikes" (
  "id" UUID NOT NULL,
  "ownerId" UUID NOT NULL REFERENCES users(id),
  "type" VARCHAR NOT NULL,
  "model" VARCHAR NOT NULL,
  "enginePower" INTEGER NOT NULL,
  "pricePerDay" NUMERIC NOT NULL,
  "description" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "PK_bikes_id" PRIMARY KEY ("id")
)