import { serve } from "bun";

const clients = new Set<any>();

const server = serve({
  port: 3000,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Hello Dudeee!", { status: 200, headers: { "Content-Type": "text/plain" } });
  },
  websocket: {
    open(ws) {
      console.log("Client connected");
      clients.add(ws);
      ws.send(JSON.stringify({ message: "Welcome!" }));
    },
    message(ws, message) {
      const data = typeof message === 'string' ? message : new TextDecoder().decode(message);
      console.log("Received:", data);

      const num = Number(data);
      if (!isNaN(num)) {
        ws.send(JSON.stringify({ rounded: Math.round(num) }));
      } else {
        for (const client of clients) {
          client.send(JSON.stringify({ broadcast: data }));
        }
      }
    },
    close(ws) {
      console.log("Client disconnected");
      clients.delete(ws);
    },
  },
});

console.log("WebSocket server running on ws://localhost:3000");
