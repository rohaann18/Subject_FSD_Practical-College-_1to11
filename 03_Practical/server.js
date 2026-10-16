const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const questions = require("./questions");

const PORT = process.env.PORT || 3000;
const publicFolder = path.join(__dirname, "public");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

// Read JSON sent by the quiz page.
function readJson(request, callback) {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
    if (body.length > 100000) request.destroy();
  });

  request.on("end", () => {
    try {
      callback(null, JSON.parse(body));
    } catch (error) {
      callback(new Error("Request body must contain valid JSON."));
    }
  });

  request.on("error", () => {
    callback(new Error("Could not read the request body."));
  });
}

// Serve only HTML, CSS and JavaScript files from public.
function serveFile(pathname, response) {
  let requestedPath;

  try {
    requestedPath = decodeURIComponent(pathname);
  } catch (error) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Invalid URL.");
    return;
  }

  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const filePath = path.resolve(publicFolder, relativePath);
  const relativeFilePath = path.relative(publicFolder, filePath);
  const contentType = mimeTypes[path.extname(filePath).toLowerCase()];

  if (relativeFilePath.startsWith("..") || path.isAbsolute(relativeFilePath)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Access denied.");
    return;
  }

  if (!contentType) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("File not found.");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      const status = error.code === "ENOENT" ? 404 : 500;
      response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(status === 404 ? "File not found." : "Server error.");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, "http://localhost");
  const pathname = requestUrl.pathname;

  if (request.method === "GET" && pathname === "/api/topics") {
    sendJson(response, 200, Object.keys(questions));
    return;
  }

  if (request.method === "GET" && pathname === "/api/questions") {
    const topic = requestUrl.searchParams.get("topic");

    if (!topic || !questions[topic]) {
      sendJson(response, 400, { error: "Invalid topic." });
      return;
    }

    // Never send correct answers to the browser.
    const publicQuestions = questions[topic].map((item) => ({
      id: item.id,
      question: item.question,
      options: item.options,
    }));
    sendJson(response, 200, publicQuestions);
    return;
  }

  if (request.method === "POST" && pathname === "/api/submit") {
    readJson(request, (error, data) => {
      if (error) {
        sendJson(response, 400, { error: error.message });
        return;
      }

      if (!data || !questions[data.topic] || !Array.isArray(data.answers)) {
        sendJson(response, 400, { error: "Invalid topic or request data." });
        return;
      }

      const topicQuestions = questions[data.topic];
      const usedIds = new Set();
      let score = 0;

      for (const answer of data.answers) {
        const question = answer && topicQuestions.find(
          (item) => item.id === answer.questionId
        );
        const valid = question &&
          Number.isInteger(answer.selectedOption) &&
          answer.selectedOption >= 0 &&
          answer.selectedOption < 4 &&
          !usedIds.has(answer.questionId);

        if (!valid) {
          sendJson(response, 400, { error: "Invalid answer data." });
          return;
        }

        usedIds.add(answer.questionId);
        if (answer.selectedOption === question.correctAnswer) score++;
      }

      const total = topicQuestions.length;
      const percentage = Math.round((score / total) * 100);
      sendJson(response, 200, { score, total, percentage });
    });
    return;
  }

  if (pathname.startsWith("/api/")) {
    sendJson(response, 404, { error: "API endpoint not found." });
    return;
  }

  if (request.method !== "GET") {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method not allowed.");
    return;
  }

  serveFile(pathname, response);
});

server.listen(PORT, () => {
  console.log(`MCQ Quiz Server running at http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Choose another PORT and try again.`);
  } else {
    console.error("Could not start the server:", error.message);
  }
  process.exit(1);
});
