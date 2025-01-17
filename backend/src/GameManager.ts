import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./Message";


export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }


    addUser(socket: WebSocket){
        this.users.push(socket);
        this.handleMessage(socket)
       

    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(s => s!== socket);
        socket.close();

    }

    private handleMessage(socket: WebSocket) {
        socket.on('message', (data)=>{
            const message = JSON.parse(data.toString());
             if(message.type === INIT_GAME) {
                if(this.pendingUser){
                   const game = new Game(this.pendingUser, socket)
                   this.games.push(game);
                   this.pendingUser = null;  
                } else { 
                    this.pendingUser = socket;
                   
                }

                console.log("did not really run");

               
             } 

             if(message.type === MOVE ){
                console.log("inside move")
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    console.log("move")
                    game.makeMove(socket, message.move)
                }
                 }


                 
               
             



        })
        // Implement message handling logic here
    }
     
    
}
