import { encryptWithPublicKey, encryptSym } from '../crypto';
import { Message, PingMessage, InitiateContactMessage, MessageEnvelope, SecretMessage, AckSendMessage } from './Message';
import { Connection, ConnectionHandler } from './Connection';
import { pssSendMessage } from './pssRpc';

const contactAddresses = {};

const messageToString = (message: Message): string => {
    return JSON.stringify(message);
};

export const registerContactAddress = (publicKey: string, address: string) => {
    contactAddresses[publicKey] = address;
};

export const sendPingMessage = (recipientPublicKey: string, recipientAddress: string, ownPublicKey: string): Promise<void> => {
    const message: PingMessage = {
        type: 'ping',
        publicKey: ownPublicKey,
    };
    return sendAsymEncryptedMessage(recipientPublicKey, recipientAddress, messageToString(message));
};

export const sendInitiateContactMessage = (recipientPublicKey: string, recipientAddress: string, timestamp: number, random: string, name: string): Promise<void> => {
    const message: InitiateContactMessage = {
        type: 'initiate-contact',
        publicKey: recipientPublicKey,
        address: recipientAddress,
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

const sendAsymEncryptedMessage = (recipientPublicKey: string, recipientAddress: string, message: string): Promise<void> => {
    return pssSendMessage(recipientPublicKey, recipientAddress, message);
};
