import type { Quiz } from "./quiz.interface";

export interface User {
    email: string;
    id: string;
    userName: string;
}

export interface Player {
    _id: string;
    name: string;
    score: number;
    answer?: string;
}
export interface PlayerCookie {
    playerId: string;
    playerName: string;
}
export interface Lobby {
    _id: string;
    code: string;
    host: string;
    quiz: Quiz;
    lobbyStatus: string;
    players: Player[]
}

export interface FindLobby {
    player: Player;
    lobbyId: string;
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