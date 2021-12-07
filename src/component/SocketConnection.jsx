import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket";

const SocketConnection = () => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:

    // emit USER_ONLINE event
    socket.emit("USER_ONLINE");
  }, []);

  return <></>;
};

export default SocketConnection;
