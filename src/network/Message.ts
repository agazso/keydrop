export interface MessageBase {
    publicKey: string;
}

export interface InitiateContactMessage extends MessageBase {
    type: 'initiate-contact';
    timestamp: number;
    random: string;
    name: string;
}

export interface SecretMessage extends MessageBase {
    type: 'secret';
    message: string;
}

export interface PingMessage extends MessageBase {
    type: 'ping';
}

export type Message =
    | InitiateContactMessage
    | SecretMessage
    | PingMessage
    ;

export interface MessageEnvelope {
    recipient: string;
    sender: string;
    payload: string;
}
