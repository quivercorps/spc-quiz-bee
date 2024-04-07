export interface Player {
    playerId: string;
    playerName: string;
    socketId: string;
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
    lobbyName?: string;
}

export interface ServerToClientEvents {
    chat: (e: Message) => void
}

export interface ClientToServerEvents {
    chat: (e: Message) => void
    join_room: (e: {player: Player; lobbyId: string }) => void
}