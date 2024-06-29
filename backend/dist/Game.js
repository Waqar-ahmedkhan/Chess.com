"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Message_1 = require("./Message");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: Message_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: Message_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        if (this.board.moves().length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.board.moves().length % 2 === 0 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.error(`Error making move: ${e.message}`);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: Message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                    duration: ((new Date().getTime() - this.startTime.getTime()) / 1000).toFixed(2) + " seconds"
                }
            }));
            this.player2.send(JSON.stringify({
                type: Message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                    duration: ((new Date().getTime() - this.startTime.getTime()) / 1000).toFixed(2) + " seconds"
                }
            }));
            return;
        }
        if (this.board.moves().length % 2 === 0) {
            this.player1.send(JSON.stringify({
                type: Message_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player2.send(JSON.stringify({
                type: Message_1.MOVE,
                payload: move
            }));
        }
    }
}
exports.Game = Game;
