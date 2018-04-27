import { encryptWithPublicKey, encryptSym } from '../crypto';
import { Message, PingMessage, InitiateContactMessage, MessageEnvelope, SecretMessage } from './Message';

//const serverAddress = '192.168.56.1:8080';
const serverAddress = 'keydrop.helmethair.co';

const apiSend = (address: string, message: string): Promise<void> => {
    if (webSocket == null) {
        return Promise.resolve();
    }

    const envelope: MessageEnvelope = {
        recipient: address,
        sender: webSocket.ownPublicKey,
        payload: message,
    };
    return new Promise((resolve, reject) => {
        webSocket!.send(JSON.stringify(envelope));
        resolve();
    });
};

const messageToString = (message: Message): string => {
    return JSON.stringify(message);
};

export const sendPingMessage = (recipientPublicKey: string, ownPublicKey: string): Promise<void> => {
    const message: PingMessage = {
        type: 'ping',
        publicKey: ownPublicKey,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, messageToString(message));
};

export const sendInitiateContactMessage = (recipientPublicKey: string, ownPublicKey: string, timestamp: number, random: string, name: string): Promise<void> => {
    const message: InitiateContactMessage = {
        type: 'initiate-contact',
        publicKey: ownPublicKey,
        timestamp,
        random,
        name,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, messageToString(message));
};

export const sendSecretMessage = (recipientPublicKey: string, ownPublicKey: string, secret: string): Promise<void> => {
    const message: SecretMessage = {
        type: 'secret',
        publicKey: ownPublicKey,
        message: secret,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, messageToString(message));
};

const sendSymEncryptedMessage = (recipient: string, secret: string, message: string): Promise<void> => {
    const encrypted = encryptSym(secret, message);
    return apiSend(recipient, encrypted);
};

const sendAsymEncryptedMessage = (recipientPublicKey: string, message: string): Promise<void> => {
    const encrypted = encryptWithPublicKey(recipientPublicKey, message);
    return apiSend(recipientPublicKey, encrypted);
};

interface ConnectionHandler {
    onOpen?: () => void;
    onMessage?: (message: MessageEnvelope) => void;
    onError?: (reason: string) => void;
    onClose?: (code: number, reason: string) => void;
}

interface Connection {
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
                    const envelope = JSON.parse(e.data) as MessageEnvelope;
                    conn.onMessage(envelope);
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

let webSocket: Connection | null = null;
export const connect = (ownPublicKey: string, conn: ConnectionHandler = {}) =>
    webSocket = makeConnection(ownPublicKey, conn);
