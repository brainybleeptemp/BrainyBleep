const chatBox = document.getElementById("chat-box");

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  localStorage.setItem("chattedToday", true);
  input.value = "";

  setTimeout(() => {
    const reply = generateReply(message);
    addMessage(reply, "bleep");
  }, 500);
}

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-msg" : "bleep-msg";
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function generateReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("focus")) {
    return "Try a 25 minute lock-in. Phone down. You got this.";
  }
  if (msg.includes("motivate")) {
    return "You’ve handled harder days than this. This task? Light work.";
  }
  if (msg.includes("tired")) {
    return "Bet. Take a short reset, then come back stronger.";
  }
  if (msg.includes("help")) {
    return "Say less. Tell me what task you're stuck on.";
  }

  const defaultReplies = [
    "That’s tuff. Let’s break it into smaller steps.",
    "True true. Start small and build momentum.",
    "Bet. One task at a time and you're good.",
    "You’ve done harder things before. Keep going."
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}
