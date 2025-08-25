// Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData()
})

function loadDashboardData() {
  // Simulate loading dashboard statistics
  const stats = {
    professors: 15,
    assessments: 42,
    completed: 28,
    pending: 14,
  }

  // Update statistics
  document.getElementById("total-professors").textContent = stats.professors
  document.getElementById("total-assessments").textContent = stats.assessments
  document.getElementById("completed-assessments").textContent = stats.completed
  document.getElementById("pending-assessments").textContent = stats.pending

  // Load recent assessments (already populated in HTML for demo)
  console.log("Dashboard data loaded")
}
