import { encryptWithPublicKey, encryptSym } from '../crypto';
import { Message, PingMessage, InitiateContactMessage, MessageEnvelope, SecretMessage, AckSendMessage } from './Message';
import { Connection, ConnectionHandler, makeConnection } from './Connection';

const contactAddresses = {};

let webSocket: Connection | null = null;
export const connect = async (ownPublicKey: string, conn: ConnectionHandler = {}) => {
    const connectPromise = new Promise((resolve, reject) => {
        const onOpen = () => {
            resolve();
            if (conn.onOpen != null) {
                conn.onOpen();
            }
        };
        webSocket = makeConnection(ownPublicKey, {...conn, onOpen});
    });
    await connectPromise;
};

const apiSend = (address: string, message: string): Promise<void> => {
    // if (webSocket == null) {
    //     return Promise.resolve();
    // }

    // const envelope: MessageEnvelope = {
    //     recipient: address,
    //     sender: webSocket.ownPublicKey,
    //     payload: message,
    // };
    // return new Promise((resolve, reject) => {
    //     try {
    //         const obj = pssMessage('pss_sendAsym', address, string2Bin(JSON.stringify(envelope)));
    //         webSocket!.send(JSON.stringify(obj));
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     resolve();
    // });
    return Promise.resolve();
};

const messageToString = (message: Message): string => {
    return JSON.stringify(message);
};

export const registerContactAddress = (publicKey: string, address: string) => {
    contactAddresses[publicKey] = address;
};

export const sendPingMessage = (recipientPublicKey: string, ownPublicKey: string): Promise<void> => {
    const message: PingMessage = {
        type: 'ping',
        publicKey: ownPublicKey,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, messageToString(message));
};

export const sendInitiateContactMessage = (recipientPublicKey: string, ownPublicKey: string, ownAddress: string, timestamp: number, random: string, name: string): Promise<void> => {
    const message: InitiateContactMessage = {
        type: 'initiate-contact',
        publicKey: ownPublicKey,
        address: ownAddress,
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
        id: recipientPublicKey,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, messageToString(message));
};

export const sendAckSendMessage = (recipientPublicKey: string, ownPublicKey: string, id: string): Promise<void> => {
    const message: AckSendMessage = {
        type: 'ack-send',
        publicKey: ownPublicKey,
        id,
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
