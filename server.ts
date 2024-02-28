import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import nocache from "nocache";
import dotenv from "dotenv";
//import { connect as mongoConnect } from "mongoose";
import { Server, Socket } from "socket.io";
import http from "http";
import path from "path";

dotenv.config();
let { MONGO_URI, PORT, HOST, CLIENT_PORT, CLIENT_HOST, DOMAIN } = process.env;

const app = express();

const allowedOrigins = [
	`http://${HOST}:${PORT}`,
	`http://127.0.0.1:${PORT}`,
	`http://${CLIENT_HOST}:${CLIENT_PORT}`,
];

const corsOptions: CorsOptions = {
	origin(requestOrigin, callback) {
		if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
	optionsSuccessStatus: 200, 
	credentials: true,
	preflightContinue: true,
	allowedHeaders: [
		"Accept",
		"Accept-Language",
		"Content-Language",
		"Content-Type",
		"Authorization",
		"Access-Control-Allow-Origin",
	],
}

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../client/dist'), {index: false}));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const server = http.createServer(app);

//socket io
const io = new Server(server, {
	cors: corsOptions,
	transports: ["websocket", "polling"],
	allowEIO3: true,
});

//chat and video configuration
io.on("connection", async (socket: Socket) => {
	socket.on("joinApp", (username: string) => {
		socket.join(username);
	});
	socket.on("leaveApp", (username: string) => {
		socket.leave(username);
	});

	socket.on("joinChat", (name: string) => {
		socket.join(name);
	});
	socket.on("leaveChat", (name: string) => {
		socket.leave(name);
	});

	//video call
	socket.on("requestVideoCall", (data: { from: string; to: string }) => {
		io.to(data.to).emit("receiveVideoCallRequest", data.from);
	});
	socket.on("rejectVideoCall", (data: { from: string; to: string }) => {
		io.to(data?.to + data?.from).emit("receiveVideoCallRejection", data?.from);
	});
	socket.on("acceptVideoCall", (data: { from: string; to: string }) => {
		io.to(data.to).emit("receiveVideoCallAcceptance", data?.from);
	});
	socket.on("sendStopCall", (data: { from: string; to: string }) => {
		io.to(data?.to).emit("receiveStopCall", data?.from);
	});
	socket.on("sendEndCall", (data: { from: string; to: string }) => {
		io.to(data?.to).emit("receiveEndCall", data?.from);
	});

	interface Data {
		offer?: RTCSessionDescription;
		answer?: RTCSessionDescription;
		candidate?: RTCIceCandidate;
		to: string;
	}

	socket.on("sendSignal", (data: Data) => {
		io.to(data.to).emit("receiveSignal", data);
	});
});

server.listen(typeof PORT === "number" ? PORT : 8080, HOST ?? '0.0.0.0', () => {
	console.log(`Server listening at http://${HOST}:${PORT}`);
});