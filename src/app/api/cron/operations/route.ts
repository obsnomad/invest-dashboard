import { Instrument, Operation, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { InstrumentIdType } from 'tinkoff-invest-api/cjs/generated/instruments';
import { OperationState, OperationType } from 'tinkoff-invest-api/cjs/generated/operations';

import { toNumber } from '@/util/helpers';
import api, { accountId } from '@/util/tinkoffApi';

const prisma = new PrismaClient();

const HISTORY_START_DATE = '2023-05-22';

export async function GET(request: Request) {
    const operation = await prisma.operation.findFirst({
        orderBy: {
            date: 'asc',
        },
        select: {
            date: true,
        },
    });

    const from = dayjs(HISTORY_START_DATE).toDate();
    const to = dayjs(operation?.date).toDate();

    let cursor = '';
    do {
        const { items, nextCursor } = await api.operations.getOperationsByCursor({
            accountId,
            instrumentId: '',
            from,
            to,
            state: OperationState.OPERATION_STATE_EXECUTED,
            cursor,
            limit: 1000,
            operationTypes: [OperationType.OPERATION_TYPE_BUY, OperationType.OPERATION_TYPE_SELL],
            withoutCommissions: true,
            withoutOvernights: true,
            withoutTrades: true,
        });
        cursor = nextCursor;

        const { operations, figi } = items.reduce(
            (acc, { id, name, date, type, figi, payment, commission, quantity }) => {
                acc.operations.push({
                    id,
                    name,
                    date: dayjs(date).toDate(),
                    type,
                    figi,
                    payment: toNumber(payment) ?? 0,
                    commission: toNumber(commission) ?? 0,
                    quantity,
                });

                acc.figi.add(figi);

                return acc;
            },
            { operations: [], figi: new Set([]) } as {
                operations: Operation[];
                figi: Set<string>;
            },
        );

        const existingFigi = new Set(
            (
                await prisma.instrument.findMany({
                    where: {
                        figi: {
                            in: [...figi],
                        },
                    },
                    select: {
                        figi: true,
                    },
                })
            ).map(({ figi }) => figi),
        );

        const filteredFigi = [...figi].filter((item) => !existingFigi.has(item));

        if (filteredFigi.length > 0) {
            const instruments = (
                await Promise.allSettled(
                    filteredFigi.map((figi) =>
                        api.instruments.getInstrumentBy({
                            idType: InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI,
                            classCode: '',
                            id: figi,
                        }),
                    ),
                )
            ).reduce((acc, result) => {
                if (result.status === 'fulfilled') {
                    const { instrument } = result.value;
                    if (instrument) {
                        acc.push({
                            figi: instrument.figi,
                            ticker: instrument.ticker,
                            lot: instrument.lot,
                            currency: instrument.currency,
                            name: instrument.name,
                        });
                    }
                }
                return acc;
            }, [] as Instrument[]);

            await Promise.all(
                instruments.map(async (instrument) => {
                    await prisma.instrument.create({
                        data: instrument,
                    });
                }),
            );
        }

        for (let operation of operations) {
            await prisma.operation.upsert({
                where: { id: operation.id },
                update: operation,
                create: operation,
            });
        }
    } while (cursor);

    return NextResponse.json('ok');
}
