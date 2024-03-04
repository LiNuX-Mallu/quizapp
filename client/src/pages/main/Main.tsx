import { useCallback, useContext, useEffect, useState } from "react";
import { ContextID } from "../../store/context";
import { useNavigate } from "react-router-dom";
import socket from "../../instances/socket";
import Swal from "sweetalert2";

interface Question {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: string;
}

export function Main() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const { oppID, setOppID, ID } = useContext(ContextID);
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState({ opp: 0, me: 0 });

  const receiveExit = useCallback(
    (id: string) => {
      if (id !== oppID) return;
      Swal.fire({
        title: "You won!",
        text: "Opponent left the game",
        icon: "warning",
        iconHtml: '<i class="fa-solid fa-trophy" style="color: #FFD43B;"></i>',
      }).then(() => {
        setOppID(null);
        navigate("/");
      });
    },
    [navigate, oppID, setOppID]
  );

  function receiveQuestions(questions: Question[]) {
    setQuestions(questions);
  }

  interface Game {
    started: boolean;
    score: number;
    attempt: number;
  }
  const receiveScore = useCallback(
    (game: Record<string, Game>) => {
      if (!oppID || !ID) return;
      setGameScore({ opp: game[oppID].score, me: game[ID].score });
      if (game[oppID].attempt === 5 || game[ID].attempt === 5) {
        if (game[oppID].score > game[ID].score) {
          Swal.fire({
            title: "Opponent won the game",
            text: `OPP: ${game[oppID].score} | YOU: ${game[ID].score}`,
            icon: "warning",
            iconHtml: '<i class="fa-solid fa-face-sad-tear"></i>',
          }).then(() => {
            setOppID(null);
            navigate("/");
          });
        } else if (game[oppID].score < game[ID].score) {
          Swal.fire({
            title: "You won the game",
            text: `OPP: ${game[oppID].score} | YOU: ${game[ID].score}`,
            icon: "warning",
            iconHtml:
              '<i class="fa-solid fa-trophy" style="color: #FFD43B;"></i>',
          }).then(() => {
            setOppID(null);
            navigate("/");
          });
        } else {
          Swal.fire({
            title: "It's a draw",
            text: `OPP: ${game[oppID].score} | YOU: ${game[ID].score}`,
            icon: "warning",
            iconHtml: '<i class="fa-solid fa-exclamation"></i>',
          }).then(() => {
            setOppID(null);
            navigate("/");
          });
        }
      }
    },
    [ID, oppID, setOppID, navigate]
  );

  useEffect(() => {
    if (oppID === null) return navigate("/");
    socket.on("receiveExit", receiveExit);
    socket.on("receiveQuestions", receiveQuestions);
    socket.on("receiveScore", receiveScore);

    return () => {
      socket.off("receiveExit", receiveExit);
      socket.off("receiveQuestions", receiveQuestions);
      socket.off("receiveScore", receiveScore);
    };
  }, [ID, oppID, receiveExit, navigate, receiveScore]);

  const handleAnswer = (
    option: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = e.target as HTMLElement;
    const color = target.style.backgroundColor;
    if (questions && option === questions[qIndex].answer) {
      target.style.backgroundColor = "green";
      socket.emit("sendScore", { scored: true, from: ID, to: oppID });
    } else {
      target.style.backgroundColor = "red";
      socket.emit("sendScore", { scored: false, from: ID, to: oppID });
    }
    if (qIndex < 4) {
      setTimeout(() => {
        setQIndex(qIndex + 1);
        target.style.backgroundColor = color;
      }, 1000);
    }
  };

  return (
    <div className="select-none bg-gradient-to-br from-slate-400 to-slate-800 h-[100vh] flex justify-between items-center flex-col overflow-hidden">
      <div className="bg-transparent mb-5 h-[10%] ps-10 pe-10 text-white w-[100%] flex flex-row justify-between items-center">
        <button className="flex items-center justify-center font-semibold">
          <i className="fa-solid fa-user"></i>&nbsp;{oppID ?? "Looking..."}
        </button>
        <button
          onClick={() => {
            socket.emit("alertExit", { from: ID, to: oppID });
            setOppID(null);
            navigate("/");
          }}
          className="flex items-center justify-center font-[Lexend]"
        >
          Exit &nbsp; <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      {questions && (
        <div className="bg-transparent h-[20%] w-[100%] md:h-[100vh] md:w-[50%] flex justify-evenly items-center flex-col pb-10">
          <div className="flex flex-col w-[100%] h-[100%] justify-start items-center gap-5">
            <div className="w-[50%] flex font-semibold text-gray-700 overflow-hidden rounded-md">
              <div className="w-[100%] h-[100%] bg-blue-400 p-2 flex justify-center text-white">
                YOU &nbsp; <span>{gameScore.me}</span>
              </div>
              <div className="w-[100%] h-[100%] bg-red-400 p-2 flex justify-center text-white">
                OPP &nbsp; <span>{gameScore.opp}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!questions && (
        <div className="flex justify-center h-[100%] items-center flex-col text-center ">
          <button
            onClick={() => {
              socket.emit("sendStart", { from: ID, to: oppID });
              setGameStarted(true);
            }}
            className={`border p-1 pe-3 ps-3 text-blue-500 bg-white font-semibold rounded-md ${
              !gameStarted && "hover:bg-blue-500 hover:text-white"
            }`}
          >
            {gameStarted
              ? "Waiting for opponent to start the game..."
              : "Start Game"}
          </button>
          {gameStarted === false && (
            <p className="p-5 font-[Lexend] text-sm text-gray-300">
              Player who scores most out of 10 will be the winner. Time ends
              when any player finishes answering 10 questions
            </p>
          )}
        </div>
      )}

      {questions && (
        <div className="w-[100%] lg:w-[75%] flex flex-col h-[100%] justify-end items-center overflow-hidden pb-5">
          <div className="bg-green-200 h-fit w-[70%] rounded-md flex justify-center items-center">
            <p className="font-[Lexend] text-md text-green-900 p-5 text-center">
              {questions[qIndex].question
                ? questions[qIndex].question
                : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1 w-[70%] overflow-hidden font-semibold">
            <div
              onClick={(e) => handleAnswer("a", e)}
              className="text-center text-sm bg-slate-200 rounded-md h-full w-full flex justify-center p-1 items-center text-gray-900 hover:bg-yellow-200"
            >
              &nbsp; {`${questions[qIndex].a ?? "option a"}`}
            </div>
            <div
              onClick={(e) => handleAnswer("b", e)}
              className="bg-slate-200 text-sm text-center rounded-md h-full w-full flex justify-center p-1 items-center text-gray-900 hover:bg-yellow-200"
            >
              &nbsp; {`${questions[qIndex].b ?? "option b"}`}
            </div>
            <div
              onClick={(e) => handleAnswer("c", e)}
              className="p-1 bg-slate-200 text-sm text-center rounded-md h-full w-full flex justify-center items-center text-gray-900 hover:bg-yellow-200"
            >
              &nbsp; {`${questions[qIndex].c ?? "option c"}`}
            </div>
            <div
              onClick={(e) => handleAnswer("d", e)}
              className="p-1 bg-slate-200 text-sm text-center rounded-md h-full w-full flex justify-center items-center text-gray-900 hover:bg-yellow-200"
            >
              &nbsp; {`${questions[qIndex].d ?? "option d"}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
