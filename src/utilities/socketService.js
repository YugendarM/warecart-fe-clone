import {io} from "socket.io-client"

let socket

export const initiateSocketConnection = () => {
    socket = io("http://localhost:3500", {
        transports: ["websocket"],
      });

    socket.on("connect", () => {
        console.log("Connected to websocket server");
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
}

export const getSocket = () => socket;
