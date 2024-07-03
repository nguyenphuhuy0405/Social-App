const messageController = require('../controllers/message-controller');

class SocketService {
    constructor(users) {
        this.users = users || [];
    }

    getUser = (userId) => {
        return this.users.find((user) => user.userId === userId);
    };

    addUser = (socketId, userId) => {
        !this.users.some((user) => user.userId === userId) && this.users.push({ socketId, userId });
    };

    removeUser = (socketId) => {
        this.users = this.users.filter((user) => user.socketId !== socketId);
    };

    connection = (socket) => {
        console.log('A user connected: ' + socket.id);
        // add user
        socket.on('Client-Send-AddUser', (userId) => {
            this.addUser(socket.id, userId);
            console.log(this.users);
            io.emit('Server-Send-Users', this.users);
        });

        // send and get message
        socket.on('Client-Send-NewMessage', ({ senderId, receiverId, text }) => {
            let user = this.getUser(receiverId);
            socket.to(user?.socketId).emit('Server-Send-NewMessage', {
                senderId,
                text,
            });
        });

        // disconnect
        socket.on('disconnect', () => {
            this.removeUser(socket.id);
            io.emit('Server-Send-Users', this.users);
        });
    };
}

module.exports = new SocketService();
