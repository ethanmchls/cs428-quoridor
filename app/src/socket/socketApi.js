import { socket } from "./socket";

const getLobbyName = "getLobbies";
const joinLobbyName = "joinLobby";
const connectedPlayersEvent = "connectedPlayers";
const getLobbiesEvent = "lobbies";
const gameEndedEvent = "gameEnded";
const gameStartedEvent = "gameStarted";
const leftLobbyEvent = "leftLobby";

/**
 * Represents the structure of a lobby.
 *
 * @typedef {Object} Lobby
 * @property {number} maxPlayers - The maximum number of players allowed in the lobby.
 * @property {Object[]} currentPlayers - An array containing objects representing the current players in the lobby.
 * @property {string} currentPlayers.id - The unique identifier of a player.
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
