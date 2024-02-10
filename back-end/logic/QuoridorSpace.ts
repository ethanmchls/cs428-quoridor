export class QuoridorSpace {
    pawn: number | undefined;
    isEastWalled: boolean;
    isNorthWalled: boolean;

    constructor () {
        this.isEastWalled = false;
        this.isNorthWalled = false;
    }
}