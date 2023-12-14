import { io, Socket } from "socket.io-client";

class WebSocketService {
  public socket: Socket;

  constructor() {
    this.socket = io("http://10.145.129.32:3001");

    this.socket.on('commande', (message: string) => {
      console.log('Commande reçue :', message);
    });
  }

  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  // Méthodes pour rejoindre les rooms
  public joinClientRoom() {
    console.log(true)
    this.socket.emit('joinClientRoom');
  }

  public joinRestaurateurRoom() {
    this.socket.emit('joinRestaurateurRoom');
  }

  public joinLivreurRoom() {
    this.socket.emit('joinLivreurRoom');
  }


  public newCommand() {
    this.socket.emit('nouvelleCommande')
  }
}

export default new WebSocketService();