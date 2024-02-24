// import { describe, it, expect, beforeEach, jest.spyOn, beforeAll } from 'bun:test';
import { Game } from '../lobby_logic/Game';
import { Games } from '../lobby_logic/Games';
import { Lobby } from '../lobby_logic/Lobby';
import { Player } from '../lobby_logic/Player';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";

describe('Lobby', () => {
    let lobby: Lobby;
    let player1: Player;
    let player2: Player;
    let io: Server, serverSocket: Socket, clientSocket: ClientSocket, httpServer: HttpServer;

    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = ioc(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        httpServer.close();
        io.close();
        clientSocket.disconnect();
    });

    beforeEach(() => {
        lobby = new Lobby(2, 'TestLobby');
        player1 = new Player(serverSocket);
        player2 = new Player(serverSocket);
    });

    it('should initialize with the correct maxPlayers and name', () => {
        expect(lobby.maxPlayers).toBe(2);
        expect(lobby.name).toBe('TestLobby');
    });

    it('should join a player to the lobby', () => {
        lobby.joinLobby(player1);

        expect(lobby.currentPlayers.length).toBe(1);
        expect(lobby.currentPlayers).toContain(player1);
    });

    it('should throw an error when joining a player to a full lobby', () => {
        lobby.joinLobby(player1);
        lobby.joinLobby(player2);

        expect(() => lobby.joinLobby(new Player(serverSocket))).toThrow();
    });

    it('should leave a player from the lobby', () => {
        lobby.joinLobby(player1);
        lobby.joinLobby(player2);

        lobby.leaveLobby(player1);

        expect(lobby.currentPlayers.length).toBe(1);
        expect(lobby.currentPlayers).toContain(player2);
    });

    it('should create a game when the lobby is full and clear players', () => {
        lobby.joinLobby(player1);
        lobby.joinLobby(player2);

        const createGameSpy = jest.spyOn(Games.getInstance(), 'create');
        lobby.createGame();

        expect(createGameSpy).toHaveBeenCalledWith(expect.any(Game));
        expect(lobby.currentPlayers.length).toBe(0);
    });

    it('should throw an error when creating a game in a non-full lobby', () => {
        lobby.joinLobby(player1);

        expect(() => lobby.createGame()).toThrow();
    });

    it('should correctly check if the lobby is full', () => {
        expect(lobby.isFull()).toBe(false);

        lobby.joinLobby(player1);

        expect(lobby.isFull()).toBe(false);

        lobby.joinLobby(player2);

        expect(lobby.isFull()).toBe(true);
    });

    it('should clear players when calling the clear method', () => {
        lobby.joinLobby(player1);
        lobby.joinLobby(player2);

        lobby.clear();

        expect(lobby.currentPlayers.length).toBe(0);
    });
});
