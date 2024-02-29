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
        title: `User [${id}] looking for partner`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Accept",
        cancelButtonText: "Reject",
        backdrop: true,
      }).then((res) => {
        if (res.isConfirmed) {
          socket.emit("acceptRequest", { from: ID, to: id });
          setOppID(id);
          navigate("/app");
        }
      });
    }
    socket.on("receiveRequest", receiveRequest);

    return () => {
      socket.off("receiveRequest", receiveRequest);
    };
  }, [ID, setOppID, oppID, navigate]);

  //send request
  const sendRequest = (friend: string | null) => {
    if (oppID) return;
    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
      },
      background: "transparent",
      backdrop: true,
      allowOutsideClick: false,
    });

    let timeOut: NodeJS.Timeout;
    if (friend === null) {
      timeOut = setTimeout(() => {
        Swal.fire({
          icon: "info",
          title: "Sorry! we couldn't find any players",
          backdrop: true,
        });
      }, 5000);
    } 

    async function receiveAcceptance(id: string) {
      clearTimeout(timeOut);
      setOppID(id);
      Swal.close();
      socket.off("receiveAcceptance", receiveAcceptance);
      navigate("/app");
      Swal.close();
    }

    socket.on("receiveAccept", receiveAcceptance);
    socket.emit("sendRequest", { ID, friend });
  };

  const copyID = () => {
    if (!ID) return;
    navigator.clipboard.writeText(ID).then(() => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Copied to clipboard",
      });
    });
  };

  return (
    <div className="select-none bg-gradient-to-bl from-slate-50 to-slate-600 h-[100vh] flex justify-center items-center">
      <div className="bg-white h-[100vh] w-[100%] md:w-[30%] md:h-[80%] rounded-md flex justify-between flex-col items-stretch p-3 pt-10">
        <h1 className="text-center text-5xl text-gray-500 font-bold">Quiz</h1>
        <button
          onClick={copyID}
          className="font-semibold text-gray-600 flex items-center justify-center gap-2 group"
        >
          Your ID: {ID ?? "loading..."}{" "}
          {ID ? (
            <i className="group-hover:scale-125 group-hover:text-gray-700 fa fa-copy"></i>
          ) : (
            <i className="fa fa-clock"></i>
          )}
        </button>
        <div className="flex flex-col justify-center items-center font-medium gap-3">
          <button
            onClick={() => {
              Swal.fire({
                title: "Connect your Friend",
                input: "number",
                inputPlaceholder: "Enter ID here",
                returnInputValueOnDeny: false,
                inputValidator(val) {
                  if (!val) return "Please enter user ID";
                },
              }).then((res) => {
                if (res.isConfirmed) {
                  sendRequest(res.value);
                }
              });
            }}
            className="text-white bg-green-400 p-1 pe-4 ps-4 w-[70%] rounded-md"
          >
            Play with a friend
          </button>
          <span className="font-medium text-gray-600">OR</span>
          <button
            onClick={() => sendRequest(null)}
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
