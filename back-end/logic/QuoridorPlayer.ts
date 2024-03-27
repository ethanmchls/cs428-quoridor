import { Player } from "lobby_logic/Player";
import { PawnLocation } from "./QuoridorMove";

export class QuoridorPlayer {
    player: Player;
    placedWalls: number;
    pawn: PawnLocation;
    goal: number;

    constructor (player: Player, placedWalls: number, pawn: PawnLocation) {
        this.player = player;
        this.placedWalls = placedWalls;
        this.pawn = pawn;
        this.goal = pawn.r === 0 ? 16 : 0;
    }
}