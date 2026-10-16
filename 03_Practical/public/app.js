const topicSelect = document.getElementById("topic");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");

// Load topic names from the server.
fetch("/api/topics")
  .then((response) => response.json())
  .then((topics) => {
    topicSelect.innerHTML = '<option value="">Select a topic</option>';

    topics.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic;
      topicSelect.appendChild(option);
    });
  })
  .catch(() => {
    message.textContent = "Could not load topics. Please try again.";
  });

startButton.addEventListener("click", () => {
  if (!topicSelect.value) {
    message.textContent = "Please select a topic.";
    return;
  }

  window.location.href = "/quiz.html?topic=" +
    encodeURIComponent(topicSelect.value);
});
