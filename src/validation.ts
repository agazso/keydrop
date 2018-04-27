export const isTimestampValid = (timestamp: number, now: number = Date.now()): boolean => {
    const TimestampValidityMillis = 60 * 1000;
    return timestamp < now + TimestampValidityMillis;
};
