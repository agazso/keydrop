import { Connection, ConnectionHandler, makeConnection } from './Connection';

let messageId = 0;
let connection: Connection | undefined;
const requestResolvers = new Map<number, (result: string) => void>();

interface RpcRequest {
    jsonrpc: string;
    id: number;
    method: string;
    params: Array<any>;
}

interface RpcResponse {
    jsonrpc: string;
    id: number;
    result: string;
}

const nextMessageId = () => {
    const id = messageId;
    messageId += 1;
    return id;
};

export const rpcRequest = (method: string, params: Array<any> = []): RpcRequest => {
    return {
        jsonrpc: '2.0',
        id: nextMessageId(),
        method,
        params,
    };
};

export const rpcCall = async (request: RpcRequest) => {
    try {
        connection!.send(JSON.stringify(request));
        return new Promise<string>((resolve, reject) => {
            requestResolvers.set(request.id, resolve);
        });
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
};

export const rpcConnect = async (conn: ConnectionHandler = {}): Promise<Connection> => {
    const connectPromise = new Promise<Connection>((resolve, reject) => {
        const onOpen = () => {
            resolve(connection);
            if (conn.onOpen != null) {
                conn.onOpen();
            }
        };
        const onMessage = (e) => {
            const response = JSON.parse(e) as RpcResponse;
            if (requestResolvers.has(response.id)) {
                const resolveRequest = requestResolvers.get(response.id)!;
                requestResolvers.delete(response.id);
                resolveRequest(response.result);
            } else {
                console.error('Message without resolver ', response.id);
            }
        };
        connection = makeConnection('', {...conn, onOpen, onMessage});
    });
    return await connectPromise;
};
