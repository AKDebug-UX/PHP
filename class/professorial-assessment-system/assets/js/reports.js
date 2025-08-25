import { Chart } from "@/components/ui/chart"
// Reports JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeCharts()
})

function initializeCharts() {
  // Score Distribution Chart
  const scoreCtx = document.getElementById("scoreChart").getContext("2d")
  new Chart(scoreCtx, {
    type: "bar",
    data: {
      labels: ["90-100", "80-89", "70-79", "60-69", "50-59"],
      datasets: [
        {
          label: "Number of Professors",
          data: [3, 8, 4, 0, 0],
          backgroundColor: ["#28a745", "#007bff", "#ffc107", "#fd7e14", "#dc3545"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Assessment Score Distribution",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })

  // Department Performance Chart
  const deptCtx = document.getElementById("departmentChart").getContext("2d")
  new Chart(deptCtx, {
    type: "doughnut",
    data: {
      labels: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"],
      datasets: [
        {
          data: [87.5, 85.7, 83.2, 92.3, 79.5],
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#17a2b8", "#fd7e14"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Average Scores by Department",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  })
}

function generateReport() {
  showAlert("Generating comprehensive report...", "info")

  // Simulate report generation
  setTimeout(() => {
    showAlert("Report generated successfully!", "success")
  }, 2000)
}

function exportReport() {
  showAlert("Exporting report to PDF...", "info")

  // Simulate PDF export
  setTimeout(() => {
    showAlert("Report exported successfully!", "success")

    // Create a dummy download
    const link = document.createElement("a")
    link.href = "data:text/plain;charset=utf-8,Assessment Report - Generated on " + new Date().toLocaleDateString()
    link.download = "assessment_report.txt"
    link.click()
  }, 1500)
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
