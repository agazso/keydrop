import { Connection, ConnectionHandler, makeConnection } from './Connection';
import { Connect } from 'react-redux';
import { rpcRequest, rpcCall } from './JSONRPC';

type PssRpcMethod =
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

// cheekily borrowed from https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript
const toHexString = (byteArray: Uint8Array) => {
    return Array.from(byteArray, (byte) => {
        // tslint:disable-next-line:no-bitwise
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};

// equally cheekily borrowed from https://stackoverflow.com/questions/17720394/javascript-string-to-byte-to-string
const string2Bin = (str: string) => {
    const result = new Array<any>();
    for (let i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
};

const pssRpcRequest = (method: PssRpcMethod, params: Array<any> = []) => {
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

export const pssInit = async () => {
    const publicKey = await pssGetPublicKey();
    const baseAddress = await pssGetBaseAddress();
    const topic = await pssStringToTopic('keydrop');
    const sub = await pssSubscribe(topic);
    const h = await pssSetHint(publicKey, topic, baseAddress, 32);
    console.log('pssInit: ', h);
};
