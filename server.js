const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('✅ Device connected:', socket.id);

    socket.on('device_status', (data) => {
        console.log('📡 Status:', data);
    });

    socket.on('device_data', (data) => {
        console.log('📥 Data received:', data.type);
        // Broadcast to all clients (dashboard)
        io.emit('device_data', data);
    });

    socket.on('send_command', (data) => {
        console.log('🎮 Command sent:', data.cmd);
        // Send command to the device
        socket.emit('command', data.cmd);
    });

    socket.on('disconnect', () => {
        console.log('❌ Device disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
