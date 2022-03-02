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

wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    socket.on("close", () => {
        console.log("Disconnected from the Browser");
    })
    
    socket.on("message", (message) => {
        console.log(message.toString('utf-8'));
    })
});

server.listen(3000, handleListen);