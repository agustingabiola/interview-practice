import { Server } from "socket.io";

let connectedClients = [];

const SocketHandler = (__req, res) => {
  if (res.socket.server.io) {
    // socket.io server already present
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/market/socketio",
  });
  res.socket.server.io = io;

  io.on("connection", async (socket) => {
    connectedClients.push(socket.id);

    const getOrdersResponse = await fetch("http://localhost:3000/api/market");
    const { orders } = await getOrdersResponse.json();

    io.emit("connected-client-new", {
      connectedClients,
      orders,
    });

    socket.on("disconnect", (disconnectReason) => {
      console.log(
        "🚀 ~ file: index.ts:29 ~ socket.on ~ disconnectReason:",
        disconnectReason
      );

      connectedClients = connectedClients.filter((cc) => cc !== socket.id);
      io.emit("connected-clients-update", connectedClients);
    });
  });

  // NodeJS and errors with websocket: https://github.com/vercel/next.js/issues/49334
  // fails to upgrade protocol correctly and falling to polling in latest versions
  // one solution, make a server and use a different port...
  res.socket.server.io = io;
  res.end();
};

export default SocketHandler;
