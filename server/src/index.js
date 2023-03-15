import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { Tail } from 'tail';
import { Server } from 'socket.io';
import path from 'path';

import app from './http-server.js';

// Get the path to the log file 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a HTTP server
const server = createServer(app);
const io = new Server(server);

// Path to the log file
// const filePath = path.join(__dirname, '..', 'log_file.log');
const filePath = "/private/var/log/com.apple.xpc.launchd/launchd.log";

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen to filePath using tail
    const tail = new Tail(filePath);

    // Send data to the client
    tail.on('line', (data) => {
        socket.emit('data', data);
    });
});

server.listen(9898, () => {
    console.log('Server is listening on port 3000');
});