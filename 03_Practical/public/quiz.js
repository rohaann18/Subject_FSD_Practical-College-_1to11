const params = new URLSearchParams(window.location.search);
const topic = params.get("topic");
const quizTitle = document.getElementById("quizTitle");
const quizForm = document.getElementById("quizForm");
const questionsArea = document.getElementById("questions");
const message = document.getElementById("message");
let quizQuestions = [];

function showQuestions() {
  quizTitle.textContent = topic + " Quiz";

  quizQuestions.forEach((item, questionIndex) => {
    const box = document.createElement("section");
    box.className = "question-box";

    const heading = document.createElement("h2");
    heading.textContent = (questionIndex + 1) + ". " + item.question;
    box.appendChild(heading);

    item.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "question-" + item.id;
      radio.value = optionIndex;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(option));
      box.appendChild(label);
    });

    questionsArea.appendChild(box);
  });
}

if (!topic) {
  message.textContent = "No quiz topic was selected.";
  quizForm.style.display = "none";
} else {
  fetch("/api/questions?topic=" + encodeURIComponent(topic))
    .then((response) => {
      if (!response.ok) throw new Error("Invalid topic.");
      return response.json();
    })
    .then((data) => {
      quizQuestions = data;
      showQuestions();
    })
    .catch(() => {
      message.textContent = "Could not load the quiz.";
      quizForm.style.display = "none";
    });
}

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answers = [];

  for (const item of quizQuestions) {
    const selected = document.querySelector(
      'input[name="question-' + item.id + '"]:checked'
    );

    if (!selected) {
      message.textContent = "Please answer every question.";
      return;
    }

    answers.push({
      questionId: item.id,
      selectedOption: Number(selected.value),
    });
  }

  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: topic, answers: answers }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Could not submit the quiz.");
      return response.json();
    })
    .then((result) => {
      result.topic = topic;
      sessionStorage.setItem("quizResult", JSON.stringify(result));
      window.location.href = "/result.html";
    })
    .catch(() => {
      message.textContent = "Could not submit the quiz. Please try again.";
    });
});
