import express, {Request, Response} from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import nocache from "nocache";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import http from "http";
import path from "path";
import Ai from 'openai';

dotenv.config();
let { PORT, HOST, CLIENT_PORT, CLIENT_HOST, OPENAI_API } = process.env;

const app = express();

const allowedOrigins = [
	`http://${HOST}:${PORT}`,
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


//Open AI
const ai = new Ai({
	apiKey: OPENAI_API,
});

app.post('/api/new-question', async (req: Request, res: Response) => {
	try {
		const pre = req.body.pre ?? "";
		const content = `Please provide a JSON stringfied quiz response with properties {question: question string, a: option a string, b: option b string, c: option c string, d: option d string, answer: option string} Make sure you only send the json string as response within the format i mentioned, because i will directly JSON parse it. Be interconnected; do not send duplicate response. do not send anything other than the quizz object. In addition make sure not to ask these questions [${pre}]`;
		const chatCompletion = await ai.chat.completions.create({
		messages: [{ role: 'user', content }],
		model: 'gpt-3.5-turbo-0125',
		});
		if (chatCompletion?.choices[0]?.message?.content) {
			res.status(200).json(JSON.parse(chatCompletion.choices[0].message.content));
		} else {
			res.status(500).json({message:"Internal server error"});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({message:"Internal server error"});
	}
});

app.use(express.static(path.join(__dirname, '../client/dist'), {index: false}));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
//END

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

server.listen(typeof PORT === "number" ? PORT : 3000, HOST ?? 'localhost', () => {
	console.log(`Server listening at http://${HOST}:${PORT}`);
});