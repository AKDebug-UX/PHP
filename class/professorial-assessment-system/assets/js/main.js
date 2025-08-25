// Main JavaScript file for common functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  console.log("Professorial Assessment System loaded")

  // Check if user is logged in on protected pages
  const protectedPages = [
    "dashboard.html",
    "assessments.html",
    "professors.html",
    "criteria.html",
    "users.html",
    "reports.html",
  ]
  const currentPage = window.location.pathname.split("/").pop()

  if (protectedPages.includes(currentPage)) {
    checkAuthentication()
  }
})

function checkAuthentication() {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }

  // Update user info in navigation
  const user = JSON.parse(currentUser)
  const userNameElements = document.querySelectorAll("#user-name, #current-user")
  const userRoleElements = document.querySelectorAll("#user-role")

  userNameElements.forEach((el) => {
    if (el) el.textContent = user.full_name
  })

  userRoleElements.forEach((el) => {
    if (el) el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1)
  })
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type}`
  alertDiv.textContent = message

  // Insert at the top of the container
  const container = document.querySelector(".container")
  if (container) {
    container.insertBefore(alertDiv, container.firstChild)

    // Remove after 5 seconds
    setTimeout(() => {
      alertDiv.remove()
    }, 5000)
  }
}

function getUrlParameter(name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]")
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  const results = regex.exec(location.search)
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
}
