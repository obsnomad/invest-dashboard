import { TinkoffInvestApi } from 'tinkoff-invest-api';

const api = new TinkoffInvestApi({ token: process.env.TINKOFF_SECRET_TOKEN ?? '' });

export const accountId = process.env.TINKOFF_ACCOUNT_ID ?? '';

export default api;
