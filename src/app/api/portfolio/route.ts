import { NextResponse } from 'next/server';
import { PortfolioResponse } from 'tinkoff-invest-api/cjs/generated/operations';

import api, { accountId } from '@/util/tinkoffApi';

export const revalidate = 60;

export async function GET() {
    const response = await api.operations.getPortfolio({ accountId });
    return NextResponse.json(response);
}
