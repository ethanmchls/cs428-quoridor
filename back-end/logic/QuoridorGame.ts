import { Player } from "lobby_logic/Player";
import { QuoridorBoard } from "./QuoridorBoard";
import { QuoridorPlayer } from "./QuoridorPlayer";
import { PawnLocation, QuoridorMove, WallLocation } from "./QuoridorMove";
import { GameSendType } from "lobby_logic/send-types";

const MAX_WALLS = 10;

export class QuoridorGame {
    currentTurn: number = 0;
    numPlayers: number;
    players: QuoridorPlayer[];
    currentBoard: QuoridorBoard;

    constructor(players: QuoridorPlayer[]) {
        this.players = players;
        this.numPlayers = players.length;
        this.currentBoard = new QuoridorBoard();
    }

    setNextTurn() {
        this.currentTurn = (this.currentTurn + 1) % this.numPlayers;
    }

    isCorrectPlayer(player: Player) {
        return player.id === this.players[this.currentTurn]?.player.id;
    }

    takeTurn(player: Player, move: QuoridorMove) {
        const currentPlayer = this.players[this.currentTurn];

        if (!currentPlayer) {
            throw new Error("No player for current turn.");
        }

        if (!this.isCorrectPlayer(player)) {
            throw new Error("It's not your turn.");
        }


        if (move.pawnMove) {
            this.handlePawnMove(currentPlayer, move.pawnMove);
        }
        else if (move.wallMove) {
            this.handleWallMove(currentPlayer, move.wallMove);
        }

        this.setNextTurn();
    }

    // TODO: handle case of jumping over pawn:
    // If adjacent to another pawn, the pawn may jump over that pawn. If that square is not accessible (e.g., off the edge of the board or blocked by a third pawn or a wall), the player may move to either space that is immediately adjacent (left or right) to the first pawn

    // RULE: a wall may not be placed which cuts off the only remaining path of any pawn to the side of the board it must reach
    // to check if the pawn is not trapped, visit every available move until we reach the goal.
    // if every available space has been visited, it is trapped
    isPawnNotTrapped(currentPlayer: QuoridorPlayer): boolean {
        function checkTrappedPawnHelper(pawn: PawnLocation, moves: PawnLocation[], visited: PawnLocation[]): boolean {
            if (pawn.r === currentPlayer.goal) {
                return true;
            }

            for (let i = 0; i < moves.length; i++) {
                const move = moves[i]!;
                if (!visited.some((p) => p.r === move.r && p.c === move.c)) {
                    const newMoves = this.getAvailablePawnMoves(move);
                    // console.log("New moves: ", newMoves);
                    const isNotTrapped = checkTrappedPawnHelper.bind(this)(move, newMoves, [...visited, move]);
                    if (isNotTrapped) {
                        return true;
                    }
                }
            };

            return false;
        }

        const moves = this.getAvailablePawnMoves(currentPlayer.pawn);

        console.log("Available moves: ", moves);
        console.log("Walls: ", this.currentBoard.walls);
        return checkTrappedPawnHelper.bind(this)(currentPlayer.pawn, moves, []);
    }

    getAvailablePawnMoves(pawn: PawnLocation): PawnLocation[] {
        const r = pawn.r;
        const c = pawn.c;
        const moves = [];
        const isBlockedLeft = this.currentBoard.hasWall(r, c - 1);
        const isBlockedRight = this.currentBoard.hasWall(r, c + 1);
        const isBlockedUp = this.currentBoard.hasWall(r - 1, c);
        const isBlockedDown = this.currentBoard.hasWall(r + 1, c);
        if (r > 0 && !isBlockedUp) {
            moves.push({r: r - 2, c: c});
        }
        if (r < 16 && !isBlockedDown) {
            moves.push({r: r + 2, c: c});
        }
        if (c > 0 && !isBlockedLeft) {
            moves.push({r: r, c: c - 2});
        }
        if (c < 16 && !isBlockedRight) {
            moves.push({r: r, c: c + 2});
        }

        return moves;
    }

    handlePawnMove(currentPlayer: QuoridorPlayer, move: PawnLocation) {
        const r = currentPlayer.pawn.r;
        const c = currentPlayer.pawn.c;

        const isBlockedLeft = this.currentBoard.hasWall(r, c - 1);
        const isBlockedRight = this.currentBoard.hasWall(r, c + 1);
        const isBlockedUp = this.currentBoard.hasWall(r - 1, c);
        const isBlockedDown = this.currentBoard.hasWall(r + 1, c);

        console.log("new move: ", move);
        console.log("Current pos: ", currentPlayer.pawn);
        console.log("Blocked: ", {
            isBlockedLeft,
            isBlockedRight,
            isBlockedUp,
            isBlockedDown,
        })
        if (!(
            (r > 0 && !isBlockedUp && r - 2 != move.r && c != move.c) ||
            (r < 16 && !isBlockedDown && r + 2 != move.r && c != move.c) ||
            (c > 0 && !isBlockedLeft && r != move.r && c - 2 != move.c) ||
            (c < 16 && !isBlockedRight && r != move.r && c + 2 != move.c)
        )) {
            throw new Error("Invalid pawn move.");
        }

        currentPlayer.pawn.r = move.r;
        currentPlayer.pawn.c = move.c;
    }

