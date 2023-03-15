import { createServer } from 'http';
import { Tail } from 'tail';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';

import app from './http-server.js';


// Create a HTTP server
const server = createServer(app);
const io = new Server(server, {
    path: '/log/socket.io',
});

// Path to the log file
io.on('connection', (socket) => {

    console.log('A user connected');

    const directory = '/var/log/jellyfin';
    const files = fs.readdirSync(directory);

    let newestFile = null;
    let newestTimestamp = 0;

    files.forEach(file => {
        if (file.startsWith('jellyfin') && file.endsWith('.log')) {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            const timestamp = stats.mtimeMs;

            if (timestamp > newestTimestamp) {
                newestFile = filePath;
                newestTimestamp = timestamp;
            }
        }
    });

    console.log(`Using log file: ${newestFile}`);

    // Listen to filePath using tail
    const tail = new Tail(newestFile);

    // Send data to the client
    tail.on('line', (data) => {
        socket.emit('data', data);
    });
});

server.listen(9898, () => {
    console.log('Server is listening on port 9898');
});