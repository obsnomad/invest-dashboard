import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import {
    OperationItem,
    OperationState,
    OperationType,
} from 'tinkoff-invest-api/cjs/generated/operations';

import { addMoneyValue } from '@/util/helpers';
import api, { accountId } from '@/util/tinkoffApi';

const operationStack = () => {
    const stack: Map<string, OperationItem> = new Map();

    return {
        push: (item: OperationItem) => {
            const existingItem = stack.get(item.figi);

            if (!existingItem) {
                stack.set(item.figi, item);
                return;
            }

            if (existingItem.type === item.type) {
                existingItem.payment = addMoneyValue(existingItem.payment, item.payment);
                existingItem.commission = addMoneyValue(existingItem.commission, item.commission);
                existingItem.quantity += item.quantity;
                return;
            }

            stack.delete(item.figi);

            if (existingItem.type === OperationType.OPERATION_TYPE_BUY) {
                return {
                    type: OperationType.OPERATION_TYPE_BUY,
                    buy: existingItem,
                    sell: item,
                };
            }

            return {
                type: OperationType.OPERATION_TYPE_SELL,
                buy: item,
                sell: existingItem,
            };
        },
        flush: () => {
            const values = [...stack.values()];
            stack.clear();
            return values.map((item) => ({
                type: item.type,
                [item.type === OperationType.OPERATION_TYPE_BUY ? 'buy' : 'sell']: item,
            }));
        },
    };
};

export const revalidate = 60;

export async function GET() {
    const from = dayjs('2022-05-22').toDate();
    const to = dayjs().toDate();

    const { items } = await api.operations.getOperationsByCursor({
        accountId,
        instrumentId: '',
        from,
        to,
        state: OperationState.OPERATION_STATE_EXECUTED,
        cursor: '',
        limit: 1000,
        operationTypes: [OperationType.OPERATION_TYPE_BUY, OperationType.OPERATION_TYPE_SELL],
        withoutCommissions: true,
        withoutOvernights: true,
        withoutTrades: true,
    });

    const { push, flush } = operationStack();

    const combinedOperations = items.reverse().reduce((acc, item) => {
        const stackedItem = push(item);
        if (stackedItem) {
            acc.push(stackedItem);
        }
        return acc;
    }, [] as Array<{ type: OperationType; buy: OperationItem; sell: OperationItem }>);

    return NextResponse.json([...flush(), ...combinedOperations]);
}
