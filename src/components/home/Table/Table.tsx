import { Row } from 'react-table';
import UITable, { Column } from 'src/components/shared/Table';
import {
    OperationItem,
    OperationType,
} from 'tinkoff-invest-api/cjs/generated/operations';

import { toNumber } from '@/util/helpers';

import styles from './Table.module.scss';

type RowData = {
    type: OperationType;
    buy?: OperationItem;
    sell?: OperationItem;
};

export interface TableProps {
    rows: RowData[];
}

const columns: Column<RowData>[] = [
    {
        Header: 'FIGI',
        id: 'figi',
        accessor: ({ buy, sell }) => buy?.figi || sell?.figi,
    },
    {
        Header: 'Название',
        id: 'name',
        accessor: ({ buy, sell }) => buy?.name || sell?.name,
    },
    {
        Header: 'Тип операции',
        id: 'type',
        accessor: ({ type }) => (type === OperationType.OPERATION_TYPE_BUY ? 'Long' : 'Short'),
    },
    {
        Header: 'Кол-во',
        id: 'quantity',
        accessor: ({ type, buy, sell }) =>
            type === OperationType.OPERATION_TYPE_BUY ? buy?.quantity : sell?.quantity,
    },
    {
        Header: 'Цена покупки',
        id: 'buyPrice',
        accessor: ({ buy }) => (buy ? (toNumber(buy.payment) ?? 0) / buy.quantity : null),
    },
    {
        Header: 'Сумма покупки',
        id: 'buyPayment',
        accessor: ({ buy }) => toNumber(buy?.payment),
    },
    {
        Header: 'Комиссия покупки',
        id: 'buyCommission',
        accessor: ({ buy }) => toNumber(buy?.commission),
    },
    {
        Header: 'Цена продажи',
        id: 'sellPrice',
        accessor: ({ sell }) => (sell ? (toNumber(sell.payment) ?? 0) / sell.quantity : null),
    },
    {
        Header: 'Сумма продажи',
        id: 'sellPayment',
        accessor: ({ sell }) => toNumber(sell?.payment),
    },
    {
        Header: 'Комиссия продажи',
        id: 'sellCommission',
        accessor: ({ sell }) => toNumber(sell?.commission),
    },
];

const getClassName = ({ original: { type } }: Row<RowData>) =>
    type === OperationType.OPERATION_TYPE_BUY ? styles.long : styles.short;

export const Table: React.FC<TableProps> = ({ rows }) => (
    <UITable columns={columns} data={rows} rowClassName={getClassName} />
);
