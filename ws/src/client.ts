const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
    console.log("Connected to server");
    ws.send("42.8");
    ws.send("Hello from client!");
};

ws.onmessage = (event) => {
    console.log("Server says:", event.data);
};

ws.onclose = () => {
    console.log("Disconnected from server");
};

ws.onerror = (err) => {
    console.error("WebSocket error:", err);
};
