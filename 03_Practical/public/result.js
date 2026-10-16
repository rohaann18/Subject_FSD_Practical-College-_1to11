const savedResult = sessionStorage.getItem("quizResult");
const topicResult = document.getElementById("topicResult");
const percentage = document.getElementById("percentage");
const scoreText = document.getElementById("scoreText");
const resultMessage = document.getElementById("resultMessage");

if (!savedResult) {
  topicResult.textContent = "No quiz result is available.";
} else {
  const result = JSON.parse(savedResult);
  topicResult.textContent = "Topic: " + result.topic;
  percentage.textContent = result.percentage + "%";
  scoreText.textContent =
    "You scored " + result.score + " out of " + result.total + ".";

  if (result.percentage >= 80) {
    resultMessage.textContent = "Excellent work!";
  } else if (result.percentage >= 50) {
    resultMessage.textContent = "Good attempt! Keep practising.";
  } else {
    resultMessage.textContent = "Keep learning and try again.";
  }
}
