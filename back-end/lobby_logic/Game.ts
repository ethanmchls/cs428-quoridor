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
        this.game = new QuoridorGame(players.map((player, i) => new QuoridorPlayer(player, [], {r: i===0 ? 0 : 16, c: 8})));
        this.sendStartGame();
    }

    takeTurn(player: Player, move: QuoridorMove) {
        this.game.takeTurn(player, move);
    }

    sendCurrentGameData() {
        this.players.forEach((player) => {
            player.currentGameData(this.game.getGameData());
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

    sendEndGame() {
        this.players.forEach((player) => {
            player.gameEnded();
        });
    }
}