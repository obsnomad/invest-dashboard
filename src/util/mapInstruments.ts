import { Data as InstrumentData, Params as InstrumentParams } from '@/app/api/instrument/[figi]/route';
import fetch, { Config } from '@/util/fetch';

const FETCH_PARAMS: Config = {
    next: { revalidate: 60 },
};

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
                fetch<InstrumentData, InstrumentParams>(
                    `${process.env.NEXT_PUBLIC_API_HOST}/api/instrument`,
                    {
                        ...FETCH_PARAMS,
                        params: { figi },
                    },
                ),
            ),
        )
    ).reduce((acc, result) => {
        if (result.status === 'fulfilled') {
            const instrument = result.value as InstrumentData;
            acc.set(instrument.figi, instrument);
        }
        return acc;
    }, new Map() as Map<string, InstrumentData>);

    return items.map((item) => ({
        ...item,
        instrument: instruments.get(item.figi),
    }));
};
