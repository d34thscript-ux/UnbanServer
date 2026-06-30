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

// Store connected devices
const connectedDevices = new Map();

io.on('connection', (socket) => {
    console.log('✅ Device connected:', socket.id);
    connectedDevices.set(socket.id, { id: socket.id, status: 'online' });

    // Listen for status from device
    socket.on('device_status', (data) => {
        console.log('📡 Status:', data);
        // Forward to dashboard
        io.emit('device_status', data);
    });

    // Listen for data from device
    socket.on('device_data', (data) => {
        console.log('📥 Data received:', data.type);
        // Forward to dashboard
        io.emit('device_data', data);
    });

    // Listen for commands from dashboard
    socket.on('send_command', (data) => {
        console.log('🎮 Command sent:', data.cmd);
        // Send command to device
        socket.emit('command', data.cmd);
    });

    socket.on('disconnect', () => {
        console.log('❌ Device disconnected:', socket.id);
        connectedDevices.delete(socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
