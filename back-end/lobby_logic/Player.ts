import { Socket } from "socket.io";
import { LobbyTypes } from "./LobbyService";
import { Lobby } from "./Lobby";
import { GameId } from "./Game";

export type PlayerId = string;

export class Player {
    id: PlayerId;
    private socket: Socket;
    private currentLobby: Lobby | undefined;
    currentGameId: GameId | undefined;

    constructor (socket: Socket) {
        this.id = "test";
        this.socket = socket;
    }

    joinLobby(lobby: Lobby) {
        this.currentLobby = lobby;
        this.socket.join(lobby.name);
    }

    leaveLobby(toJoinGame: boolean) {
        if (this.currentLobby) {
            this.socket.leave(this.currentLobby.name);
            this.currentLobby = undefined;
        }

        if (!toJoinGame) {
            this.socket.emit("left_lobby");
        }
    }

    gameStarted(gameId: GameId) {
        this.currentGameId = gameId;
        this.socket.emit("game_started", gameId);
    }

    gameChat(text: string) {
        this.socket.emit("game_chat", text);
    }

    gameEnded() {
        this.socket.emit("game_ended");
    }
}