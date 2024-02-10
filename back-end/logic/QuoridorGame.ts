import { QuoridorBoard } from "./QuoridorBoard";
import { QuoridorPlayer } from "./QuoridorPlayer";

export class QuoridorGame {
    currentTurn: number = 0;
    players: QuoridorPlayer[];
    currentBoard: QuoridorBoard;

    constructor (players: QuoridorPlayer[]) {
        this.players = players;
        this.currentBoard = new QuoridorBoard();
    }

    
}