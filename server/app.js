const express = require('express');
const helmet = require('helmet');
const cors = require('cors');  
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(helmet());
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    method: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(xss());
app.use(hpp());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get('/test', (req, res) => {
    console.log("Req received")
    try {
        res.status(200).send("Backend Connected");
    } catch (error) {
        console.log(error);
    }
})

module.exports = app;