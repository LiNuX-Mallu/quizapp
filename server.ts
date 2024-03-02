import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import nocache from "nocache";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import http from "http";
import path from "path";
import Ai from "openai";

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
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  express.static(path.join(__dirname, "../client/dist"), { index: false })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const server = http.createServer(app);

//socket io
const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

async function generateQuestions() {
  const ai = new Ai({
    apiKey: OPENAI_API,
  });
  try {
    const pre: string[] = [];
    const content = `Please provide a JSON stringfied array of 5 quiz response with properties {question: question string, a: option a string, b: option b string, c: option c string, d: option d string, answer: option string} Make sure you only send the json string as response within the format i mentioned, because i will directly JSON parse it. Be interconnected; do not send duplicate response. do not send anything other than the quizz object. In addition make sure not to ask these questions [${pre}], make sure it have 5 questions`;
    const chatCompletion = await ai.chat.completions.create({
      messages: [{ role: "user", content }],
      model: "gpt-3.5-turbo-0125",
    });
    if (chatCompletion?.choices[0]?.message?.content) {
      return JSON.parse(chatCompletion.choices[0].message.content);
    } else return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface Game {
  started: boolean;
  score: number;
  attempt: number;
}

const game = <Record<string, Record<string, Game>>>{};
io.on("connection", async (socket: Socket) => {
  //join room
  socket.on("joinID", () => {
    let ID;

    do {
      ID = Math.floor(Math.random() * 1e10)
        .toString()
        .padStart(10, "0");
    } while (io.of("/").adapter.rooms.has(ID));

    socket.join(ID);
    io.to(ID).emit("recieveID", ID);
  });

  //leave room
  socket.on("leaveID", (ID: string) => {
    socket.leave(ID);
  });

  //send request
  socket.on("sendRequest", (data: { ID: string; friend: string }) => {
    if (data.friend !== null) {
      if (io.of("/").adapter.rooms.has(data.friend)) {
        io.to(data.friend).emit("receiveRequest", data.ID);
      } else {
        io.to(data.ID).emit("receiveAlert", 404);
      }
      return;
    }
    io.of("/").adapter.rooms.forEach((_, key) => {
      if (key !== data.ID && Number(key)) {
        io.to(key).emit("receiveRequest", data.ID);
      }
    });
  });

  //accepting request
  socket.on("acceptRequest", (data: { from: string; to: string }) => {
    if (
      io.of("/").adapter.rooms.has(data.from) &&
      io.of("/").adapter.rooms.has(data.from)
    ) {
      game[data.from] = {
        [data.from]: { score: 0, attempt: 0, started: false },
        [data.to]: { score: 0, attempt: 0, started: false },
      };
      game[data.to] = game[data.from];
      io.to(data.to).emit("receiveAccept", data.from);
    }
  });

  //ready to start
  socket.on("sendStart", (data: { from: string; to: string }) => {
    game[data.from][data.from].started = true;
    if (game[data.from][data.to].started === true) {
      generateQuestions().then((res) => {
        if (res !== null) {
          io.to([data.to, data.from]).emit("receiveQuestions", res);
        }
      });
    }
  });

  //score and attempt
  socket.on("sendScore", (data: { scored: boolean; from: string; to: string }) => {
    game[data.from][data.from].score += Number(data.scored);
    game[data.from][data.from].attempt++;
    io.to([data.from, data.to]).emit("receiveScore", game[data.from]);
  });

  socket.on("alertExit", (data: { from: string; to: string }) => {
    if (data.from && data.to) {
      io.to(data.to).emit("receiveExit", data.from);
    }
  });
});

//server running
server.listen(
  typeof PORT === "number" ? PORT : 3000,
  HOST ?? "localhost",
  () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
  }
);
