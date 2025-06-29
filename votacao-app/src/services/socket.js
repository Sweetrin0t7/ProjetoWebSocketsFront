const socket = new WebSocket("ws://localhost:3001");

socket.onopen = () => {
  console.log("✅ Conectado ao WebSocket");
};

socket.onerror = (error) => {
  console.error("❌ Erro na conexão WebSocket:", error);
};

export default socket;
