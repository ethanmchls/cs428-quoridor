import http from "http";
import express from "express";
import { Server, Socket } from "socket.io";
import path from "path";
import cors from "cors";

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

io.on('connection', (socket) => {
	console.log("Player connected: ", socket.id);
	var player: any = null;

	socket.on('test', (data) => {
		console.log("Test received: ", data);
	});

	socket.on('getPlayers', async (userInfo, callback) => {
		
	});

	socket.on('disconnect', async () => {

	});
});

function handleError(err: any, socket: Socket) {
	console.error("Handling error: ", err);
	try {
		io.to(socket.id).emit("player error", "An unknown server error occurred.");
	}
	catch (err2) {
		console.error("Couldn't send error message: ", err2);
	}
}