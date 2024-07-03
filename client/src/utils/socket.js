// socket.js
import { io } from 'socket.io-client';

const socket = io('ws://localhost:8900');

export const connectSocket = () => {
    if (!socket) {
        socket.on('connect', () => {
            console.log('Đã kết nối tới WebSocket server');
        });

        socket.on('disconnect', () => {
            console.log('Mất kết nối tới WebSocket server');
        });
    }
    return socket;
};
