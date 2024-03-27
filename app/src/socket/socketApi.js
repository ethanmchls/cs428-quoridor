import { socket } from "./socket";

const getLobbyName = "getLobbies";
const joinLobbyName = "joinLobby";
const makeMoveName = "makeMove";

const connectedPlayersEvent = "connectedPlayers";
const getLobbiesEvent = "lobbies";
const gameEndedEvent = "gameEnded";
const gameStartedEvent = "gameStarted";
const leftLobbyEvent = "leftLobby";
const newGameDataEvent = "newGameData";
const playerErrorEvent = "playerError";

/**
 * Represents the structure of a lobby.
 *
 * @typedef {Object} Lobby
 * @property {number} maxPlayers - The maximum number of players allowed in the lobby.
 * @property {Object[]} currentPlayers - An array containing objects representing the current players in the lobby.
 * @property {string} currentPlayers.id - The unique identifier of a player.
 */

/**
 * Interface for Game data.
 * @typedef {Object} GameData
 * @property {number} currentTurn
 * @property {Array<PawnLocation>} pawns - The location of the pawn move.
 * @property {Array<WallLocation>} walls - The location of the wall move.
 * @property {Array<number>} numWalls - The number of walls each player has.
 * @property {Array<Array<PawnLocation>>} playerMoves - Each players' available moves.
 */

/**
 * Interface for a Quoridor move, which can be either a pawn move or a wall move.
 * @typedef {Object} QuoridorMove
 * @property {PawnLocation} [pawnMove] - The location of the pawn move.
 * @property {WallLocation} [wallMove] - The location of the wall move.
 */

/**
 * Interface for the location of a pawn on the Quoridor board.
 * @typedef {Object} PawnLocation
 * @property {number} r - The row number of the pawn's location.
 * @property {number} c - The column number of the pawn's location.
 */

/**
 * Interface for the location of a wall on the Quoridor board.
 * @typedef {Object} WallLocation
 * @property {number} r - The row number of the wall's location.
 * @property {number} c - The column number of the wall's location.
 */

/**
 * Retrieves the list of lobbies by emitting a "getLobbies" event.
 */
export function getLobbies() {
    socket.emit(getLobbyName);
}

/**
 * Joins a lobby by emitting a "joinLobby" event with an optional parameter specifying the lobby type.
 *
 * @param {boolean} [twoPlayer=true] - Whether to join a two-player lobby (default) or a four-player lobby.
 */
export function joinLobby(twoPlayer = true) {
    socket.emit(joinLobbyName, twoPlayer ? "twoPlayer" : "fourPlayer");
}

/**
 * Makes a move for the current player.
 * @param {QuoridorMove} move - Move the player wants to make.
 */
export function makeMove(move) {
    socket.emit(makeMoveName, move);
}

/**
 * Sets up a listener for the "connectedPlayers" event, triggering the provided function when a new player joins or disconnects.
 *
 * @param {function(number): void} f - A function that takes a number parameter representing the number of connected players.
 */
export function onConnectedPlayersChanged(f) {
    socket.on(connectedPlayersEvent, f);
}

/**
 * Sets up a listener for the "gotLobbies" event, triggering the provided function when the list of lobbies is received.
 *
 * @param {function(Array<Lobby>): void} f - A function that takes an array of lobby names as a parameter.
 */
export function onGotLobbies(f) {
    socket.on(getLobbiesEvent, f);
}

/**
 * Sets up a listener for the "gameEnded" event, triggering the provided function when the game has ended.
 *
 * @param {function(): void} f - A function that is called when the game has ended.
 */
export function onGameEnded(f) {
    socket.on(gameEndedEvent, f);
}

/**
 * Sets up a listener for the "gameStarted" event, triggering the provided function when the game has started.
 *
 * @param {function(): void} f - A function that is called when the game has started.
 */
export function onGameStarted(f) {
    socket.on(gameStartedEvent, f);
}

/**
 * Sets up a listener for the "leftLobby" event, triggering the provided function when a player leaves the lobby.
 *
 * @param {function(): void} f - A function that is called when a player leaves the lobby.
 */
export function onSomeoneLeftLobby(f) {
    socket.on(leftLobbyEvent, f);
}

/**
 *
 * @param {function(GameData): void} f - A function that is called when new game data is received.
 */
export function onNewGameData(f) {
    socket.on(newGameDataEvent, f);
}

/**
 *
 * @param {function(string): void} f - A function that is called when an error is received.
 */
export function onPlayerError(f) {
    socket.on(playerErrorEvent, f);
}

/**
 * Removes the listener for the "playerError" event.
 *
 * @param {function(string): void} f - The function to be removed from the listeners.
 */
export function offPlayerError(f) {
    socket.off(playerErrorEvent, f);
}

/**
 * Removes the listener for the "connectedPlayers" event.
 *
 * @param {function(number): void} f - The function to be removed from the listeners.
 */
export function offConnectedPlayersChanged(f) {
    socket.off(connectedPlayersEvent, f);
}

/**
 * Removes the listener for the "gotLobbies" event.
 *
 * @param {function(Array<Lobby>): void} f - The function to be removed from the listeners.
 */
export function offGotLobbies(f) {
    socket.off(getLobbiesEvent, f);
}

/**
 * Removes the listener for the "gameEnded" event.
 *
 * @param {function(): void} f - The function to be removed from the listeners.
 */
export function offGameEnded(f) {
    socket.off(gameEndedEvent, f);
}

/**
 * Removes the listener for the "gameStarted" event.
 *
 * @param {function(): void} f - The function to be removed from the listeners.
 */
export function offGameStarted(f) {
    socket.off(gameStartedEvent, f);
}

/**
 * Removes the listener for the "leftLobby" event.
 *
 * @param {function(): void} f - The function to be removed from the listeners.
 */
export function offSomeoneLeftLobby(f) {
    socket.off(leftLobbyEvent, f);
}

export function offNewGameData(f) {
    socket.off(newGameDataEvent, f);
}