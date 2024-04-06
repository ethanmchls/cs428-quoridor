import http from "http";
import express from "express";
import { Server, Socket } from "socket.io";
import path from "path";
import cors from "cors";
import { Player } from "./lobby_logic/Player";
import { LobbyService, LobbyTypes } from "./lobby_logic/LobbyService";
import { QuoridorMove } from "./logic/QuoridorMove";
import { Games } from "./lobby_logic/Games";
import { Game } from "./lobby_logic/Game";

const app = express();

app.use(cors());

const httpserver = new http.Server(app);
const io = new Server(httpserver, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
}); 

const publicDirectory = process.env.PUBLIC_DIR || path.join(__dirname, "public");
console.log("Got directory: ", publicDirectory);

app.use(express.static(publicDirectory));

app.get("/", (_req, res) => {
    res.sendFile(path.join(publicDirectory, "index.html"));
});

httpserver.listen(3001, function() {
    console.log("Listening on port 3001");
});

const lobbyService = new LobbyService(io);

io.on('connection', (socket) => {
	var player: Player = new Player(socket);
	console.log("Player connected: ", player.id);
	lobbyService.incrementConnectedPlayers(1);

	socket.on('test', (data) => {
		console.log("Test received: ", data);
	});

	socket.on('getLobbies', () => {
		try {
			lobbyService.sendGetLobbies(player);
		}
		catch (err) {
			handleError(err, socket);
		}
	});

	socket.on('makeMove', (move: QuoridorMove) => {
		try {
			console.log("Got move: ", move);
			const game = getCurrentGame(player);
			game.takeTurn(player, move);
			game.sendCurrentGameData();
		}
		catch (err) {
			handleError(err, socket);
		}
	});

	socket.on('joinLobby', (type: LobbyTypes) => {
		try {
			console.log("Joining lobby");
			lobbyService.joinLobby(player, type);
		}
		catch (err) {
			handleError(err, socket);
		}
	})

	socket.on('disconnect', () => {
		console.log("Player disconnected: ", player.id);
		lobbyService.incrementConnectedPlayers(-1);
		try {
			const game = getCurrentGame(player);
			game.sendPlayerDisconnected();
			console.log("Notifying players about disconnect.");
		}
		catch (err) {
			console.log("No need to notify people, not in a game.");
		}
	});
});

function getCurrentGame(player: Player): Game {
	if (!player.currentGameId) {
		throw new Error("You are not currently in a game.");
	}
	const game = Games.getInstance().get(player.currentGameId);
	if (!game) {
		throw new Error("Could not find the current game.");
	}
	return game;
}

function handleError(err: any, socket: Socket) {
	console.error("Handling error: ", err);
	try {
		io.to(socket.id).emit("playerError", err.message ?? "An unknown server error occurred.");
	}
	catch (err2) {
		console.error("Couldn't send error message: ", err2);
	}
}