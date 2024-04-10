import { QuoridorGame } from "../logic/QuoridorGame";
import { generateUuid } from "../util/uuid";
import { Player } from "./Player";
import { QuoridorPlayer } from "../logic/QuoridorPlayer";
import { QuoridorMove } from "../logic/QuoridorMove";

export type GameId = string;

export class Game {
    id: GameId;
    players: Player[];
    game: QuoridorGame;

    constructor(players: Player[]) {
        this.id = generateUuid();
        this.players = players;
        this.game = new QuoridorGame(players.map((player, i) => new QuoridorPlayer(player, 0, {r: i===0 ? 0 : 16, c: 8})));
        this.sendStartGame();
        this.sendCurrentGameData();
    }

    takeTurn(player: Player, move: QuoridorMove) {
        this.game.takeTurn(player, move);
    }

    sendCurrentGameData() {
        const gameData = this.game.getGameData();

        this.players.forEach((player, i) => {
            gameData.playerIndex = i;
            player.currentGameData(gameData);
        });
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

    sendPlayerDisconnected() {
        this.players.forEach((player) => {
            player.otherDisconnected();
        });
    }

    sendEndGame() {
        this.players.forEach((player) => {
            player.gameEnded();
        });
    }
}