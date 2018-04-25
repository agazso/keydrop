
const randomString = 'a24c4f9eb98387d52bbbe6ffc73a04936d71d4d39cc6398d7f556384cc48f56597f460483a9a2d89a1e75721421f19d7c30f7b6faa590fbd4b93a00b77b252fd';

export const getRandomStrings = async (arrayLength: number): Promise<string[]> => {
    return new Promise<string[]>( (resolve, reject) => {
        const randoms = new Array(arrayLength);
        for (let i = 0; i < arrayLength; i++) {
            randoms[i] = randomString;
        }
        resolve(randoms);
    });
};
