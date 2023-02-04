const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const cookie = require('cookie-parser')
const Router = require('./router/rout');
const errorMiddleware = require('./middlewares/error')

require("dotenv").config();

const PORT = process.env.PORT || 5000

const app = express()

const whitelist = ['http://localhost:3000', 'https://www.postman.com/'];
app.use(cors({
    credentials: true, // This is important.
    origin: (origin, callback) => {
        if (whitelist.includes(origin)) return callback(null, true)

        callback(new Error('Not allowed by CORS'));
    }
}));
app.use(express.json());
app.use(express.static(__dirname + '/storage'))
app.use(cookie());
app.use(fileUpload());
app.use("/api", Router);


app.use(errorMiddleware);


const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

