export const generateMathRandomValues = (length: number): number[] => {
    const values: number[] = [];
    for (let i = 0; i < length; i++) {
        values.push(Math.random() * 256);
    }
    return values;
};

export const generateUnsecureRandomString = async (lengthInBytes: number): Promise<string> => {
    const randomBytes = generateMathRandomValues(lengthInBytes);
    return randomBytes.reduce<string>(
        (acc, value) => acc + ('0' + value.toString(16)).slice(-2),
        '',
    );
};

export const getUnsecureRandomStrings = async (arrayLength: number): Promise<string[]> => {
    return new Promise<string[]>( async (resolve, reject) => {
        const randoms = new Array(arrayLength);
        for (let i = 0; i < arrayLength; i++) {
            randoms[i] = await generateUnsecureRandomString(32);
        }
        resolve(randoms);
    });
};
