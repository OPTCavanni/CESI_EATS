import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

const app: Express = express();
const server: HttpServer = new HttpServer(app);
const io: IOServer = new IOServer(server);

io.on('connection', (socket: Socket) => {
    console.log('Un client est connecté');

    // Pour les clients
    socket.on('joinClientRoom', () => {
        socket.join('clients');
        console.log('Un client a rejoint la room des clients');
    });

    // Pour les restaurateurs
    socket.on('joinRestaurateurRoom', () => {
        socket.join('restaurateurs');
        console.log('Un restaurateur a rejoint la room des restaurateurs');
    });

    // Pour les livreurs
    socket.on('joinLivreurRoom', () => {
        socket.join('livreurs');
        console.log('Un livreur a rejoint la room des livreurs');
    });

    socket.on('disconnect', () => {
        console.log('Un client est déconnecté');
    });

    socket.on('nouvelleCommande', () => {
        console.log('Nouvelle commande reçu');
        io.to('restaurateurs').emit('commande', 'Une nouvelle commande est disponible');
    });
});

server.listen(3001, () => console.log('Serveur en écoute sur le port 3001'));