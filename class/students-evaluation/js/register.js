document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm")
  const registerBtn = document.getElementById("registerBtn")
  const inputs = registerForm ? registerForm.querySelectorAll("input, select") : []

  // Form validation
  function validateForm() {
    if (!registerBtn || inputs.length === 0) return

    let allValid = true

    inputs.forEach((input) => {
      if (input.required && !input.value.trim()) {
        allValid = false
      }
      if (input.classList.contains("invalid")) {
        allValid = false
      }
    })

    // Check password match
    const password = document.getElementById("password")
    const confirmPassword = document.getElementById("confirmPassword")
    if (
      password &&
      confirmPassword &&
      password.value &&
      confirmPassword.value &&
      password.value !== confirmPassword.value
    ) {
      allValid = false
    }

    registerBtn.disabled = !allValid
  }

  // Input validation function
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

  // Full name validation
  const fullNameInput = document.getElementById("fullName")
  if (fullNameInput) {
    fullNameInput.addEventListener("input", (e) => {
      validateInput(
        e.target,
        (value) => value.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(value),
        "✓ Name looks good",
        "✗ Please enter a valid name (letters only, min 2 characters)",
      )
    })
  }

  // Email validation
  const emailInput = document.getElementById("email")
  if (emailInput) {
    emailInput.addEventListener("input", (e) => {
      validateInput(
        e.target,
        (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "✓ Valid email format",
        "✗ Please enter a valid email address",
      )
    })
  }

  // School name validation
  const schoolNameInput = document.getElementById("schoolName")
  if (schoolNameInput) {
    schoolNameInput.addEventListener("input", (e) => {
      validateInput(
        e.target,
        (value) => value.trim().length >= 2,
        "✓ School name entered",
        "✗ Please enter your school name",
      )
    })
  }

  // Student ID validation
  const studentIdInput = document.getElementById("studentId")
  if (studentIdInput) {
    studentIdInput.addEventListener("input", (e) => {
      validateInput(
        e.target,
        (value) => /^[A-Z0-9]{3,10}$/.test(value.toUpperCase()),
        "✓ Valid student ID",
        "✗ Student ID should be 3-10 characters (letters and numbers)",
      )
    })
  }

  // Department validation
  const departmentInput = document.getElementById("department")
  if (departmentInput) {
    departmentInput.addEventListener("input", (e) => {
      validateInput(
        e.target,
        (value) => value.trim().length >= 2,
        "✓ Department entered",
        "✗ Please enter your department",
      )
    })
  }

  // Password validation with strength indicator
  const passwordInput = document.getElementById("password")
  if (passwordInput) {
    passwordInput.addEventListener("input", (e) => {
      const password = e.target.value
      const strengthBar = e.target.parentElement.querySelector(".password-strength")

      if (strengthBar) {
        let strength = 0
        let strengthColor = "#ef4444"
        let strengthText = "Weak"

        if (password.length >= 8) strength += 25
        if (/[a-z]/.test(password)) strength += 25
        if (/[A-Z]/.test(password)) strength += 25
        if (/[0-9]/.test(password)) strength += 25

        if (strength >= 75) {
          strengthColor = "#10b981"
          strengthText = "Strong"
        } else if (strength >= 50) {
          strengthColor = "#f59e0b"
          strengthText = "Medium"
        }

        strengthBar.style.setProperty("--strength", `${strength}%`)
        strengthBar.style.setProperty("--strength-color", strengthColor)
      }

      validateInput(
        e.target,
        (value) => value.length >= 6,
        `✓ Password strength: ${strengthText || "Good"}`,
        "✗ Password must be at least 6 characters",
      )

      // Revalidate confirm password
      const confirmPassword = document.getElementById("confirmPassword")
      if (confirmPassword && confirmPassword.value) {
        confirmPassword.dispatchEvent(new Event("input"))
      }
    })
  }

  // Confirm password validation
  const confirmPasswordInput = document.getElementById("confirmPassword")
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", (e) => {
      const password = document.getElementById("password")
      const passwordValue = password ? password.value : ""

      validateInput(
        e.target,
        (value) => value === passwordValue && value.length > 0,
        "✓ Passwords match",
        "✗ Passwords do not match",
      )
    })
  }

  // Level selection validation
  const levelSelect = document.getElementById("level")
  if (levelSelect) {
    levelSelect.addEventListener("change", (e) => {
      const feedback = e.target.parentElement.querySelector(".input-feedback")
      if (feedback) {
        if (e.target.value) {
          e.target.classList.add("valid")
          feedback.textContent = "✓ Level selected"
          feedback.className = "input-feedback success"
        } else {
          e.target.classList.remove("valid")
          feedback.textContent = "✗ Please select your level"
          feedback.className = "input-feedback error"
        }
      }
      validateForm()
    })
  }

  // Form submission
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(registerForm)
      const userData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        schoolName: formData.get("schoolName"),
        studentId: formData.get("studentId") ? formData.get("studentId").toUpperCase() : "",
        level: formData.get("level"),
        department: formData.get("department"),
        password: formData.get("password"),
      }

      // Validate required fields
      if (
        !userData.fullName ||
        !userData.email ||
        !userData.schoolName ||
        !userData.studentId ||
        !userData.level ||
        !userData.department ||
        !userData.password
      ) {
        showNotification("Please fill in all required fields", "error")
        return
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const userExists = existingUsers.some(
        (user) => user.email === userData.email || user.studentId === userData.studentId,
      )

      if (userExists) {
        showNotification("User with this email or student ID already exists!", "error")
        return
      }

      // Save user data
      existingUsers.push(userData)
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      showNotification("Registration successful! Redirecting to login...", "success")

      setTimeout(() => {
        window.location.href = "login.html"
      }, 2000)
    })
  }

  // Initial validation
  validateForm()
})

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
if (!document.querySelector("#register-animations")) {
  const style = document.createElement("style")
  style.id = "register-animations"
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
