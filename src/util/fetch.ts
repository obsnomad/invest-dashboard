export interface Config<T extends {} = {}> extends RequestInit {
    params?: T;
}

const fetchApi = async <T extends {}, P extends {} = {}>(path: string, init?: Config<P> | undefined): Promise<T> => {
    const url = new URL(path, process.env.NEXT_PUBLIC_API_HOST);
    if (init?.params) {
        const searchParams = new URLSearchParams(init.params);
        url.search = searchParams.toString();
    }
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Request ${url} failed`);
    }
    return await response.json();
};

export default fetchApi;