    handleWallMove(currentPlayer: QuoridorPlayer, move: WallLocation) {
        if (currentPlayer.placedWalls >= MAX_WALLS) {
            throw new Error("You've placed all your walls.");
        }
        console.log("Fot move: ", move);

        const r = move.r;
        const c = move.c;
        const isVerticalWall = (r % 2 === 0);
        const isHorizontalWall = (c % 2 === 0);
        const isBlockedLeft = this.currentBoard.hasWall(r, c - 1) || (this.currentBoard.hasWall(r, c - 2) && (isHorizontalWall));
        const isBlockedRight = this.currentBoard.hasWall(r, c + 1) || (this.currentBoard.hasWall(r, c + 2) && (isHorizontalWall));
        const isBlockedUp = this.currentBoard.hasWall(r - 1, c) || (this.currentBoard.hasWall(r - 2, c) && (isVerticalWall));
        const isBlockedDown = this.currentBoard.hasWall(r + 1, c) || (this.currentBoard.hasWall(r + 2, c) && (isVerticalWall));

        const newWalls = [];
        // Frontend logic to check if wall placement is valid. Does not check for player pawn blocking
        // If wall is a corner, place wall horizontally by default
        if (!isVerticalWall && !isHorizontalWall && !isBlockedLeft && !isBlockedRight && c > 0) {
            newWalls.push({ r: r, c: c });
            newWalls.push({ r: r, c: c + 1 });
            newWalls.push({ r: r, c: c - 1 });
        }
        // If the wall is a corner and is blocked on the left/right, place wall vertically
        else if (!isVerticalWall && !isHorizontalWall && ((isBlockedRight || isBlockedLeft) && (!isBlockedUp && !isBlockedDown))) {
            newWalls.push({ r: r, c: c });
            newWalls.push({ r: r - 1, c: c });
            newWalls.push({ r: r + 1, c: c });
        }
        // If the wall is a vertical edge and is not blocked down, place vertically down by default
        else if (isVerticalWall && !isHorizontalWall && r < 16 && !isBlockedDown) {
            newWalls.push({ r: r, c: c });
            newWalls.push({ r: r + 1, c: c });
            newWalls.push({ r: r + 2, c: c });
        }
        // If the wall is a vertical edge and is blocked down, place vertically up
        else if (
            (isVerticalWall && !isHorizontalWall && r === 16 && !isBlockedUp) ||
            (isVerticalWall && !isHorizontalWall && r < 16 && isBlockedDown && !isBlockedUp && r > 0)
        ) {
            newWalls.push({ r: r, c: c });
            newWalls.push({ r: r - 1, c: c });
            newWalls.push({ r: r - 2, c: c });
        }
        // If the wall is a horizontal edge and is not blocked right, place horizontally right by default
        else if (isHorizontalWall && !isVerticalWall && c < 16 && !isBlockedRight) {
            newWalls.push({ r: r, c: c });
            newWalls.push({ r: r, c: c + 1 });
            newWalls.push({ r: r, c: c + 2 });
        }
        // If the wall is a horizontal edge and is blocked right, place horizontally left
        else if (
            (isHorizontalWall && !isVerticalWall && c === 16 && !isBlockedLeft) ||
            (isHorizontalWall && !isVerticalWall && c < 16 && isBlockedRight && !isBlockedLeft && c > 0)
        ) {
            newWalls.push({ r: r, c: c });
            newWalls.push({ r: r, c: c - 1 });
            newWalls.push({ r: r, c: c - 2 });
        }

        if (newWalls.length > 0) {
            const prevWalls = [...this.currentBoard.walls];
            this.currentBoard.walls = prevWalls.concat(newWalls);
            if (!this.players.every((player) => this.isPawnNotTrapped(player))) {
                throw new Error("Cannot place wall at that location, it would trap a player.");
            }
            currentPlayer.placedWalls++;
            return;
        }

        // If the wall is blocked otherwise, do not place the wall
        console.log("Invalid wall state: ", {
            isVerticalWall,
            isHorizontalWall,
            isBlockedLeft,
            isBlockedRight,
            isBlockedUp,
            isBlockedDown,
        });
        throw new Error("Invalid wall location");
    }

    getGameData(): GameSendType {
        return {
            currentTurn: this.currentTurn,
            pawns: this.players.map((player) => player.pawn),
            walls: this.currentBoard.walls,
            playerMoves: this.players.map((player) => this.getAvailablePawnMoves(player.pawn)),
            numWalls: this.players.map((player) => MAX_WALLS - player.placedWalls),
        }
    }
}