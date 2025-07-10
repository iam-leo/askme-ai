export interface ChatMessage {
    from: 'user' | 'ai';
    content: string;
    timestamp: Date;
}
