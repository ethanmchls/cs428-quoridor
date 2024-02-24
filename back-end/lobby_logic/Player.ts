import { Socket } from "socket.io";
import { Lobby } from "./Lobby";
import { GameId } from "./Game";
import { generateUuid } from "../util/uuid";
import { LobbySendType } from "./send-types";

export type PlayerId = string;

export class Player {
    id: PlayerId;
    socket: Socket;
    currentLobby: Lobby | undefined;
    currentGameId: GameId | undefined;

    constructor (socket: Socket) {
        this.id = generateUuid();
        this.socket = socket;
    }

    joinLobby(lobby: Lobby) {
        this.currentLobby = lobby;
        this.socket.join(lobby.name);
    }

    leaveLobby(toJoinGame: boolean) {
        if (!this.currentLobby) return;

        const name = this.currentLobby.name;
        this.socket.leave(this.currentLobby.name);
        this.currentLobby = undefined;

        if (!toJoinGame) {
            this.socket.to(name).emit("leftLobby", this.id);
        }
    }

    gameStarted(gameId: GameId) {
        this.currentGameId = gameId;
        this.socket.emit("gameStarted", gameId);
    }

    gameChat(text: string) {
        this.socket.emit("gameChat", text);
    }

    gameEnded() {
        this.socket.emit("gameEnded");
    }

    isInRoom(room: string) {
        return this.socket.rooms.has(room);
    }

    sendLobbies(lobbies: LobbySendType[]) {
        this.socket.emit("lobbies", lobbies);
    }

    toShareable() {
        return {
            id: this.id,
        };
    }
}