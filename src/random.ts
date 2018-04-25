import { generateSecureRandom } from 'react-native-securerandom';

export const generateRandomString = async (lengthInBytes: number): Promise<string> => {
    const randomBytes: Uint8Array = await generateSecureRandom(lengthInBytes);
    return randomBytes.reduce<string>(
        (acc, value) => acc + ('0' + value.toString(16)).slice(-2),
        '',
    );
};

export const getRandomStrings = async (arrayLength: number): Promise<string[]> => {
    return new Promise<string[]>( async (resolve, reject) => {
        const randoms = new Array(arrayLength);
        for (let i = 0; i < arrayLength; i++) {
            randoms[i] = await generateRandomString(32);
        }
        resolve(randoms);
    });
};
