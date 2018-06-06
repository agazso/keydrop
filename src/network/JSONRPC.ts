import { Connection, ConnectionHandler, wsConnect } from './Connection';

let messageId = 0;
let connection: Connection | undefined;
const requestResolvers = new Map<number, (result: string) => void>();

export interface RpcRequest<MethodType, ParamType> {
    jsonrpc: string;
    id?: number;
    method: MethodType;
    params: ParamType;
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

export const rpcRequest = <MethodType, ParamType>(method: MethodType, params: ParamType): RpcRequest<MethodType, ParamType> => {
    return {
        jsonrpc: '2.0',
        id: nextMessageId(),
        method,
        params,
    };
};

export const rpcCall = async <MethodType, ParamType>(request: RpcRequest<MethodType, ParamType>) => {
    try {
        connection!.send(JSON.stringify(request));
        return new Promise<string>((resolve, reject) => {
            requestResolvers.set(request.id!, resolve);
        });
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
};

const isRequest = <MethodType, ParamType>(r: RpcRequest<MethodType, ParamType> | RpcResponse): r is RpcRequest<MethodType, ParamType> => {
    return (r as RpcRequest<MethodType, ParamType>).method !== undefined;
};

export const rpcConnect = async <MethodType, ParamType>(serverAddress, conn: ConnectionHandler<RpcRequest<MethodType, ParamType>> = {}): Promise<Connection> => {
    if (connection != null) {
        connection.close();
        connection = undefined;
    }
    const connectPromise = new Promise<Connection>((resolve, reject) => {
        const onOpen = () => {
            resolve(connection);
            if (conn.onOpen != null) {
                conn.onOpen();
            }
        };
        const onMessage = (msg: string) => {
            const r = JSON.parse(msg) as RpcResponse | RpcRequest<MethodType, ParamType>;
            if (isRequest(r)) {
                const request = r;
                if (conn.onMessage != null) {
                    conn.onMessage(r);
                }
            } else {
                const response = r;
                if (requestResolvers.has(response.id)) {
                    const resolveRequest = requestResolvers.get(response.id)!;
                    requestResolvers.delete(response.id);
                    resolveRequest(response.result);
                } else {
                    console.error('Message without resolver ', response.id);
                }
            }
        };
        connection = wsConnect(serverAddress, {...conn, onOpen, onMessage});
    });
    return await connectPromise;
};
