require('dotenv').config();
const configViewEngine = require('./config/viewEngine');
const connection = require('./config/database');
const express = require('express');
const path = require('path');
const cors = require('cors');

const { app, io, server } = require('./socket/socket.js');

const port = process.env.PORT || 8888;

// config req.body
app.use(cors());
app.use(express.json()); // for JSON
app.use(express.urlencoded({ extended: true })); // for form data

// config template engine
configViewEngine(app);

// khai báo route
app.use('/v1/api/', require('./routes/userRouter'));
app.use('/v1/api/author/', require('./routes/authorRouter'));
app.use('/v1/api/book/', require('./routes/bookRouter'));
app.use('/v1/api/message/', require('./routes/messageRoute'));

// Correct the path to reach 'frontend/dist' directory
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

(async () => {
    try {
        // using mongoose
        await connection();

        server.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();
