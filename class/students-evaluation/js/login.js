document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const loginBtn = document.getElementById("loginBtn")

  // Demo users database
  const demoUsers = [
    {
      email: "abdulrahmanmusaadinoyi123@gmail.com",
      password: "abdulrahman123",
      fullName: "Musa Abdulrahman",
      studentId: "STU001",
      level: "300L",
      department: "Computer Science",
    },
    {
      email: "admin@demo.com",
      password: "admin123",
      fullName: "Demo Admin",
      studentId: "ADM001",
      level: "Admin",
      department: "Administration",
    },
  ]

  // Form validation
  function validateForm() {
    if (!emailInput || !passwordInput || !loginBtn) return

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    loginBtn.disabled = !(email && password)
  }

  // Input validation and feedback
  function validateInput(input, validationFn, successMsg, errorMsg) {
    if (!input) return

    const feedback = input.parentElement.querySelector(".input-feedback")
    if (!feedback) return

    const isValid = validationFn(input.value)

    if (input.value.trim() === "") {
      input.classList.remove("valid", "invalid")
      feedback.textContent = ""
      feedback.className = "input-feedback"
    } else if (isValid) {
      input.classList.remove("invalid")
      input.classList.add("valid")
      feedback.textContent = successMsg
      feedback.className = "input-feedback success"
    } else {
      input.classList.remove("valid")
      input.classList.add("invalid")
      feedback.textContent = errorMsg
      feedback.className = "input-feedback error"
    }

    validateForm()
  }

  // Email validation
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      validateInput(
        emailInput,
        (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "✓ Valid email format",
        "✗ Please enter a valid email address",
      )
    })
  }

  // Password validation
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      validateInput(
        passwordInput,
        (value) => value.length >= 6,
        "✓ Password looks good",
        "✗ Password must be at least 6 characters",
      )
    })
  }

  // Form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (!emailInput || !passwordInput) {
        showNotification("Form elements not found", "error")
        return
      }

      const email = emailInput.value.trim()
      const password = passwordInput.value.trim()

      if (!email || !password) {
        showNotification("Please fill in all fields", "error")
        return
      }

      // Check demo users
      const user = demoUsers.find((u) => u.email === email && u.password === password)

      // Check registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const registeredUser = registeredUsers.find((u) => u.email === email && u.password === password)

      if (user || registeredUser) {
        const currentUser = user || registeredUser

        // Store user session
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
        sessionStorage.setItem("userEmail", email)
        sessionStorage.setItem("userName", currentUser.fullName)

        showNotification("Login successful! Redirecting...", "success")

        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1500)
      } else {
        showNotification("Invalid email or password", "error")
      }
    })
  }

  // Initial validation
  validateForm()
})

// Fill demo credentials function
function fillDemoCredentials(email, password) {
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  if (emailInput && passwordInput) {
    emailInput.value = email
    passwordInput.value = password

    // Trigger validation
    emailInput.dispatchEvent(new Event("input"))
    passwordInput.dispatchEvent(new Event("input"))

    showNotification("Demo credentials filled!", "info")
  }
}

// Notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
    ${message}
  `

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    background-color: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#2563eb"};
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Add slideInRight animation
if (!document.querySelector("#login-animations")) {
  const style = document.createElement("style")
  style.id = "login-animations"
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `
  document.head.appendChild(style)
}
