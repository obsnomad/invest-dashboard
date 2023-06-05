import { MoneyValue, Quotation } from 'tinkoff-invest-api/cjs/generated/common';

/**
 * Transforms number to Quotation { units, nano }
 */
export function toQuotation(value: number): Quotation {
    const sign = value < 0 ? -1 : 1;
    const absValue = Math.abs(value);
    const units = Math.floor(absValue);
    // Math.round is needed to prevent numbers like 10000000.00000227
    const nano = Math.round((absValue - units) * 1000000000);
    return {
        units: sign * units,
        nano: sign * nano,
    };
}

/**
 * Transforms number to MoneyValue { units, nano, currency }
 */
export function toMoneyValue(value: number, currency: string): MoneyValue {
    const { units, nano } = toQuotation(value);
    return { units, nano, currency };
}

/**
 * Adds two MoneyValue(s) { units, nano, currency }
 */
export function addMoneyValue(
    value1: MoneyValue | undefined,
    value2: MoneyValue | undefined,
): MoneyValue | undefined {
    if (!value1) {
        return value2;
    }
    if (!value2) {
        return value1;
    }
    return {
        units: Number(value1.units) + Number(value2.units),
        nano: value1.nano + value2.nano,
        currency: value1.currency,
    };
}

/**
 * Transforms MoneyValue to string
 */
export function toMoneyString(value: MoneyValue | undefined) {
    return `${toNumber(value)} ${value?.currency.toUpperCase()}`;
}

/**
 * Transforms Quotation or MoneyValue to number
 */
export function toNumber<T extends Quotation | MoneyValue | undefined>(value: T) {
    return (value ? value.units + value.nano / 1000000000 : value) as T extends undefined
        ? undefined
        : number;
}
