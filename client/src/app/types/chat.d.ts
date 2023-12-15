declare type Message = {
    event: string;
    origin: "self" | "other";
    timestamp: number | string;
    chatId: string;
    from: string;
    to: string;
    message: {
        "type": string;
        "content": string;
    }
    meta: {
        group: boolean;
    }
}

