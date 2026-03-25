import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = 8080;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    ws.send("Hello from server");
  ws.on("message", (data) => {
    console.log("client connected %s", data);
  });
});
