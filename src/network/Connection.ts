import { MessageEnvelope } from './Message';

// const serverAddress = '192.168.56.1:8080';
// const serverAddress = 'keydrop.helmethair.co';
const serverAddress = 'localhost:8546';

export interface ConnectionHandler {
    onOpen?: () => void;
    onMessage?: (message: MessageEnvelope) => void;
    onError?: (reason: string) => void;
    onClose?: (code: number, reason: string) => void;
}

export interface Connection {
    send: (data: string) => void;
    ownPublicKey: string;
}

interface ConnectionHolder {
    state: 'disconnected' | 'connecting' | 'connected';
    ws: any;
}

export const makeConnection = (ownPublicKey: string, conn: ConnectionHandler): Connection => {
    const url = `ws://${serverAddress}/ws/`;
    const connHolder: ConnectionHolder = {
        state: 'disconnected',
        ws: null,
    };

    const setupConnection = (ch) => {
        console.log(`Connecting to ${url}`);

        ch.state = 'disconnected';
        ch.ws = new WebSocket(url);
        ch.state = 'connecting';
        ch.ws.onopen = () => {
            console.log('Connected to ', url);
            ch.state = 'connected';
            if (conn.onOpen != null) {
                conn.onOpen();
            }
        };
        ch.ws.onmessage = (e) => {
            if (conn.onMessage != null) {
                try {
                    console.log('Received ', e.data);
                    // const envelope = JSON.parse(e.data) as MessageEnvelope;
                    // conn.onMessage(envelope);
                    conn.onMessage(e.data);
                } catch (e) {
                    console.log(e);
                }
            }
        };
        ch.ws.onerror = (e: any) => {
            if (conn.onError != null) {
                conn.onError(e.message);
            }
            console.log('Connection error', e.message);
        };
        ch.ws.onclose = (e: any) => {
            if (conn.onClose != null) {
                conn.onClose(e.code, e.reason);
            }
            console.log('Disconnected with close');
            ch.state = 'disconnected';
            if (ch.state !== 'connecting') {
                ch.state = 'connecting';
                setTimeout(() => setupConnection(ch), 5000);
            }
        };
    };

    setupConnection(connHolder);

    return {
        ownPublicKey,
        send: (data: string): void => {
            console.log('Sending data: ', data);
            connHolder.ws.send(data);
        },
    };
};
