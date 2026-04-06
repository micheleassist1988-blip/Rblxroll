const path = require('path');
const express = require('express');
const http = require('http');
const hpp = require('hpp');
const cors = require('cors');
const socket = require('socket.io');

// Load application config
require('dotenv').config({ path: './config/config.env' });

// Init express app & create http server
const app = express();
const server = http.createServer(app);

// In production the frontend is served by this same server, so allow all origins
const corsOrigin = process.env.NODE_ENV === 'production'
    ? true
    : process.env.SERVER_FRONTEND_URL;

// Create socket server
const io = socket(server, {
    transports: ['polling', 'websocket'],
    cors: {
        origin: corsOrigin,
        credentials: true
    }
});

// Load database
require('./database')();

// Init page settings
require('./utils/setting').settingInitDatabase();

// Enable if you are behind a reverse proxy
app.set('trust proxy', 1);

// Set other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? true : [...process.env.SERVER_FRONTEND_URL.split(',')],
    credentials: true
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Project download route (temporary)
app.get('/download-project', (req, res) => {
    const file = path.join(__dirname, '../rblxroll-project.zip');
    res.download(file, 'rblxroll-project.zip');
});

// Mount routes
app.use('/', require('./routes')(io));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve built Vue frontend in production
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

// Mount sockets
require('./sockets')(io);

// Set app port — supports PORT (Railway/Render/Fly.io) and SERVER_PORT
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
