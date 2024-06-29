"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const Message_1 = require("./Message");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.handleMessage(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(s => s !== socket);
        socket.close();
    }
    handleMessage(socket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === Message_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
                console.log("did not really run");
            }
            if (message.type === Message_1.MOVE) {
                console.log("inside move");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("move");
                    game.makeMove(socket, message.move);
                }
            }
        });
        // Implement message handling logic here
    }
}
exports.GameManager = GameManager;
