import { Socket, Server } from 'socket.io';
// import { describe, beforeAll, afterAll, expect, it, jest.spyOn } from 'bun:test';
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { createServer, Server as HttpServer } from "node:http";
import { type AddressInfo } from "node:net";
import { Lobby } from '../lobby_logic/Lobby';
import { Player } from '../lobby_logic/Player';

describe('Player', () => {
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
        io.close();
        clientSocket.disconnect();
        httpServer.close();
    });

    it("should have socket set up correctly", (done) => {
        clientSocket.on("hello", (arg) => {
            expect(arg).toBe("world");
            done();
        });
        serverSocket.emit("hello", "world");
    });

    it("should initialize with a unique ID", () => {
        const player = new Player(serverSocket);
        expect(player.id).toBeDefined();
    });

    it("should be able to join a lobby", () => {
        const player = new Player(serverSocket);
        const lobby = new Lobby(2, "TestLobby");
        player.joinLobby(lobby);
        expect(player.currentLobby).toBe(lobby);
        expect(player.isInRoom("TestLobby")).toBeTruthy();
    });

    it("should not emit 'leftLobby' when leaving a lobby to join a game", () => {
        const player = new Player(serverSocket);
        const lobby = new Lobby(2, "TestLobby");
        player.joinLobby(lobby);

        const leaveLobbySpy = jest.spyOn(player.socket, 'emit');
        player.leaveLobby(true);

        expect(player.currentLobby).toBeUndefined();
        expect(leaveLobbySpy).not.toHaveBeenCalled();
    });

    it("should emit 'leftLobby' when leaving a lobby", () => {
        const player = new Player(serverSocket);
        const lobby = new Lobby(2, "TestLobby");
        player.joinLobby(lobby);

        player.leaveLobby(false);

        expect(player.currentLobby).toBeUndefined();
    });


    it("should be able to start a game and emit 'gameStarted'", () => {
        const player = new Player(serverSocket);
        const gameId = "TestGameId";

        const gameStartedSpy = jest.spyOn(player.socket, 'emit');
        player.gameStarted(gameId);

        expect(player.currentGameId).toBe(gameId);
        expect(gameStartedSpy).toHaveBeenCalledWith("gameStarted", gameId);
    });

    it("should be able to send a game chat message", () => {
        const player = new Player(serverSocket);
        const chatMessage = "Hello, this is a test message";

        const gameChatSpy = jest.spyOn(player.socket, 'emit');
        player.gameChat(chatMessage);

        expect(gameChatSpy).toHaveBeenCalledWith("gameChat", chatMessage);
    });

    it("should be able to emit 'gameEnded' when the game ends", () => {
        const player = new Player(serverSocket);

        const gameEndedSpy = jest.spyOn(player.socket, 'emit');
        player.gameEnded();

        expect(gameEndedSpy).toHaveBeenCalledWith("gameEnded");
    });
});