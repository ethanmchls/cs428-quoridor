// Player object used to store player information
export class Player {
  constructor(playerNum, pawnPos, nWalls) {
    this.playerNum = playerNum;
    this.pawnPos = pawnPos;
    this.nWalls = nWalls;
    this.moves = [];
    // this.getAdjacentCells = (placedWalls) => {
    //   let r = this.pawnPos[0];
    //   let c = this.pawnPos[1];
    //   let moves = [];
    //   let isBlockedLeft = placedWalls.includes(`${r}-${c - 1}`);
    //   let isBlockedRight = placedWalls.includes(`${r}-${c + 1}`);
    //   let isBlockedUp = placedWalls.includes(`${r - 1}-${c}`);
    //   let isBlockedDown = placedWalls.includes(`${r + 1}-${c}`);
    //   if (r > 0 && !isBlockedUp) {
    //     moves.push(`${r - 2}-${c}`);
    //   }
    //   if (r < 16 && !isBlockedDown) {
    //     moves.push(`${r + 2}-${c}`);
    //   }
    //   if (c > 0 && !isBlockedLeft) {
    //     moves.push(`${r}-${c - 2}`);
    //   }
    //   if (c < 16 && !isBlockedRight) {
    //     moves.push(`${r}-${c + 2}`);
    //   }
    //   this.moves = moves;
    // }
    // this.getAdjacentCells([]);
  }
}