export interface User {
    email: string;
    id: string;
    userName: string;
}

export interface Player {
    playerId: string;
    playerName: string;
    socketId: string;
}
export interface PlayerCookie {
    playerId: string;
    playerName: string;
}
export interface Lobby {
    lobbyId?: string;
    name: string;
    host: Player;
    inviteCode?: string;
    players: Player[];
}

export interface Message {
    player: Player;
    timeSent: string;
    message: string;
    lobbyId: string;
}

export interface ServerToClientEvents {
    chat: (e: Message) => void
}

export interface ClientToServerEvents {
    chat: (e: Message) => void
    join_room: (e: {player: Player; lobbyId: string }) => void
}