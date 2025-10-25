const OWNER = "qpeyy";
const REPO = "api";
const FILE_PATH = "apis.txt"; // Make sure it matches your file in GitHub
const BRANCH = "main";
const TOKEN = "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"; // ⚠️ Never share publicly

document.getElementById("donateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const key = document.getElementById("apiKey").value.trim();
  const messageEl = document.getElementById("message");

  if (key.length < 10) {
    messageEl.style.color = "red";
    messageEl.textContent = "❌ Invalid API key. Must be at least 10 characters.";
    return;
  }

  try {
    // Get current content
    let sha = null;
    let content = "";
    const getRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
      headers: { Authorization: `token ${TOKEN}` }
    });

    if (getRes.status === 200) {
      const fileData = await getRes.json();
      content = atob(fileData.content);
      sha = fileData.sha;
    }

    // Append new key
    const newContent = btoa(content + key + "\n");

    // Push to GitHub
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
      messageEl.textContent = "✅ Your API key has been donated!";
      document.getElementById("apiKey").value = "";
    } else {
      const err = await updateRes.json();
      messageEl.style.color = "red";
      messageEl.textContent = `❌ Failed: ${err.message}`;
    }

  } catch (err) {
    messageEl.style.color = "red";
    messageEl.textContent = `❌ Error: ${err.message}`;
  }
});
