/**
 * NovaBot - Student Assistant Chatbot
 * Vanilla JavaScript Logic File
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Element References
    const chatStream = document.getElementById("chat-stream");
    const userInput = document.getElementById("user-input");
    const chatForm = document.getElementById("chat-form");
    const clearBtn = document.getElementById("clear-btn");
    const typingIndicator = document.getElementById("typing-indicator");
    const suggestionsContainer = document.getElementById("suggestions-container");

    // Welcome Message Initialization
    const WELCOME_MESSAGE = "Hello! 👋 I'm NovaBot, your Student Assistant. How can I help you today?";

    // Knowledge Base Rules (Patterns & Direct Replies)
    const knowledgeBase = [
        // Greetings
        {
            keywords: ["hi", "hello", "hey", "hie", "hola"],
            response: "Hey! 👋 Nice to meet you. How can I help you today?"
        },
        {
            keywords: ["good morning"],
            response: "Good morning! ☀️ I hope you're having a great day. How can I help?"
        },
        {
            keywords: ["good afternoon"],
            response: "Good afternoon! ☀️ How can I assist you with your studies today?"
        },
        {
            keywords: ["good evening"],
            response: "Good evening! 🌆 How can I help you today?"
        },
        {
            keywords: ["how are you", "how r u", "how do you do"],
            response: "I'm doing great! 🤖 Thanks for asking. I'm ready to help you."
        },

        // Identity & Capabilities
        {
            keywords: ["who are you", "what is your name", "what can you do", "tell me about yourself", "what is novabot", "about novabot"],
            response: "I'm NovaBot 🤖, a simple web-based Student Assistant chatbot created using HTML, CSS, and JavaScript. I can answer basic questions about web development, student topics, date and time, and some fun questions."
        },

        // Web Development Core Concepts
        {
            keywords: ["html"],
            response: "HTML stands for HyperText Markup Language. 🌐 It is used to create the structure and content of web pages."
        },
        {
            keywords: ["css"],
            response: "CSS stands for Cascading Style Sheets. 🎨 It is used to style, design, and layout web pages."
        },
        {
            keywords: ["javascript", "js"],
            response: "JavaScript is a programming language used to make websites interactive and dynamic. ⚡"
        },
        {
            keywords: ["fsd", "full stack"],
            response: "FSD stands for Full Stack Development. 💻 It involves developing both the frontend and backend parts of a web application."
        },
        {
            keywords: ["frontend", "front end"],
            response: "Frontend is the part of a website that users see and interact with. HTML, CSS, and JavaScript are common frontend technologies."
        },
        {
            keywords: ["backend", "back end"],
            response: "Backend is the server-side part of an application. It handles business logic, databases, authentication, and server operations."
        },

        // Student Knowledge & Computing Basics
        {
            keywords: ["programming language", "programming"],
            response: "Programming is the process of writing instructions for computers using specialized languages like JavaScript, Python, or Java to perform tasks."
        },
        {
            keywords: ["database", "db"],
            response: "A database is an organized collection of structured data or information stored electronically in a computer system."
        },
        {
            keywords: ["mysql", "sql"],
            response: "MySQL is a popular open-source Relational Database Management System (RDBMS) that uses Structured Query Language (SQL) to manage data."
        },
        {
            keywords: ["website", "web site"],
            response: "A website is a collection of publicly accessible, interlinked web pages that share a single domain name."
        },
        {
            keywords: ["web application", "web app"],
            response: "A web application is an interactive software program built with web technologies that runs inside a web browser."
        },
        {
            keywords: ["chatbot", "chat bot"],
            response: "A chatbot is a software application that communicates with users through text or voice. 🤖"
        },

        // Entertainment & Fun
        {
            keywords: ["joke", "tell me a joke", "funny"],
            response: "Why do programmers prefer dark mode? 🌙 Because light attracts bugs! 😂"
        },
        {
            keywords: ["interesting fact", "tell me something interesting"],
            response: "💡 Interesting fact: The first website was created by Tim Berners-Lee in 1991."
        },
        {
            keywords: ["fun fact", "tell me a fun fact"],
            response: "💡 JavaScript was created in just about 10 days in 1995 by Brendan Eich."
        },
        {
            keywords: ["bored", "im bored", "i am bored"],
            response: "Let's fix that! 😄 Ask me a programming question or say 'tell me a joke'."
        },

        // Polite Closures
        {
            keywords: ["thank you", "thanks", "thank u", "thx"],
            response: "You're welcome! 😊 I'm always happy to help."
        },
        {
            keywords: ["bye", "goodbye", "see you", "cya"],
            response: "Goodbye! 👋 Have a great day!"
        },
        {
            keywords: ["good night", "goodnight", "gn"],
            response: "Good night! 🌙 See you next time!"
        }
    ];

    // Helper: Formats current system time (e.g., "7:13 PM")
    function getCurrentFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Helper: Generates detailed Dynamic Date String
    function getDynamicDateResponse(queryType) {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dayName = days[now.getDay()];
        const dateNum = now.getDate();
        const monthName = months[now.getMonth()];
        const yearNum = now.getFullYear();

        if (queryType === "day") {
            return `Today is ${dayName}. 📅`;
        } else if (queryType === "time") {
            return `The current time is ${getCurrentFormattedTime()}. ⏰`;
        } else {
            return `Today is ${dayName}, ${dateNum} ${monthName} ${yearNum}. 📅`;
        }
    }

    // Append a single message bubble to the stream
    function appendMessage(text, sender) {
        const messageRow = document.createElement("div");
        messageRow.classList.add("message-row", sender);

        const bubble = document.createElement("div");
        bubble.classList.add("message-bubble");
        bubble.textContent = text;

        const timestamp = document.createElement("span");
        timestamp.classList.add("message-time");
        timestamp.textContent = getCurrentFormattedTime();

        messageRow.appendChild(bubble);
        messageRow.appendChild(timestamp);

        chatStream.appendChild(messageRow);

        // Scroll to newest message
        chatStream.scrollTop = chatStream.scrollHeight;
    }

    // Fuzzy matching algorithm for matching inputs against knowledge rules
    function matchBotReply(rawInput) {
        // Clean and normalize input
        const cleanInput = rawInput.toLowerCase().replace(/[^\w\s]/gi, '').trim();

        // 1. Check for Date & Time Queries
        if (cleanInput.includes("time") || cleanInput.includes("clock")) {
            return getDynamicDateResponse("time");
        }
        if (cleanInput.includes("day")) {
            return getDynamicDateResponse("day");
        }
        if (cleanInput.includes("date") || cleanInput.includes("today")) {
            return getDynamicDateResponse("date");
        }

        // 2. Scan Knowledge Base for Matching Keywords
        for (const entry of knowledgeBase) {
            for (const key of entry.keywords) {
                if (cleanInput.includes(key)) {
                    return entry.response;
                }
            }
        }

        // 3. Fallback response for unmatched queries
        return "🤔 I'm not sure about that yet. Try asking me about HTML, CSS, JavaScript, FSD, databases, or today's date.";
    }

    // Process User Submission
    function handleUserSubmit(messageText) {
        const query = messageText || userInput.value.trim();

        if (query === "") return;

        // Render user message
        appendMessage(query, "user");
        userInput.value = "";

        // Show typing indicator
        typingIndicator.classList.remove("hidden");
        chatStream.scrollTop = chatStream.scrollHeight;

        // Process response with simulated realistic thinking delay
        setTimeout(() => {
            typingIndicator.classList.add("hidden");
            const botReply = matchBotReply(query);
            appendMessage(botReply, "bot");
        }, 600);
    }

    // Initialize Chat with Welcome State
    function initChat() {
        chatStream.innerHTML = "";
        appendMessage(WELCOME_MESSAGE, "bot");
    }

    // Event Listeners
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleUserSubmit();
    });

    suggestionsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("chip-btn")) {
            const query = e.target.getAttribute("data-query");
            handleUserSubmit(query);
        }
    });

    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the chat conversation?")) {
            initChat();
        }
    });

    // Boot app
    initChat();
});