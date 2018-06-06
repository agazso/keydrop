import { Connection, ConnectionHandler } from './Connection';
import { Connect } from 'react-redux';
import { rpcRequest, rpcCall, RpcRequest, rpcConnect } from './JSONRPC';
import { hexToString, toHexString, string2Bin } from '../string';

type PssRpcOutgoingMethod =
    | 'pss_getPublicKey'
    | 'pss_baseAddr'
    | 'pss_stringToTopic'
    | 'pss_subscribe'
    | 'pss_setPeerPublicKey'
    | 'pss_sendAsym'
    | 'pss_setSymmetricKey'
    | 'pss_sendSym'
    | 'pss_GetSymmetricAddressHint'
    | 'pss_GetAsymmetricAddressHint'
    ;

type PssRpcIncomingMethod =
    | 'pss_subscription'
    ;

const pssRpcRequest = (method: PssRpcOutgoingMethod, params: Array<any> = []) => {
    return rpcRequest(method, params);
};

export const pssGetPublicKey = async () => {
    return await rpcCall(pssRpcRequest('pss_getPublicKey'));
};

export const pssGetBaseAddress = async () => {
    return await rpcCall(pssRpcRequest('pss_baseAddr'));
};

export const pssStringToTopic = async (topic: string) => {
    return await rpcCall(pssRpcRequest('pss_stringToTopic', [topic]));
};

export const pssSubscribe = async (topic: string) => {
    return await rpcCall(pssRpcRequest('pss_subscribe', ['receive', topic]));
};

export const pssSetHint = async (publicKey: string, topic: string, address: string, hintBytes: number) => {
    const addressHint = address.substring(0, 2 + (2 * hintBytes));
    return await rpcCall(pssRpcRequest('pss_setPeerPublicKey', [publicKey, topic, addressHint]));
};

const defaultTopic = 'keydrop';
export const pssConnect = async (serverAddress: string, conn: ConnectionHandler<string>) => {
    const rpcConnectionHandler: ConnectionHandler<RpcRequest<PssRpcIncomingMethod, PssSubscription>> = {
        onOpen: undefined,
        onClose: conn.onClose,
        onError: conn.onError,
        onMessage: (request) => {
            if (conn.onMessage != null) {
                conn.onMessage(pssReceiveMessage(request));
            }
        },
    };
    await rpcConnect(serverAddress, rpcConnectionHandler);
    const publicKey = await pssGetPublicKey();
    const baseAddress = await pssGetBaseAddress();
    const topic = await pssStringToTopic(defaultTopic);
    const sub = await pssSubscribe(topic);

    if (conn.onOpen != null) {
        conn.onOpen();
    }
    console.log('pssInit: sub: ', sub);
};

export const pssSendMessage = async (publicKey: string, address: string, message: string) => {
    const hexMessage = '0x' + toHexString(string2Bin(message));
    const topic = await pssStringToTopic(defaultTopic);
    const hint = await pssSetHint(publicKey, topic, address, 32);
    console.log('pssSendMessage: ', address, message);
    const sendResult = await rpcCall(pssRpcRequest('pss_sendAsym', [publicKey, topic, hexMessage]));
};

interface PssSubscriptionResult {
    Msg: string;
    Asymmetric: boolean;
    Key: string;
}

interface PssSubscription {
    subscription: string;
    result: PssSubscriptionResult;
}

const pssReceiveMessage = (request: RpcRequest<PssRpcIncomingMethod, PssSubscription>): string => {
    return hexToString(request.params.result.Msg);
};
