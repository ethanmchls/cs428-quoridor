import { WallLocation } from "./QuoridorMove";

export class QuoridorBoard {
    walls: WallLocation[];

    constructor () {
        this.walls = [];
    }

    hasWall(r: number, c: number): boolean {
        return this.walls.some((w) => w.r === r && w.c === c);
    }
}