import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ContextID } from "./store/context.ts";
import socket from "./instances/socket.ts";

export function WrapComponent() {
  const [ID, setID] = useState<string | null>(null);
  const [oppID, setOppID] = useState<string | null>(null);

  const socketConnected = socket.connected;

  function recieveID(id: string) {
    setID(id);
  }

  useEffect(() => {
    setTimeout(() => {
      socket.emit("joinID");
    }, 1000);
    socket.on("recieveID", recieveID);
  }, [socketConnected]);

  useEffect(() => {
    return () => {
      if (ID) socket.emit("leaveID", ID);
      socket.off("recieveID", recieveID);
    };
  }, [ID]);

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
