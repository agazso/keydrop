import { encryptWithPublicKey, encryptSym } from '../crypto';
import { Message, PingMessage, InitiateContactMessage, MessageEnvelope, SecretMessage, AckSendMessage } from './Message';
import { Connection, ConnectionHandler } from './Connection';
import { pssSendMessage } from './pssRpc';

let nextMessageId = 0;
const generateMessageId = (prefix: string) => {
    const messageId = prefix + '/' + nextMessageId;
    nextMessageId += 1;
    return messageId;
};

const messageToString = (message: Message): string => {
    const messageToSend = {
        ...message,
        messageId: message.messageId == null
            ? generateMessageId(message.publicKey)
            : message.messageId,
    }
    return JSON.stringify(messageToSend);
};

export const sendPingMessage = (recipientPublicKey: string, recipientAddress: string, ownPublicKey: string): Promise<void> => {
    const message: PingMessage = {
        type: 'ping',
        publicKey: ownPublicKey,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, recipientAddress, messageToString(message));
};

export const sendInitiateContactMessage = (recipientPublicKey: string, recipientAddress: string, ownPublicKey: string, ownAddress: string, timestamp: number, random: string, name: string): Promise<void> => {
    const message: InitiateContactMessage = {
        type: 'initiate-contact',
        publicKey: ownPublicKey,
        address: ownAddress,
        timestamp,
        random,
        name,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, recipientAddress, messageToString(message));
};

export const sendSecretMessage = (recipientPublicKey: string, recipientAddress: string, ownPublicKey: string, secret: string): Promise<void> => {
    const message: SecretMessage = {
        type: 'secret',
        publicKey: ownPublicKey,
        message: secret,
        id: recipientPublicKey,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, recipientAddress, messageToString(message));
};

export const sendAckSendMessage = (recipientPublicKey: string, recipientAddress: string, ownPublicKey: string, id: string): Promise<void> => {
    const message: AckSendMessage = {
        type: 'ack-send',
        publicKey: ownPublicKey,
        id,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, recipientAddress, messageToString(message));
};

const pssSendMessageWithDelay = (delay: number, publicKey: string, address: string, message: string) => {
    setTimeout(async () => {
        await pssSendMessage(publicKey, address, message);
    }, delay);
};

const sendAsymEncryptedMessage = (recipientPublicKey: string, recipientAddress: string, message: string): Promise<void> => {
    pssSendMessageWithDelay(5 * 1000, recipientPublicKey, recipientAddress, message);
    pssSendMessageWithDelay(10 * 1000, recipientPublicKey, recipientAddress, message);
    pssSendMessageWithDelay(15 * 1000, recipientPublicKey, recipientAddress, message);
    return pssSendMessage(recipientPublicKey, recipientAddress, message);
};
