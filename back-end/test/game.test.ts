import { describe, it, expect, beforeEach, spyOn, beforeAll } from 'bun:test';
import { Game } from 'lobby_logic/Game';
import { Player } from 'lobby_logic/Player';
import { Server, Socket } from 'socket.io';
import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc } from "socket.io-client";

describe('Game', () => {
    let player1: Player;
    let player2: Player;
    let game: Game;
    let serverSocket: Socket;

    beforeAll((done) => {
        const httpServer = createServer();
        let io = new Server(httpServer);
        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            let clientSocket = ioc(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    beforeEach(() => {
        player1 = new Player(serverSocket);
        player2 = new Player(serverSocket);
        game = new Game([player1, player2]);
    });

    it('should initialize with a unique ID and send game start messages to players', () => {
        expect(game.id).toBeDefined();
        expect(player1.currentGameId).toBe(game.id);
        expect(player2.currentGameId).toBe(game.id);
    });

    it('should send game chat messages to all players', () => {
        const chatMessage = 'Hello, this is a test message';
        const gameChatSpy1 = spyOn(player1.socket, 'emit');
        const gameChatSpy2 = spyOn(player2.socket, 'emit');

        game.sendGameChat(chatMessage);

        expect(gameChatSpy1).toHaveBeenCalledWith('game_chat', chatMessage);
        expect(gameChatSpy2).toHaveBeenCalledWith('game_chat', chatMessage);
    });

    it('should send game end messages to all players', () => {
        const gameEndedSpy1 = spyOn(player1.socket, 'emit');
        const gameEndedSpy2 = spyOn(player2.socket, 'emit');

        game.sendEndGame();

        expect(gameEndedSpy1).toHaveBeenCalledWith('game_ended');
        expect(gameEndedSpy2).toHaveBeenCalledWith('game_ended');
    });
});
