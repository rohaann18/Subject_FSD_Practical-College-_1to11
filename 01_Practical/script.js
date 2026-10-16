document.addEventListener("DOMContentLoaded", () => {
  const getItems = (key) => JSON.parse(localStorage.getItem(key) || "[]");
  const saveItems = (key, items) => localStorage.setItem(key, JSON.stringify(items));

  function showStatus(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = "status-message status-" + type;
    element.style.display = "block";
  }

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => navLinks.classList.toggle("active"));
  }

  const projectModal = document.getElementById("projectModal");
  if (projectModal) {
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    document.querySelectorAll(".btn-view-project").forEach((button) => {
      button.addEventListener("click", () => {
        modalTitle.textContent = button.dataset.name;
        modalDesc.textContent = button.dataset.details;
        projectModal.style.display = "flex";
      });
    });
    document.getElementById("closeModalBtn").addEventListener("click", () => {
      projectModal.style.display = "none";
    });
    projectModal.addEventListener("click", (event) => {
      if (event.target === projectModal) projectModal.style.display = "none";
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const messages = getItems("novaMessages");
      messages.push({
        id: Date.now(),
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim(),
        date: new Date().toLocaleString(),
      });
      saveItems("novaMessages", messages);
      contactForm.reset();
      showStatus(document.getElementById("contactStatus"), "Message submitted successfully.", "success");
    });
  }

  const loginSection = document.getElementById("loginSection");
  if (!loginSection) return;

  const signupSection = document.getElementById("signupSection");
  const forgotSection = document.getElementById("forgotSection");
  const dashboardSection = document.getElementById("dashboardSection");

  function showSection(section) {
    [loginSection, signupSection, forgotSection, dashboardSection].forEach((item) => {
      item.style.display = item === section ? "block" : "none";
    });
  }

  function renderMessages() {
    const messages = getItems("novaMessages");
    const tableBody = document.getElementById("messagesTableBody");
    document.getElementById("messageCountDisplay").textContent = messages.length;
    tableBody.innerHTML = "";

    if (!messages.length) {
      const row = tableBody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 8;
      cell.textContent = "No messages submitted yet.";
      return;
    }

    messages.forEach((message, index) => {
      const row = tableBody.insertRow();
      [index + 1, message.name, message.email, message.phone, message.subject, message.message, message.date]
        .forEach((value) => {
          const cell = row.insertCell();
          cell.textContent = value;
        });
      const actionCell = row.insertCell();
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        saveItems("novaMessages", messages.filter((item) => item.id !== message.id));
        renderMessages();
      });
      actionCell.appendChild(deleteButton);
    });
  }

  function openDashboard(admin) {
    document.getElementById("adminWelcomeName").textContent = admin.name;
    sessionStorage.setItem("novaAdmin", admin.email);
    showSection(dashboardSection);
    renderMessages();
  }

  document.getElementById("showSignupLink").addEventListener("click", (event) => {
    event.preventDefault();
    showSection(signupSection);
  });
  document.getElementById("showForgotLink").addEventListener("click", (event) => {
    event.preventDefault();
    showSection(forgotSection);
  });
  document.querySelectorAll(".back-to-login").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showSection(loginSection);
    });
  });

  document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const status = document.getElementById("signupStatus");
    if (password !== confirmPassword) {
      showStatus(status, "Passwords do not match.", "error");
      return;
    }

    const admins = getItems("novaAdmins");
    const email = document.getElementById("signupEmail").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    if (admins.some((admin) => admin.email.toLowerCase() === email.toLowerCase() || admin.username.toLowerCase() === username.toLowerCase())) {
      showStatus(status, "Username or email is already registered.", "error");
      return;
    }

    admins.push({
      name: document.getElementById("signupName").value.trim(), username, email, password,
    });
    saveItems("novaAdmins", admins);
    event.target.reset();
    showSection(loginSection);
    showStatus(document.getElementById("loginStatus"), "Account created. Please login.", "success");
  });

  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const identity = document.getElementById("loginUserEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const admin = getItems("novaAdmins").find((item) =>
      (item.email.toLowerCase() === identity || item.username.toLowerCase() === identity) && item.password === password
    );
    if (!admin) {
      showStatus(document.getElementById("loginStatus"), "Invalid username/email or password.", "error");
      return;
    }
    event.target.reset();
    openDashboard(admin);
  });

  document.getElementById("forgotForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const admins = getItems("novaAdmins");
    const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
    const admin = admins.find((item) => item.email.toLowerCase() === email);
    if (!admin) {
      showStatus(document.getElementById("forgotStatus"), "No account found for this email.", "error");
      return;
    }
    admin.password = document.getElementById("forgotNewPassword").value;
    saveItems("novaAdmins", admins);
    event.target.reset();
    showSection(loginSection);
    showStatus(document.getElementById("loginStatus"), "Password updated. Please login.", "success");
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("novaAdmin");
    showSection(loginSection);
  });
  document.getElementById("deleteAllBtn").addEventListener("click", () => {
    if (confirm("Delete all submitted messages?")) {
      localStorage.removeItem("novaMessages");
      renderMessages();
    }
  });

  const activeEmail = sessionStorage.getItem("novaAdmin");
  const activeAdmin = getItems("novaAdmins").find((admin) => admin.email === activeEmail);
  if (activeAdmin) openDashboard(activeAdmin);
});
