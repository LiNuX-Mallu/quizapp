import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContextID } from "../../store/context";
import socket from "../../instances/socket";
import Swal from "sweetalert2";

export function Home() {
  const navigate = useNavigate();
  const { ID, setOppID, oppID } = useContext(ContextID);

  useEffect(() => {
    if (oppID) return;
    function receiveRequest(id: string) {
      if (id === ID) return;
      Swal.fire({
        text: 'Random request from a player',
        showCancelButton: true,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          socket.emit("acceptRequest", { from: ID, to: id });
          setOppID(id);
          navigate('/app');
        }
      })
    }

    socket.on('receiveRequest', receiveRequest);

    return () => {
      socket.off('receiveRequest', receiveRequest);
    }
  }, [ID, setOppID, oppID, navigate]);

  return (
    <div className="select-none bg-gradient-to-bl from-slate-50 to-slate-600 h-[100vh] flex justify-center items-center">
      <div className="bg-white h-[100vh] w-[100%] md:w-[30%] md:h-[80%] rounded-md flex justify-between flex-col items-stretch p-3 pt-10">
        <h1 className="text-center text-5xl text-gray-500 font-bold">Quiz</h1>
        <button className="font-semibold text-gray-600 flex items-center justify-center gap-2">
          Your ID: {ID ?? "loading..."}{" "}
          {ID ? <i className="fa fa-copy"></i> : ""}
        </button>
        <div className="flex flex-col justify-center items-center font-medium gap-3">
          <button className="text-white bg-green-400 p-1 pe-4 ps-4 w-[70%] rounded-md">
            Play with a friend
          </button>
          <span className="font-medium text-gray-600">OR</span>
          <button
            onClick={() => navigate("/app")}
            className="text-white bg-blue-400 p-1 pe-4 ps-4 w-[70%] rounded-md"
          >
            Play with random user
          </button>
        </div>
        <p className="font-[Lexend] text-xs text-center text-gray-500 font-normal">
          Quiz game developed by mohd. shas
        </p>
      </div>
    </div>
  );
}
