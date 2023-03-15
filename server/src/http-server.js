import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the path to the log file 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a the express server
const app = express();
const publicPath = path.resolve(__dirname, '..', 'dist');

app.get('/', (req, res) => {
    res.redirect('/log');
});

app.use("/log", express.static(publicPath));

export default app;