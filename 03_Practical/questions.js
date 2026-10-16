// Quiz questions are grouped by topic.
// correctAnswer stores the zero-based index of the correct option.
const questions = {
  HTML: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "HighText Machine Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which HTML tag is used for the largest heading?",
      options: ["<h6>", "<heading>", "<h1>", "<head>"],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "Which tag is used to create a paragraph in HTML?",
      options: ["<p>", "<para>", "<text>", "<paragraph>"],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: "Which tag is used to display an image in HTML?",
      options: ["<picture>", "<image>", "<img>", "<src>"],
      correctAnswer: 2,
    },
  ],

  CSS: [
    {
      id: 1,
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which CSS property changes the text color?",
      options: ["font-color", "text-color", "color", "background-color"],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "Which symbol selects an element by its id in CSS?",
      options: [".", "#", "*", "@"],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "Which CSS property changes the background color?",
      options: ["background-color", "color", "bgcolor", "background-style"],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: "Which CSS property controls the text size?",
      options: ["text-size", "font-style", "font-size", "size"],
      correctAnswer: 2,
    },
  ],

  JavaScript: [
    {
      id: 1,
      question: "Which keyword can be used to declare a variable in JavaScript?",
      options: ["var", "style", "define", "value"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which function displays a message in the browser console?",
      options: ["print()", "console.log()", "display()", "write.log()"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "Which operator is used for addition in JavaScript?",
      options: ["-", "*", "+", "/"],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "Which value represents true or false in JavaScript?",
      options: ["String", "Number", "Boolean", "Array"],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "Which brackets are used to create an array in JavaScript?",
      options: ["()", "{}", "<>", "[]"],
      correctAnswer: 3,
    },
  ],
};

// Export the data so the Node.js server can use it later.
module.exports = questions;
