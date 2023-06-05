-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" INTEGER NOT NULL,
    "figi" TEXT NOT NULL,
    "payment" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intrument" (
    "figi" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "lot" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Intrument_pkey" PRIMARY KEY ("figi")
);
