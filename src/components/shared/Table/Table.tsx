import cn from 'classnames';
import React, { SyntheticEvent } from 'react';
import { Row, Column as TableColumn, useSortBy, useTable } from 'react-table';

import styles from './Table.module.scss';

export type Column<OptionValue extends object = {}> = TableColumn<OptionValue> & {
    classNames?: {
        header?: string;
        cell?: string;
    };
};

export interface TableProps<OptionValue extends object = {}> {
    columns: Column<OptionValue>[];
    data: OptionValue[];
    className?: string;
    rowClassName?: (row: Row<OptionValue>) => string;
    onRowClick?: (event: SyntheticEvent, row: Row<OptionValue>) => void;
    isLoading?: boolean;
}

export function Table<OptionValue extends object = {}>({
    columns,
    data,
    className,
    rowClassName,
    onRowClick,
}: TableProps<OptionValue>) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<OptionValue>({ columns, data }, useSortBy);

    return (
        <div className={styles.tableWrapper}>
            <table className={cn(styles.table, className)} {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => {
                        const { key: groupKey, ...groupProps } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={groupKey} {...groupProps}>
                                {headerGroup.headers.map((column) => {
                                    const { key: columnKey, ...columnProps } =
                                        column.getHeaderProps({
                                            className: cn(
                                                styles.cell,
                                                (column as Column).classNames?.header,
                                            ),
                                        });
                                    return (
                                        <th key={columnKey} {...columnProps}>
                                            {column.render('Header')}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        const odd = Boolean(i % 2);
                        const { key: rowKey, ...rowProps } = row.getRowProps({
                            className: rowClassName?.(row),
                        });

                        return (
                            <React.Fragment key={rowKey}>
                                <tr
                                    className={cn(styles.row, odd ? styles.odd : styles.even)}
                                    onClick={(event) => {
                                        const shouldPrevent = Boolean(
                                            (event.target as Element).closest(
                                                '[data-prevent-row-click]',
                                            ),
                                        );
                                        if (!shouldPrevent) {
                                            if (onRowClick) {
                                                onRowClick(event, row);
                                            }
                                        }
                                    }}
                                    {...rowProps}
                                >
                                    {row.cells.map((cell) => {
                                        const { key: cellKey, ...cellProps } = cell.getCellProps({
                                            className: cn(
                                                styles.cell,
                                                (cell.column as Column).classNames?.cell,
                                            ),
                                        });
                                        return (
                                            <td key={cellKey} {...cellProps}>
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
