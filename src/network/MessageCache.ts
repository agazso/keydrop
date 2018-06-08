interface MessageMetadata {
    timestamp: number;
}
let seenMessageIds: Map<string, MessageMetadata> = new Map();

export const cleanupOldMessages = (timestamp: number) => {
    const newSeenMessageIds = new Map<string, MessageMetadata>();
    for (const keyValue of seenMessageIds) {
        if (keyValue[1].timestamp >= timestamp) {
            newSeenMessageIds.set(keyValue[0], keyValue[1]);
        }
    }
    seenMessageIds = newSeenMessageIds;
};

export const testAndSetMessage = (messageId: string, timestamp: number) => {
    const hasSeenMessage = seenMessageIds.has(messageId);
    const messageMetadata = {
        timestamp,
    };
    seenMessageIds.set(messageId, messageMetadata);
    return hasSeenMessage;
};
