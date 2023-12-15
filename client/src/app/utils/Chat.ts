import { IFeeds, IMessageIPFS } from "@pushprotocol/restapi";

export const typeCastToMessage = (message: {
    content: IMessageIPFS | IFeeds,
    type: 'feed' | 'ipfsFeed'
}): Message => {
    if (message.type === 'ipfsFeed') {
        const {fromDID, toDID, messageType, messageObj, timestamp} = message.content as IMessageIPFS;
        const t = timestamp === undefined ? Date.now() : timestamp;
        return {
            event: 'message',
            origin: 'other',
            timestamp: t,
            chatId: fromDID,
            from: fromDID,
            to: toDID,
            message: {
                type: messageType,
                content: JSON.parse(JSON.stringify(messageObj)).content
            },
            meta: {
                group: false
            }
        }
    } else {
        const {msg} = message.content as IFeeds;
        const msg2 = typeCastToMessage({content: msg, type: 'ipfsFeed'});
        return msg2;
    }
}