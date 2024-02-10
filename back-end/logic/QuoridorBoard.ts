import { QuoridorSpace } from "./QuoridorSpace";

export class QuoridorBoard {
    spaces: QuoridorSpace[][] = [];

    constructor () {
        for (let y = 0; y < 9; y++) {
            this.spaces.push([]);
            for (let x = 0; x < 9; x++) {
                this.spaces[y].push(new QuoridorSpace());
            }
        }
    }
}