// Authentication JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }
})

// Demo users for the system
const demoUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@university.edu",
    role: "admin",
    full_name: "System Administrator",
  },
  {
    id: 2,
    username: "evaluator",
    password: "eval123",
    email: "evaluator@university.edu",
    role: "evaluator",
    full_name: "Dr. Mary Johnson",
  },
  {
    id: 3,
    username: "professor",
    password: "prof123",
    email: "professor@university.edu",
    role: "professor",
    full_name: "Dr. John Smith",
  },
]

function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  // Find user in demo users
  const user = demoUsers.find((u) => u.username === username && u.password === password)

  if (user) {
    // Store user in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Redirect to dashboard
    window.location.href = "dashboard.html"
  } else {
    showError("Invalid username or password.")
  }
}

function handleRegister(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const userData = {
    username: formData.get("username"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  }

  // Basic validation
  if (userData.password !== userData.confirm_password) {
    showError("Passwords do not match.")
    return
  }

  if (userData.password.length < 6) {
    showError("Password must be at least 6 characters long.")
    return
  }

  // Check if username already exists
  const existingUser = demoUsers.find((u) => u.username === userData.username)
  if (existingUser) {
    showError("Username already exists.")
    return
  }

  // Create new user
  const newUser = {
    id: demoUsers.length + 1,
    username: userData.username,
    password: userData.password,
    email: userData.email,
    role: userData.role,
    full_name: userData.full_name,
  }

  demoUsers.push(newUser)

  showSuccess("Registration successful! You can now login.")

  // Clear form
  e.target.reset()
}

function showError(message) {
  const errorDiv = document.getElementById("error-message")
  const successDiv = document.getElementById("success-message")

  if (errorDiv) {
    errorDiv.textContent = message
    errorDiv.style.display = "block"
  }

  if (successDiv) {
    successDiv.style.display = "none"
  }
}

function showSuccess(message) {
  const errorDiv = document.getElementById("error-message")
  const successDiv = document.getElementById("success-message")

  if (successDiv) {
    successDiv.textContent = message
    successDiv.style.display = "block"
  }

  if (errorDiv) {
    errorDiv.style.display = "none"
  }
}
