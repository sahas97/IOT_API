const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log("New client connected");
    ws.send("Connected");
    ws.on('message', function incomming(message) {
        console.log('received: %s', message);
        const messageString = new TextDecoder().decode(message); // convert massage as string
        //   ws.send('Your message has recived: '+ message);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });

});

app.get("/", (req, res) => {
    res.send("Hello from Sever");
});

app.get("/posts", (req, res) => {
    try {
        res.json({
            "message": 'Hello from the sever',
        })
    } catch (err) {
        res.json({ message: err });
    }
});

const port = process.env.PORT || 8080
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
