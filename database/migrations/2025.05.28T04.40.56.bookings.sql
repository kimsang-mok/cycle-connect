CREATE TABLE "bookings" (
  "id" UUID NOT NULL,
  "bikeId" UUID NOT NULL REFERENCES bikes(id),
  "customerId" UUID NOT NULL REFERENCES users(id),
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "status" VARCHAR(32) NOT NULL,
  "totalPrice" NUMERIC(10, 2) NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id")
);