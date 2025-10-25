// ---------------- Configuration ----------------
const OWNER = "qpeyy";
const REPO = "api";
const FILE_PATH = "apis"; // file in your repo
const BRANCH = "main";
const TOKEN = "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"; // ⚠️ Keep this secret

// ---------------- Handle Form Submission ----------------
document.getElementById("donateForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const key = document.getElementById("apiKey").value.trim();
  const messageEl = document.getElementById("message");

  // Validate key length
  if (key.length < 10) {
    messageEl.style.color = "red";
    messageEl.textContent = "❌ Invalid API key. Must be at least 10 characters.";
    return;
  }

  try {
    // ---------------- Step 1: Get current file content ----------------
    let sha = null;
    let content = "";

    const getRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
      headers: TOKEN ? { Authorization: `token ${TOKEN}` } : {}
    });

    if (getRes.status === 200) {
      const fileData = await getRes.json();
      content = atob(fileData.content.replace(/\n/g, "")); // decode Base64
      sha = fileData.sha;
    }

    // ---------------- Step 2: Append new key ----------------
    const newContent = btoa(content + key + "\n"); // encode Base64

    // ---------------- Step 3: Push update to GitHub ----------------
    const updateRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add API key via website`,
        content: newContent,
        sha: sha || undefined,
        branch: BRANCH
      })
    });

    if (updateRes.ok) {
      messageEl.style.color = "green";
      messageEl.innerHTML = `✅ Your API key has been donated!<br>View all keys <a href="https://github.com/qpeyy/api/blob/main/apis" target="_blank">here</a>`;
      document.getElementById("apiKey").value = "";
    } else {
      const err = await updateRes.json();
      messageEl.style.color = "red";
      messageEl.textContent = `❌ Failed: ${err.message}`;
    }

  } catch (err) {
    console.error("Error:", err);
    messageEl.style.color = "red";
    messageEl.textContent = `❌ Error: ${err.message}`;
  }
});

