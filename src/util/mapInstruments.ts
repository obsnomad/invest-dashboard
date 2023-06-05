import { Instrument } from 'tinkoff-invest-api/cjs/generated/instruments';

import fetch from '@/util/fetch';

export const mapInstruments = async <T extends { figi: string }>(items: T[]) => {
    const instruments = (
        await Promise.allSettled(
            [
                ...items.reduce((acc, { figi }) => {
                    if (figi) {
                        acc.add(figi);
                    }
                    return acc;
                }, new Set() as Set<string>),
            ].map((figi) =>
                fetch<Instrument>(`${process.env.NEXT_PUBLIC_API_HOST}/api/instrument/${figi}/`),
            ),
        )
    ).reduce((acc, result) => {
        if (result.status === 'fulfilled') {
            const instrument = result.value as Instrument;
            acc.set(instrument.figi, instrument);
        }
        return acc;
    }, new Map() as Map<string, Instrument>);

    return items.map((item) => ({
        ...item,
        instrument: instruments.get(item.figi),
    }));
};
