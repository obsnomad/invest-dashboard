import Table, { TableProps } from '@/components/home/Table';
import fetch from '@/util/fetch';

export default async function Home() {
    const rows = await fetch<TableProps['rows']>('/api/operations');
    return <Table rows={rows} />;
}
