import { Data as OperationsData } from '@/app/api/operations/route';
import Table from '@/components/home/Table';
import fetch from '@/util/fetch';

export default async function Home() {
    const rows = await fetch<OperationsData>(`${process.env.NEXT_PUBLIC_API_HOST}/api/operations`);
    return <Table rows={rows} />;
}
