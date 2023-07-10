-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" INTEGER NOT NULL,
    "figi" TEXT NOT NULL,
    "payment" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "figi" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "lot" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("figi")
);

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_figi_fkey" FOREIGN KEY ("figi") REFERENCES "Instrument"("figi") ON DELETE RESTRICT ON UPDATE CASCADE;
