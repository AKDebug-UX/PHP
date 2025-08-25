// Assessment Creation JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const createForm = document.getElementById("createAssessmentForm")
  if (createForm) {
    createForm.addEventListener("submit", handleCreateAssessment)
  }
})

function handleCreateAssessment(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const assessmentData = {
    professor_id: formData.get("professor_id"),
    assessment_period: formData.get("assessment_period"),
    comments: formData.get("comments"),
  }

  if (!assessmentData.professor_id || !assessmentData.assessment_period) {
    showError("Please fill in all required fields.")
    return
  }

  // Simulate creating assessment
  const assessmentId = Math.floor(Math.random() * 1000) + 100

  showSuccess("Assessment created successfully!")

  // Redirect to assessment form after a short delay
  setTimeout(() => {
    window.location.href = `assessment_form.html?id=${assessmentId}`
  }, 1500)
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
