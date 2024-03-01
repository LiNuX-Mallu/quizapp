import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ContextID } from "./store/context.ts";
import socket from "./instances/socket.ts";
import Swal from "sweetalert2";

export function WrapComponent() {
  const [ID, setID] = useState<string | null>(null);
  const [oppID, setOppID] = useState<string | null>(null);

  const socketConnected = socket.connected;

  function recieveID(id: string) {
    setID(id);
  }

  const receiveAlert = useCallback(function (code: number) {
    if (Swal.isVisible()) Swal.close();
    let text: string;
    switch (code) {
      case 404:
        text = "Invalid ID";
        break;
      default:
        text = "Something went wrong";
    }
    Swal.fire({
      icon: "error",
      title: text,
      backdrop: true,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      socket.emit("joinID");
    }, 1000);

    socket.on("recieveID", recieveID);
  }, [socketConnected]);

  useEffect(() => {
    socket.on("receiveAlert", receiveAlert);

    return () => {
      if (ID) socket.emit("leaveID", ID);
      socket.off("receiveError", receiveAlert);
      socket.off("recieveID", recieveID);
    };
  }, [ID, receiveAlert]);

  return (
    <ContextID.Provider value={{ ID, setID, oppID, setOppID }}>
      <App />
    </ContextID.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WrapComponent />
  </React.StrictMode>
);
