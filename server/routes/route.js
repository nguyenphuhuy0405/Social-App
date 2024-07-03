const userRoute = require('./users');
const authRoute = require('./auth');
const postRoute = require('./posts');
const conversationRouter = require('./conversations');
const messageRouter = require('./messages');

function route(app) {
    app.use('/api/auth', authRoute);
    app.use('/api/users', userRoute);
    app.use('/api/posts', postRoute);
    app.use('/api/conversations', conversationRouter);
    app.use('/api/messages', messageRouter);
}

module.exports = route;
