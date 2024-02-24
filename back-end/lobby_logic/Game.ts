import { generateUuid } from "../util/uuid";
import { Player } from "./Player";

export type GameId = string;

export class Game {
    id: GameId;
    players: Player[];

    constructor(players: Player[]) {
        this.id = generateUuid();
        this.players = players;
        this.sendStartGame();
    }

    sendStartGame() {
        this.players.forEach((player) => {
            player.gameStarted(this.id);
        });
    }

    sendGameChat(text: string) {
        this.players.forEach((player) => {
            player.gameChat(text);
        });
    }

    sendEndGame() {
        this.players.forEach((player) => {
            player.gameEnded();
        });
    }
}