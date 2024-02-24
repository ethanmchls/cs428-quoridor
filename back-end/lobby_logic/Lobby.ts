import { Game } from "./Game";
import { Games } from "./Games";
import { Player } from "./Player";
import { LobbySendType } from "./send-types";


export class Lobby {
    maxPlayers: number;
    currentPlayers: Player[] = [];
    name: string;

    constructor (maxPlayers: number, name: string) {
        this.maxPlayers = maxPlayers;
        this.name = name;
    }

    clear() {
        this.currentPlayers.forEach((player) => {
            player.leaveLobby(true);
        });
        this.currentPlayers = [];
    }

    createGame() {
        if (!this.isFull()) {
            throw Error("Lobby is not full yet");
        }
        Games.getInstance().create(new Game(this.currentPlayers));
        this.clear();
    }

    isFull() {
        return this.currentPlayers.length >= this.maxPlayers;
    }

    joinLobby(player: Player) {
        if (this.isFull()) {
            throw Error("Lobby is full");
        }
        this.currentPlayers.push(player);
    }

    leaveLobby(player: Player) {
        this.currentPlayers = this.currentPlayers.filter((checkPlayer) => checkPlayer.id != player.id);
    }

    toShareable(): LobbySendType {
        return {
            maxPlayers: this.maxPlayers,
            currentPlayers: this.currentPlayers.map((player) => player.toShareable()),
        }
    }
}