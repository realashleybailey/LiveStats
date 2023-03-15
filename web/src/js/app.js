import '../scss/app.scss';

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import io from 'socket.io-client';

const term = new Terminal({
    scrollback: 0,
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal-container'));

fitAddon.fit();

const resize = new ResizeObserver(function (entries) {
    // since we are observing only a single element, so we access the first element in entries array
    try {
        fitAddon && fitAddon.fit();
    } catch (err) {
        console.log(err);
    }
});

resize.observe(document.getElementById('terminal-container'));

// Set up socket.io connection
const socket = io();

// Set up socket.io events
socket.on('connect', async () => {
    socket.on('data', (data) => {
        term.writeln(data);
    });
});

term.writeln('Connecting to server...');