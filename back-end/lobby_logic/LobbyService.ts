import { Server } from "socket.io";
import { Lobby } from "./Lobby";
import { Player } from "./Player";

export type LobbyTypes = "twoPlayer" | "fourPlayer";

export class LobbyService {
    lobbies: {[key: string]: Lobby};
    connectedPlayers: number;
    io: Server;

    constructor(io: Server) {
        this.io = io;
        this.lobbies = {
            twoPlayer: new Lobby(2, "lobby_twoPlayer"),
            fourPlayer: new Lobby(4, "lobby_fourPlayer"),
        }
        this.connectedPlayers = 0;
    }

    joinLobby(player: Player, type: LobbyTypes) {
        const lobby = this.lobbies[type];
        if (!lobby) {
            throw Error("Unknown lobby type");
        }
        lobby.joinLobby(player);
        player.joinLobby(lobby);
        if (lobby.isFull()) {
            lobby.createGame();
        }
    }

    leaveLobby(player: Player) {
        player.leaveLobby(false);
    }

    incrementConnectedPlayers(i: number) {
        this.connectedPlayers += i;
        this.updateConnectedPlayers();
    }

    private updateConnectedPlayers() {
        this.io.emit("connectedPlayers", this.connectedPlayers);
    }

    sendGetLobbies(player: Player) {
        player.sendLobbies(this.getLobbies());
    }

    private getLobbies() {
        return Object.values(this.lobbies).map((lobby) => lobby.toShareable());
    }
}