"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const gameManager = new GameManager_1.GameManager();
// Create a WebSocket server
const wss = new ws_1.WebSocketServer({ port: 8080 });
// On connection event
wss.on("connection", (ws) => {
    gameManager.addUser(ws);
    ws.on("close", () => {
        gameManager.removeUser(ws);
        console.log("Client disconnected");
    });
    // On message event
    ws.on("message", (message) => {
        // Convert the Buffer to a string if it's a Buffer object
        const decodedMessage = Buffer.isBuffer(message) ? message.toString('utf-8') : message;
        console.log("Received message:", decodedMessage);
        // Broadcast received message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(decodedMessage);
            }
        });
    });
    ws.on("error", (err) => {
        console.error("Error occurred:", err.message);
        ws.close();
    });
});
console.log("WebSocket server is running on port 8080");
