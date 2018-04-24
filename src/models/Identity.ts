export interface PublicIdentity {
    publicKey: string;
}

export interface PrivateIdentity extends PublicIdentity {
    privateKey: string;
}
