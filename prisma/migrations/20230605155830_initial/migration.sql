-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" INTEGER NOT NULL,
    "figi" TEXT NOT NULL,
    "payment" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Intrument" (
    "figi" TEXT NOT NULL PRIMARY KEY,
    "ticker" TEXT NOT NULL,
    "lot" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
