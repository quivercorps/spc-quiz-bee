export interface User {
    userId: string;
    userName: string;
    socketId: string;
}
export interface Lobby {
    lobbyId?: string;
    name: string;
    host: User;
    inviteCode?: string;
    users: User[];
}

export interface Message {
    user: User;
    timeSent: string;
    message: string;
    lobbyId: string;
    lobbyName?: string;
}

export interface ServerToClientEvents {
    chat: (e: Message) => void
}

export interface ClientToServerEvents {
    chat: (e: Message) => void
    join_room: (e: {user: User; lobbyId: string }) => void
}