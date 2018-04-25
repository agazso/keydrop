
interface ApiCall {
    address: string;

}

const serverUrl = '78.47.178.92';

const apiCall = (address: string, message: string): Promise<void> => {
    const url = `http://${serverUrl}/swarm/sendAsym/${address}/${message}`
    console.log('apiCall: ', url);
    return new Promise((resolve, reject) => resolve());
};

export const sendMessage = (publicKey: string, message: string): Promise<void> => {
    return apiCall(publicKey, message);
};
