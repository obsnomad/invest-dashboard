import { NextResponse } from 'next/server';
import { InstrumentIdType } from 'tinkoff-invest-api/cjs/generated/instruments';

import api from '@/util/tinkoffApi';

export const revalidate = 60;

export async function GET(
    _request: Request,
    {
        params: { figi },
    }: {
        params: { figi: string };
    },
) {
    const { instrument } = await api.instruments.getInstrumentBy({
        idType: InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI,
        classCode: '',
        id: figi,
    });

    if (instrument) {
        return NextResponse.json(instrument);
    }

    return new Response('Instrument not found', {
        status: 404,
    });
}
