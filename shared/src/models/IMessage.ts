export interface IMessage {
    id: number;         // Unique identifier for the message
    chatId: number;     // Reference to the chat this message belongs to
    senderId: number;   // Unique identifier for the user who sent the message
    message: string;    // The message content
    timestamp: Date;    // The date and time the message was sent
}

export interface IChat {
    id: number;             // Unique identifier for the chat
    users: number[];        // Array of unique identifiers for the users in the chat
    messages?: IMessage[];  // Array of messages in the chat
    lastMessage: string;    // The content of the last message in the chat
}