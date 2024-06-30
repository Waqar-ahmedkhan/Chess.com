import { useEffect, useState } from "react";

export const useSocket = ()=> {
  const [socket, setsocket ]= useState<WebSocket |  null>();

  useEffect(()=> {
    const newSocket = new WebSocket('ws://localhost:8080');
    newSocket.onopen = (() =>  {
        setsocket(newSocket);
    })
    setsocket(newSocket);

    newSocket.onclose = () => {
      setsocket(null);
    }

    return ()=> {
      newSocket.close();
    }

  }, [])

  return socket;
}