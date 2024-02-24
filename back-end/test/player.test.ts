import { Socket, Server } from 'socket.io';
import { describe, beforeAll, afterAll, expect, it, spyOn } from 'bun:test';
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { Lobby } from 'lobby_logic/Lobby';
import { Player } from 'lobby_logic/Player';

describe('Player', () => {
    let io: Server, serverSocket: Socket, clientSocket: ClientSocket;

    beforeAll((done) => {
        const httpServer = createServer();
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
        expect(player.isInRoom("TestLobby")).toBeTrue();
    });

    it("should not emit 'left_lobby' when leaving a lobby to join a game", () => {
        const player = new Player(serverSocket);
        const lobby = new Lobby(2, "TestLobby");
        player.joinLobby(lobby);

        const leaveLobbySpy = spyOn(player.socket, 'emit');
        player.leaveLobby(true);

        expect(player.currentLobby).toBeUndefined();
        expect(leaveLobbySpy).not.toHaveBeenCalled();
    });

    it("should emit 'left_lobby' when leaving a lobby", () => {
        const player = new Player(serverSocket);
        const lobby = new Lobby(2, "TestLobby");
        player.joinLobby(lobby);

        const leaveLobbySpy = spyOn(player.socket, 'emit');
        player.leaveLobby(false);

        expect(player.currentLobby).toBeUndefined();
        expect(leaveLobbySpy).toHaveBeenCalledWith("left_lobby");
    });


    it("should be able to start a game and emit 'game_started'", () => {
        const player = new Player(serverSocket);
        const gameId = "TestGameId";

        const gameStartedSpy = spyOn(player.socket, 'emit');
        player.gameStarted(gameId);

        expect(player.currentGameId).toBe(gameId);
        expect(gameStartedSpy).toHaveBeenCalledWith("game_started", gameId);
    });

    it("should be able to send a game chat message", () => {
        const player = new Player(serverSocket);
        const chatMessage = "Hello, this is a test message";

        const gameChatSpy = spyOn(player.socket, 'emit');
        player.gameChat(chatMessage);

        expect(gameChatSpy).toHaveBeenCalledWith("game_chat", chatMessage);
    });

    it("should be able to emit 'game_ended' when the game ends", () => {
        const player = new Player(serverSocket);

        const gameEndedSpy = spyOn(player.socket, 'emit');
        player.gameEnded();

        expect(gameEndedSpy).toHaveBeenCalledWith("game_ended");
    });
});