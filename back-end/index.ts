import http from "http";
import express from "express";
import { Server, Socket } from "socket.io";
import path from "path";
import cors from "cors";
import { Player } from "./lobby_logic/Player";
import { LobbyService, LobbyTypes } from "./lobby_logic/LobbyService";

const app = express();

app.use(cors());

const httpserver = new http.Server(app);
const io = new Server(httpserver, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
}); 

const gamedirectory = path.join(__dirname, "public");

app.use(express.static(gamedirectory));

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

	socket.on('joinLobby', (type: LobbyTypes) => {
		try {
			lobbyService.joinLobby(player, type);
		}
		catch (err) {
			handleError(err, socket);
		}
	})

	socket.on('disconnect', () => {
		console.log("Player disconnected: ", player.id);
		lobbyService.incrementConnectedPlayers(-1);
	});
});

function handleError(err: any, socket: Socket) {
	console.error("Handling error: ", err);
	try {
		io.to(socket.id).emit("player error", err.message ?? "An unknown server error occurred.");
	}
	catch (err2) {
		console.error("Couldn't send error message: ", err2);
	}
}