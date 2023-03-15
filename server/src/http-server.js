import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the path to the log file 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a the express server
const app = express();
const publicPath = path.resolve(__dirname, '..', 'dist');

app.use(express.static(publicPath));

export default app;