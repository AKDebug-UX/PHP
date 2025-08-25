// Assessment Form JavaScript
document.addEventListener("DOMContentLoaded", () => {
  loadAssessmentData()
})

function loadAssessmentData() {
  const assessmentId = getUrlParameter("id")

  // Simulate loading assessment data
  const assessmentData = {
    professor_name: "Dr. John Smith",
    professor_department: "Computer Science",
    assessment_period: "Fall 2024",
    status: "draft",
  }

  // Update form header
  document.getElementById("professor-name").textContent = assessmentData.professor_name
  document.getElementById("professor-department").textContent = assessmentData.professor_department
  document.getElementById("assessment-period").textContent = assessmentData.assessment_period
  document.getElementById("assessment-status").textContent =
    assessmentData.status.charAt(0).toUpperCase() + assessmentData.status.slice(1)
  document.getElementById("assessment-status").className = `badge badge-${assessmentData.status}`
}

function saveAsDraft() {
  if (validateForm()) {
    const formData = collectFormData()

    // Simulate saving as draft
    console.log("Saving as draft:", formData)

    showSuccess("Assessment saved as draft.")
  }
}

function submitAssessment() {
  if (confirm("Are you sure you want to submit this assessment? You will not be able to edit it after submission.")) {
    if (validateForm()) {
      const formData = collectFormData()

      // Calculate total score
      const totalScore = calculateTotalScore(formData)

      // Simulate submitting assessment
      console.log("Submitting assessment:", formData)
      console.log("Total Score:", totalScore)

      showSuccess("Assessment submitted successfully!")

      // Redirect after delay
      setTimeout(() => {
        window.location.href = "assessments.html"
      }, 2000)
    }
  }
}

function validateForm() {
  // Basic validation - check if at least some scores are filled
  const scoreInputs = document.querySelectorAll('input[type="number"]')
  let hasScores = false

  scoreInputs.forEach((input) => {
    if (input.value && Number.parseFloat(input.value) > 0) {
      hasScores = true
    }
  })

  if (!hasScores) {
    showError("Please enter at least one score before saving.")
    return false
  }

  return true
}

function collectFormData() {
  const formData = {}

  // Collect scores and comments
  for (let i = 1; i <= 9; i++) {
    const scoreInput = document.getElementById(`score_${i}`)
    const commentsInput = document.getElementById(`comments_${i}`)

    if (scoreInput) {
      formData[`score_${i}`] = scoreInput.value || 0
    }
    if (commentsInput) {
      formData[`comments_${i}`] = commentsInput.value || ""
    }
  }

  // Collect overall comments
  const overallComments = document.getElementById("overall_comments")
  if (overallComments) {
    formData.overall_comments = overallComments.value || ""
  }

  return formData
}

function calculateTotalScore(formData) {
  // Criteria weights
  const weights = {
    1: 3.0, // Course Delivery
    2: 2.5, // Student Engagement
    3: 2.0, // Assessment Methods
    4: 4.0, // Publications
    5: 3.5, // Grants
    6: 3.0, // Innovation
    7: 2.0, // Committee Work
    8: 1.5, // Community Service
    9: 2.0, // Mentoring
  }

  let totalWeightedScore = 0
  let totalWeight = 0

  for (let i = 1; i <= 9; i++) {
    const score = Number.parseFloat(formData[`score_${i}`]) || 0
    if (score > 0) {
      const weightedScore = (score / 100) * weights[i] * 100
      totalWeightedScore += weightedScore
      totalWeight += weights[i]
    }
  }

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0
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

  // Scroll to top to show message
  window.scrollTo(0, 0)
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

  // Scroll to top to show message
  window.scrollTo(0, 0)
}

function getUrlParameter(name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]")
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  const results = regex.exec(location.search)
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
}
