export const hexToString = (hex: string): string => {
    const hexWithoutPrefix = hex.startsWith('0x') ? hex.slice(2) : hex;
    const subStrings: string[] = [];
    for (let i = 0; i < hexWithoutPrefix.length; i += 2) {
        subStrings.push(hexWithoutPrefix.substr(i, 2));
    }
    const numbers = subStrings.map(s => parseInt(s, 16));
    if (String.fromCodePoint != null) {
        return String.fromCodePoint(...numbers);
    } else {
        return String.fromCharCode(...numbers);
    }
};

// cheekily borrowed from https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript
export const toHexString = (byteArray: Array<number>) => {
    return Array.from(byteArray, (byte) => {
        // tslint:disable-next-line:no-bitwise
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};

// equally cheekily borrowed from https://stackoverflow.com/questions/17720394/javascript-string-to-byte-to-string
export const string2Bin = (str: string) => {
    const result = new Array<number>();
    for (let i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
};
