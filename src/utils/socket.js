const socket = new WebSocket("wss://accentshift-relay.up.railway.app");

socket.onopen = () => {
  console.log("✅ Connected to AccentRelay");
};

socket.onmessage = (event) => {
  const audioData = event.data;
  const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

socket.onerror = (error) => {
  console.error("❌ WebSocket Error:", error);
};

export default socket;
