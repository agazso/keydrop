export interface MessageBase {
    publicKey: string;
}

export interface InitiateContactMessage extends MessageBase {
    type: 'initiate-contact';
    address: string;
    timestamp: number;
    random: string;
    name: string;
}

export interface SecretMessage extends MessageBase {
    type: 'secret';
    message: string;
    id: string;
}

export interface PingMessage extends MessageBase {
    type: 'ping';
}

export interface AckSendMessage extends MessageBase {
    type: 'ack-send';
    id: string;
}

export type Message =
    | InitiateContactMessage
    | SecretMessage
    | PingMessage
    | AckSendMessage
    ;

export interface MessageEnvelope {
    recipient: string;
    sender: string;
    payload: string;
}
