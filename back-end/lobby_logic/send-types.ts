import { PawnLocation, WallLocation } from "logic/QuoridorMove";

export type LobbySendType = {
    maxPlayers: number;
    currentPlayers: {
        id: string;
    }[];
}

export type GameSendType = {
    currentTurn: number,
    playerIndex: number,
    pawns: PawnLocation[],
    walls: WallLocation[],
    playerMoves: PawnLocation[][],
    numWalls: number[],
}