// ---------------- Configuration ----------------
const OWNER = "qpeyy";
const REPO = "api";
const FILE_PATH = "apis"; // file in your repo
const BRANCH = "main";
const TOKEN = "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"; // ⚠️ Keep this secret
document.getElementById("donateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const key = document.getElementById("apiKey").value.trim();
  const message = document.getElementById("message");

  if (key.length < 10) {
    message.textContent = "❌ Invalid key (must be at least 10 characters)";
    message.style.color = "red";
    return;
  }

  message.textContent = "⏳ Submitting...";
  message.style.color = "gray";

  try {
    const res = await fetch("https://api-donation-backend.vercel.app/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    const data = await res.json();
    if (res.ok) {
      message.textContent = "✅ Key successfully donated!";
      message.style.color = "green";
      document.getElementById("apiKey").value = "";
    } else {
      message.textContent = `❌ Failed: ${data.error}`;
      message.style.color = "red";
    }
  } catch (err) {
    message.textContent = "❌ Network error";
    message.style.color = "red";
  }
});

