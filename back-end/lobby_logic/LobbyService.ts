import { Lobby } from "./Lobby";
import { Player } from "./Player";

export type LobbyTypes = "twoPlayer" | "fourPlayer";

export class LobbyService {
    player: Player;
    lobbies: {[key: string]: Lobby};

    constructor(player: Player) {
        this.player = player;
        this.lobbies = {
            twoPlayer: new Lobby(2, "lobby_twoPlayer"),
            fourPlayer: new Lobby(4, "lobby_fourPlayer"),
        }
    }

    joinLobby(type: LobbyTypes) {
        const lobby = this.lobbies[type];
        if (!lobby) {
            throw Error("Unknown lobby type");
        }
        lobby.joinLobby(this.player);
        this.player.joinLobby(lobby);
        if (lobby.isFull()) {
            lobby.createGame();
        }
    }
}