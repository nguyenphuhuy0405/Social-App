const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const route = require('./routes/route.js');
const cors = require('cors');
const SocketService = require('./services/socket-service');
dotenv.config();

const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000',
    },
});
global.io = io;

const corsOptions = {
    origin: process.env.CLIENT_BASE_URL,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to MongoDB');
});
app.use('/images', express.static(path.join(__dirname, 'public/images')));

//CORS
app.use(cors(corsOptions));

//Compress responses
app.use(compression());

// Parse application/json
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//middleware
app.use(express.json());
// app.use(helmet());
// app.use(morgan('common'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        return res.status(200).json('File uploded successfully');
    } catch (error) {
        console.error(error);
    }
});

//Socket
io.on('connection', SocketService.connection);

//Route Init
route(app);

app.listen(8800, () => {
    console.log('Backend server is running!');
});
