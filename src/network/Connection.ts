import { MessageEnvelope } from './Message';

// const serverAddress = 'localhost:8546';
const serverAddress = '192.168.1.3:8547';

export interface ConnectionHandler<MessageType> {
    onOpen?: () => void;
    onMessage?: (message: MessageType) => void;
    onError?: (reason: string) => void;
    onClose?: (code: number, reason: string) => void;
}

export interface Connection {
    send: (data: string) => void;
}

interface ConnectionHolder {
    state: 'disconnected' | 'connecting' | 'connected';
    ws: any;
}

export const wsConnect = (conn: ConnectionHandler<string>): Connection => {
    const url = `ws://${serverAddress}/`;
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
        send: (data: string): void => {
            console.log('Sending data: ', data);
            connHolder.ws.send(data);
        },
    };
};
