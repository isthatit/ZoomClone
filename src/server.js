import express from "express";
import WebSocket from "ws";
import http from "http";

import { redirect } from "express/lib/response";

const app = express();

app.set("view engine" ,"pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on ws||http://localhost:3000`)

// http server
const server = http.createServer(app);

// websocket server
const wss = new WebSocket.Server({ server });
const onSocketClose = (socket) => {
    console.log("Disconnected from the Browser");
    console.log("users: ", sockets.length);
}

const sockets = []

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("users: ", sockets.length);
    console.log("Connected to Browser");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
       
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;

        }
        
    })
});

server.listen(3000, handleListen);