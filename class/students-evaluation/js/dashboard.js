// Initialize EmailJS
; (() => {
  // Initialize EmailJS on window object
  window.emailjs = window.emailjs || {}
  window.emailjs.init =
    window.emailjs.init ||
    ((userId) => {
      // Placeholder for EmailJS initialization
      console.log("EmailJS initialized with user ID:", userId)
    })
  window.emailjs.init("YOUR_EMAILJS_USER_ID") // Replace with your EmailJS user ID
})()

// Global variables
const formData = {}
let overallRating = 0
const startTime = Date.now()
let currentSection = "overview"

// Course data structure
const courseDatabase = {
  "Faculty of Science": {
    "Computer Science": {
      "100L": [
        { code: "CSC 101", name: "Introduction to Computer Science" },
        { code: "CSC 102", name: "Computer Programming I" },
        { code: "MTH 101", name: "Elementary Mathematics I" },
        { code: "PHY 101", name: "General Physics I" }
      ],
      "200L": [
        { code: "CSC 201", name: "Computer Programming II" },
        { code: "CSC 202", name: "Data Structures" },
        { code: "CSC 203", name: "Computer Architecture" },
        { code: "MTH 201", name: "Mathematical Methods I" }
      ],
      "300L": [
        { code: "CSC 301", name: "Database Systems" },
        { code: "CSC 302", name: "Software Engineering" },
        { code: "CSC 303", name: "Operating Systems" },
        { code: "CSC 304", name: "Computer Networks" }
      ],
      "400L": [
        { code: "CSC 401", name: "Artificial Intelligence" },
        { code: "CSC 402", name: "Machine Learning" },
        { code: "CSC 403", name: "Computer Networks" },
        { code: "CSC 404", name: "Project Management" }
      ],
      "500L": [
        { code: "CSC 501", name: "Final Year Project I" },
        { code: "CSC 502", name: "Final Year Project II" },
        { code: "CSC 503", name: "Advanced Topics in CS" }
      ]
    },
    "Mathematics": {
      "100L": [
        { code: "MTH 101", name: "Elementary Mathematics I" },
        { code: "MTH 102", name: "Elementary Mathematics II" },
        { code: "PHY 101", name: "General Physics I" }
      ],
      "200L": [
        { code: "MTH 201", name: "Mathematical Methods I" },
        { code: "MTH 202", name: "Mathematical Methods II" },
        { code: "MTH 203", name: "Linear Algebra" }
      ]
    },
    "Physics": {
      "100L": [
        { code: "PHY 101", name: "General Physics I" },
        { code: "PHY 102", name: "General Physics II" },
        { code: "MTH 101", name: "Elementary Mathematics I" }
      ],
      "200L": [
        { code: "PHY 201", name: "Mechanics" },
        { code: "PHY 202", name: "Electricity and Magnetism" },
        { code: "PHY 203", name: "Waves and Optics" }
      ]
    }
  },
  "Faculty of Engineering": {
    "Electrical Engineering": {
      "100L": [
        { code: "EEE 101", name: "Introduction to Electrical Engineering" },
        { code: "EEE 102", name: "Basic Electrical Circuits" },
        { code: "MTH 101", name: "Elementary Mathematics I" },
        { code: "PHY 101", name: "General Physics I" }
      ],
      "200L": [
        { code: "EEE 201", name: "Electronics I" },
        { code: "EEE 202", name: "Electromagnetic Theory" },
        { code: "EEE 203", name: "Digital Logic Design" }
      ]
    },
    "Mechanical Engineering": {
      "100L": [
        { code: "MEE 101", name: "Introduction to Mechanical Engineering" },
        { code: "MEE 102", name: "Engineering Drawing" },
        { code: "MTH 101", name: "Elementary Mathematics I" },
        { code: "PHY 101", name: "General Physics I" }
      ],
      "200L": [
        { code: "MEE 201", name: "Engineering Mechanics" },
        { code: "MEE 202", name: "Thermodynamics" },
        { code: "MEE 203", name: "Machine Design" }
      ]
    }
  },
  "Faculty of Arts": {
    "English": {
      "100L": [
        { code: "ENG 101", name: "Introduction to English Literature" },
        { code: "ENG 102", name: "English Grammar and Composition" },
        { code: "HIS 101", name: "Introduction to History" }
      ],
      "200L": [
        { code: "ENG 201", name: "Shakespeare and Renaissance Literature" },
        { code: "ENG 202", name: "Modern English Literature" },
        { code: "ENG 203", name: "Creative Writing" }
      ]
    }
  },
  "Faculty of Social Sciences": {
    "Economics": {
      "100L": [
        { code: "ECO 101", name: "Introduction to Economics" },
        { code: "ECO 102", name: "Principles of Microeconomics" },
        { code: "MTH 101", name: "Elementary Mathematics I" }
      ],
      "200L": [
        { code: "ECO 201", name: "Principles of Macroeconomics" },
        { code: "ECO 202", name: "Statistics for Economics" },
        { code: "ECO 203", name: "Development Economics" }
      ]
    },
    "Political Science": {
      "100L": [
        { code: "POL 101", name: "Introduction to Political Science" },
        { code: "POL 102", name: "Nigerian Government and Politics" },
        { code: "HIS 101", name: "Introduction to History" }
      ],
      "200L": [
        { code: "POL 201", name: "Comparative Politics" },
        { code: "POL 202", name: "International Relations" },
        { code: "POL 203", name: "Political Theory" }
      ]
    }
  },
  "Faculty of Education": {
    "Educational Administration": {
      "100L": [
        { code: "EDA 101", name: "Introduction to Education" },
        { code: "EDA 102", name: "Educational Psychology" },
        { code: "PHI 101", name: "Introduction to Philosophy" }
      ],
      "200L": [
        { code: "EDA 201", name: "Educational Management" },
        { code: "EDA 202", name: "Curriculum Development" },
        { code: "EDA 203", name: "Educational Planning" }
      ]
    }
  },
  "Faculty of Law": {
    "Private Law": {
      "100L": [
        { code: "LAW 101", name: "Introduction to Law" },
        { code: "LAW 102", name: "Legal Methods" },
        { code: "LAW 103", name: "Nigerian Legal System" }
      ],
      "200L": [
        { code: "LAW 201", name: "Contract Law" },
        { code: "LAW 202", name: "Tort Law" },
        { code: "LAW 203", name: "Property Law" }
      ]
    }
  }
}

// Department mapping for each faculty
const departmentMapping = {
  "Faculty of Science": ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"],
  "Faculty of Engineering": ["Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"],
  "Faculty of Arts": ["English", "History", "Philosophy", "Religious Studies"],
  "Faculty of Social Sciences": ["Economics", "Political Science", "Sociology", "Psychology"],
  "Faculty of Education": ["Educational Administration", "Curriculum Studies", "Educational Psychology"],
  "Faculty of Law": ["Private Law", "Public Law", "Commercial Law", "International Law"],
  "Faculty of Agriculture": ["Crop Science", "Animal Science", "Soil Science", "Agricultural Economics"],
  "Faculty of Medicine": ["Anatomy", "Physiology", "Biochemistry", "Pathology"]
}

// Loading state management
let isLoading = false

function showLoading() {
  if (!isLoading) {
    isLoading = true
    document.getElementById("loadingOverlay").style.display = "block"
  }
}

function hideLoading() {
  if (isLoading) {
    isLoading = false
    document.getElementById("loadingOverlay").style.display = "none"
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('close-btn');

  if (hamburgerBtn && sidebar && closeBtn) {
    hamburgerBtn.addEventListener('click', function () {
      sidebar.classList.add('active');
    });

    closeBtn.addEventListener('click', function () {
      sidebar.classList.remove('active');
    });

    // Optional: close sidebar when clicking outside
    window.addEventListener('click', function (e) {
      if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== hamburgerBtn) {
        sidebar.classList.remove('active');
      }
    });
  }
});


// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Set current date
  document.getElementById("evaluationDate").value = new Date().toISOString().split("T")[0]

  // Add event listeners
  addEventListeners()

  // Calculate initial rating
  calculateOverallRating()

  // Update dashboard stats
  updateDashboardStats()

  // Start time tracking
  updateTimeSpent()
  setInterval(updateTimeSpent, 60000) // Update every minute
})

function addEventListeners() {
  // Add change listeners to all form inputs
  const inputs = document.querySelectorAll("input, textarea, select")

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      calculateOverallRating()
      updateDashboardStats()
      updateProgress()
    })
    input.addEventListener("input", () => {
      calculateOverallRating()
      updateDashboardStats()
    })
  })

  // Academic info listeners
  const facultySelect = document.getElementById("faculty")
  const departmentSelect = document.getElementById("department")
  const levelSelect = document.getElementById("level")

  if (facultySelect) {
    facultySelect.addEventListener("change", () => {
      updateDepartments()
      updateDashboardStats()
      updateProgress()
    })
  }

  if (departmentSelect) {
    departmentSelect.addEventListener("change", () => {
      updateCourses()
      updateDashboardStats()
      updateProgress()
    })
  }

  if (levelSelect) {
    levelSelect.addEventListener("change", () => {
      updateCourses()
      updateDashboardStats()
      updateProgress()
    })
  }

  // Course selection listener
  const courseInputs = document.querySelectorAll('input[name="course"]')
  courseInputs.forEach((input) => {
    input.addEventListener("change", updateSelectedCourse)
  })
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show selected section
  document.getElementById(sectionId).classList.add("active")

  // Update navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add("active")

  currentSection = sectionId
  updateProgress()
}

function updateProgress() {
  const sections = ["academic-info", "course-selection", "instructor", "course-content", "equipment", "contact"]
  let completedSections = 0

  // Check academic info section
  const faculty = document.getElementById("faculty").value
  const department = document.getElementById("department").value
  const level = document.getElementById("level").value
  if (faculty && department && level) {
    completedSections++
  }

  // Check course selection
  if (document.querySelector('input[name="course"]:checked')) {
    completedSections++
  }

  // Check instructor section
  const instructorQuestions = ["instructor_a", "instructor_b", "instructor_c", "instructor_d"]
  if (instructorQuestions.every((q) => document.querySelector(`input[name="${q}"]:checked`))) {
    completedSections++
  }

  // Check course content section
  const courseQuestions = ["course_a", "course_b", "course_c", "course_d"]
  if (courseQuestions.every((q) => document.querySelector(`input[name="${q}"]:checked`))) {
    completedSections++
  }

  // Check equipment section (optional, so count as complete if any rating given)
  const equipmentQuestions = ["equipment_a", "equipment_b"]
  if (equipmentQuestions.some((q) => document.querySelector(`input[name="${q}"]:checked`))) {
    completedSections++
  }

  // Contact section is always considered complete (optional)
  completedSections++

  const progressPercent = Math.round((completedSections / sections.length) * 100)

  // Update progress bar
  document.getElementById("overallProgress").style.width = progressPercent + "%"
  document.getElementById("progressText").textContent = progressPercent + "% Complete"
}

function updateDashboardStats() {
  // Count completed sections
  let completedSections = 0

  // Check academic info
  const faculty = document.getElementById("faculty").value
  const department = document.getElementById("department").value
  const level = document.getElementById("level").value
  if (faculty && department && level) completedSections++

  if (document.querySelector('input[name="course"]:checked')) completedSections++

  const instructorQuestions = ["instructor_a", "instructor_b", "instructor_c", "instructor_d"]
  if (instructorQuestions.every((q) => document.querySelector(`input[name="${q}"]:checked`))) {
    completedSections++
  }

  const courseQuestions = ["course_a", "course_b", "course_c", "course_d"]
  if (courseQuestions.every((q) => document.querySelector(`input[name="${q}"]:checked`))) {
    completedSections++
  }

  const equipmentQuestions = ["equipment_a", "equipment_b"]
  if (equipmentQuestions.some((q) => document.querySelector(`input[name="${q}"]:checked`))) {
    completedSections++
  }

  // Update stats display
  document.getElementById("completedSections").textContent = completedSections
  document.getElementById("overallRatingDisplay").textContent = overallRating + "%"
}

function updateSelectedCourse() {
  const selectedCourse = document.querySelector('input[name="course"]:checked')
  const courseDisplay = document.getElementById("selectedCourse")

  if (selectedCourse) {
    courseDisplay.textContent = selectedCourse.value
  } else {
    courseDisplay.textContent = "None"
  }

  updateDashboardStats()
}

function updateTimeSpent() {
  const timeSpent = Math.floor((Date.now() - startTime) / 60000) // in minutes
  document.getElementById("timeSpent").textContent = timeSpent + " min"
}

// Function to update departments based on selected faculty
function updateDepartments() {
  const facultySelect = document.getElementById("faculty")
  const departmentSelect = document.getElementById("department")
  const faculty = facultySelect.value

  // Clear department options
  departmentSelect.innerHTML = '<option value="">Select Department</option>'

  if (faculty && departmentMapping[faculty]) {
    departmentMapping[faculty].forEach(dept => {
      const option = document.createElement("option")
      option.value = dept
      option.textContent = dept
      departmentSelect.appendChild(option)
    })
  }

  // Update display
  updateAcademicSummary()

  // Clear courses
  updateCourses()
}

// Function to update courses based on faculty, department, and level
function updateCourses() {
  const faculty = document.getElementById("faculty").value
  const department = document.getElementById("department").value
  const level = document.getElementById("level").value
  const courseGrid = document.getElementById("dynamicCourseGrid")

  if (!faculty || !department || !level) {
    courseGrid.innerHTML = `
      <div class="course-placeholder">
        <i class="fas fa-info-circle"></i>
        <p>Please select your faculty, department, and level in the Academic Info section to view available courses.</p>
      </div>
    `
    return
  }

  // Check if courses exist for the selected combination
  if (courseDatabase[faculty] && courseDatabase[faculty][department] && courseDatabase[faculty][department][level]) {
    const courses = courseDatabase[faculty][department][level]

    courseGrid.innerHTML = courses.map(course => `
      <div class="course-item">
        <input type="radio" id="${course.code.replace(/\s+/g, '_')}" name="course" value="${course.code}">
        <label for="${course.code.replace(/\s+/g, '_')}">
          <span class="course-code">${course.code}</span>
          <span class="course-name">${course.name}</span>
        </label>
      </div>
    `).join('')

    // Add event listeners to new course items
    const courseInputs = courseGrid.querySelectorAll('input[name="course"]')
    courseInputs.forEach(input => {
      input.addEventListener("change", updateSelectedCourse)
    })
  } else {
    courseGrid.innerHTML = `
      <div class="course-placeholder">
        <i class="fas fa-exclamation-triangle"></i>
        <p>No courses available for ${department} at ${level} level in ${faculty}.</p>
        <p>Please select a different combination or contact your department for course information.</p>
      </div>
    `
  }

  // Update display
  updateAcademicSummary()
}

// Function to update academic summary display
function updateAcademicSummary() {
  const faculty = document.getElementById("faculty").value
  const department = document.getElementById("department").value
  const level = document.getElementById("level").value

  document.getElementById("facultyDisplay").textContent = faculty || "Not selected"
  document.getElementById("departmentDisplay").textContent = department || "Not selected"
  document.getElementById("levelDisplay").textContent = level || "Not selected"

  // Count available courses
  let courseCount = 0
  if (faculty && department && level && courseDatabase[faculty] && courseDatabase[faculty][department] && courseDatabase[faculty][department][level]) {
    courseCount = courseDatabase[faculty][department][level].length
  }

  document.getElementById("coursesCount").textContent = `${courseCount} courses available`

  // Add validation feedback
  updateAcademicValidation()
}

// Function to update academic form validation
function updateAcademicValidation() {
  const faculty = document.getElementById("faculty").value
  const department = document.getElementById("department").value
  const level = document.getElementById("level").value

  // Faculty validation
  const facultyFeedback = document.querySelector('#faculty').parentElement.querySelector('.input-feedback')
  if (facultyFeedback) {
    if (faculty) {
      facultyFeedback.textContent = "✓ Faculty selected"
      facultyFeedback.className = "input-feedback success"
    } else {
      facultyFeedback.textContent = "✗ Please select a faculty"
      facultyFeedback.className = "input-feedback error"
    }
  }

  // Department validation
  const departmentFeedback = document.querySelector('#department').parentElement.querySelector('.input-feedback')
  if (departmentFeedback) {
    if (department) {
      departmentFeedback.textContent = "✓ Department selected"
      departmentFeedback.className = "input-feedback success"
    } else {
      departmentFeedback.textContent = "✗ Please select a department"
      departmentFeedback.className = "input-feedback error"
    }
  }

  // Level validation
  const levelFeedback = document.querySelector('#level').parentElement.querySelector('.input-feedback')
  if (levelFeedback) {
    if (level) {
      levelFeedback.textContent = "✓ Level selected"
      levelFeedback.className = "input-feedback success"
    } else {
      levelFeedback.textContent = "✗ Please select a level"
      levelFeedback.className = "input-feedback error"
    }
  }
}

function calculateOverallRating() {
  const radioGroups = [
    "instructor_a",
    "instructor_b",
    "instructor_c",
    "instructor_d",
    "course_a",
    "course_b",
    "course_c",
    "course_d",
    "equipment_a",
    "equipment_b",
  ]

  let totalScore = 0
  let answeredQuestions = 0

  radioGroups.forEach((groupName) => {
    const selectedRadio = document.querySelector(`input[name="${groupName}"]:checked`)
    if (selectedRadio) {
      totalScore += Number.parseInt(selectedRadio.value)
      answeredQuestions++
    }
  })

  // Calculate percentage (out of 5 for each question)
  if (answeredQuestions > 0) {
    overallRating = Math.round((totalScore / (answeredQuestions * 5)) * 100)
  } else {
    overallRating = 0
  }

  // Update display
  document.getElementById("overallRatingPercent").textContent = overallRating + "%"

  if (document.getElementById("overallRatingDisplay")) {
    document.getElementById("overallRatingDisplay").textContent = overallRating + "%"
  }
}

function collectFormData() {
  const formData = new FormData()

  // Collect all form data from the dashboard sections
  const inputs = document.querySelectorAll("input, textarea, select")
  inputs.forEach((input) => {
    if (input.type === "radio" && input.checked) {
      formData.append(input.name, input.value)
    } else if (input.type !== "radio") {
      formData.append(input.id || input.name, input.value)
    }
  })

  const data = {}

  // Basic info
  data.session = document.getElementById("session").value
  data.date = document.getElementById("evaluationDate").value
  data.faculty = document.getElementById("faculty")?.value || ""
  data.department = document.getElementById("department")?.value || ""
  data.level = document.getElementById("level")?.value || ""
  data.course = document.querySelector('input[name="course"]:checked')?.value

  // Instructor assessment
  data.instructor = {
    punctual: document.querySelector('input[name="instructor_a"]:checked')?.value,
    professional: document.querySelector('input[name="instructor_b"]:checked')?.value,
    knowledgeable: document.querySelector('input[name="instructor_c"]:checked')?.value,
    clear_objectives: document.querySelector('input[name="instructor_d"]:checked')?.value,
    comment: document.getElementById("instructorComment")?.value || "",
  }

  // Course assessment
  data.course_eval = {
    manual_quality: document.querySelector('input[name="course_a"]:checked')?.value,
    thinking_refined: document.querySelector('input[name="course_b"]:checked')?.value,
    learning_formats: document.querySelector('input[name="course_c"]:checked')?.value,
    responsive: document.querySelector('input[name="course_d"]:checked')?.value,
    comment: document.getElementById("courseComment")?.value || "",
  }

  // Equipment assessment
  data.equipment = {
    sufficient: document.querySelector('input[name="equipment_a"]:checked')?.value,
    relevant: document.querySelector('input[name="equipment_b"]:checked')?.value,
    comment: document.getElementById("equipmentComment")?.value || "",
  }

  // Contact info
  data.contact = {
    email: document.getElementById("studentEmail")?.value || "",
    phone: document.getElementById("studentPhone")?.value || "",
  }

  data.overallRating = overallRating

  return data
}

function previewForm() {
  const data = collectFormData()

  if (!data.course) {
    alert("Please select a course to evaluate before previewing.")
    return
  }

  const previewContent = generatePreviewHTML(data)
  document.getElementById("previewContent").innerHTML = previewContent
  document.getElementById("previewModal").style.display = "block"
}

function closePreview() {
  document.getElementById("previewModal").style.display = "none"
}

function generatePreviewHTML(data) {
  const getCheckboxHTML = (name, value) => {
    const selectedValue = document.querySelector(`input[name="${name}"]:checked`)?.value
    return `
      <td style="text-align: center; padding: 8px; border: 1px solid #333;">
        <div style="width: 15px; height: 15px; border: 2px solid #333; display: inline-block; position: relative;">
          ${selectedValue === value ? '<div style="position: absolute; top: 2px; left: 2px; width: 7px; height: 7px; background: #333;"></div>' : ""}
        </div>
      </td>
    `
  }

  return `
    <div class="preview-content" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 20px; padding: 20px; border: 2px solid #333;">
        <h1 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">STUDENT COURSE EVALUATION FORM</h1>
        <h2 style="margin: 0 0 5px 0; font-size: 14px; font-style: italic;">Ekiti State University.</h2>
        <h3 style="margin: 0 0 15px 0; font-size: 14px; font-style: italic;">Department of ${data.department || "____________"}</h3>
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <div>* For First and Second Semester Courses</div>
          <div>Session: ${data.session || "........................................"}</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
          <div>** Read Footer Information</div>
          <div>Date: ${data.date || ".......... / ............. / .............."}</div>
        </div>
      </div>

      <!-- Course Summary Section -->
      <div style="border: 2px solid #333; margin-bottom: 20px;">
        <div style="background: #e6e6e6; padding: 8px; font-weight: bold; border-bottom: 1px solid #333;">
          COURSE SUMMARY
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px;">
          <div><strong>Course:</strong> ${data.course || "____________"}</div>
          <div><strong>Level:</strong> ${data.level || "____________"}</div>
        </div>
      </div>

      <!-- Instructor Assessment Section -->
      <div style="border: 2px solid #333; margin-bottom: 20px;">
        <div style="background: #e6e6e6; padding: 8px; font-weight: bold; border-bottom: 1px solid #333;">
          INSTRUCTOR ASSESSMENT SECTION
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #333; padding: 8px; width: 60%;"></td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">1 = Poor</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">2 = Fair</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">3 = Satisfactory</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">4 = Good</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">5 = Excellent</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>a.</strong> The instructor was punctual and well organized for classes.</td>
            ${getCheckboxHTML("instructor_a", "1")}
            ${getCheckboxHTML("instructor_a", "2")}
            ${getCheckboxHTML("instructor_a", "3")}
            ${getCheckboxHTML("instructor_a", "4")}
            ${getCheckboxHTML("instructor_a", "5")}
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>b.</strong> The instructor was well-dressed and professional in appearance.</td>
            ${getCheckboxHTML("instructor_b", "1")}
            ${getCheckboxHTML("instructor_b", "2")}
            ${getCheckboxHTML("instructor_b", "3")}
            ${getCheckboxHTML("instructor_b", "4")}
            ${getCheckboxHTML("instructor_b", "5")}
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>c.</strong> The instructor demonstrated knowledge on the subject.</td>
            ${getCheckboxHTML("instructor_c", "1")}
            ${getCheckboxHTML("instructor_c", "2")}
            ${getCheckboxHTML("instructor_c", "3")}
            ${getCheckboxHTML("instructor_c", "4")}
            ${getCheckboxHTML("instructor_c", "5")}
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>d.</strong> The objectives, expectations, and grading policies were clearly stated and consistently implemented.</td>
            ${getCheckboxHTML("instructor_d", "1")}
            ${getCheckboxHTML("instructor_d", "2")}
            ${getCheckboxHTML("instructor_d", "3")}
            ${getCheckboxHTML("instructor_d", "4")}
            ${getCheckboxHTML("instructor_d", "5")}
          </tr>
          <tr>
            <td colspan="6" style="border: 1px solid #333; padding: 8px; font-style: italic;">
              In what ways did the instructor engage students as active participants in the learning process?
              <div style="margin-top: 5px; min-height: 30px; border: 1px solid #ccc; padding: 5px;">
                ${document.getElementById("instructorComment")?.value || ""}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Course Assessment Section -->
      <div style="border: 2px solid #333; margin-bottom: 20px;">
        <div style="background: #e6e6e6; padding: 8px; font-weight: bold; border-bottom: 1px solid #333;">
          COURSE ASSESSMENT SECTION
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #333; padding: 8px; width: 60%;"></td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">1 = Poor</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">2 = Fair</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">3 = Satisfactory</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">4 = Good</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">5 = Excellent</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>a.</strong> The Course Manual provided was informative and easy to follow.</td>
            ${getCheckboxHTML("course_a", "1")}
            ${getCheckboxHTML("course_a", "2")}
            ${getCheckboxHTML("course_a", "3")}
            ${getCheckboxHTML("course_a", "4")}
            ${getCheckboxHTML("course_a", "5")}
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>b.</strong> My thinking about the topic was refined by the course.</td>
            ${getCheckboxHTML("course_b", "1")}
            ${getCheckboxHTML("course_b", "2")}
            ${getCheckboxHTML("course_b", "3")}
            ${getCheckboxHTML("course_b", "4")}
            ${getCheckboxHTML("course_b", "5")}
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>c.</strong> The instructor employed a variety of effective learning formats:</td>
            ${getCheckboxHTML("course_c", "1")}
            ${getCheckboxHTML("course_c", "2")}
            ${getCheckboxHTML("course_c", "3")}
            ${getCheckboxHTML("course_c", "4")}
            ${getCheckboxHTML("course_c", "5")}
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>d.</strong> The instructor was generally responsive to students' needs.</td>
            ${getCheckboxHTML("course_d", "1")}
            ${getCheckboxHTML("course_d", "2")}
            ${getCheckboxHTML("course_d", "3")}
            ${getCheckboxHTML("course_d", "4")}
            ${getCheckboxHTML("course_d", "5")}
          </tr>
          <tr>
            <td colspan="6" style="border: 1px solid #333; padding: 8px; font-style: italic;">
              Comments about the Course:
              <div style="margin-top: 5px; min-height: 30px; border: 1px solid #ccc; padding: 5px;">
                ${document.getElementById("courseComment")?.value || ""}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Equipment Assessment Section -->
      <div style="border: 2px solid #333; margin-bottom: 20px;">
        <div style="background: #e6e6e6; padding: 8px; font-weight: bold; border-bottom: 1px solid #333;">
          EQUIPMENT ASSESSMENT SECTION (If applicable)
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #333; padding: 8px; width: 60%;"></td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">1 = Poor</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">2 = Fair</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">3 = Satisfactory</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">4 = Good</td>
            <td style="border: 1px solid #333; padding: 8px; text-align: center; font-size: 12px;">5 = Excellent</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>a.</strong> There was sufficient equipment in the laboratory for individual hands-on practice.</td>
            ${getCheckboxHTML("equipment_a", "1")}
            ${getCheckboxHTML("equipment_a", "2")}
            ${getCheckboxHTML("equipment_a", "3")}
            ${getCheckboxHTML("equipment_a", "4")}
            ${getCheckboxHTML("equipment_a", "5")}
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 8px;"><strong>b.</strong> The work done with laboratory equipment are relevant to the course content.</td>
            ${getCheckboxHTML("equipment_b", "1")}
            ${getCheckboxHTML("equipment_b", "2")}
            ${getCheckboxHTML("equipment_b", "3")}
            ${getCheckboxHTML("equipment_b", "4")}
            ${getCheckboxHTML("equipment_b", "5")}
          </tr>
          <tr>
            <td colspan="6" style="border: 1px solid #333; padding: 8px; font-style: italic;">
              Comments about the equipment:
              <div style="margin-top: 5px; min-height: 30px; border: 1px solid #ccc; padding: 5px;">
                ${document.getElementById("equipmentComment")?.value || ""}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Optional Section -->
      <div style="border: 2px solid #333; margin-bottom: 20px;">
        <div style="background: #e6e6e6; padding: 8px; font-weight: bold; border-bottom: 1px solid #333;">
          ***OPTIONAL
        </div>
        <div style="padding: 10px; font-style: italic; border-bottom: 1px solid #333;">
          If you want to be contacted regarding additional courses or for more information, please feel free to include your contact information below:
        </div>
        <div style="display: flex;">
          <div style="flex: 1; border-right: 1px solid #333; padding: 10px;">
            <strong>E-mail:</strong>
            <div style="margin-top: 5px; padding: 5px; border: 1px solid #ccc; min-height: 20px;">
              ${data.contact.email || ""}
            </div>
          </div>
          <div style="flex: 1; border-right: 1px solid #333; padding: 10px;">
            <strong>Phone:</strong>
            <div style="margin-top: 5px; padding: 5px; border: 1px solid #ccc; min-height: 20px;">
              ${data.contact.phone || ""}
            </div>
          </div>
          <div style="padding: 10px; text-align: center; min-width: 120px;">
            <div style="font-weight: bold;">Overall Rating:</div>
            <div style="font-size: 24px; font-weight: bold; margin-top: 5px;">${data.overallRating}%</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="font-size: 10px; font-style: italic; margin-top: 20px; padding: 10px; border-top: 1px solid #333;">
        ** Course evaluations give you the opportunity to express views about a course and the way it was taught. The faculty/departmental administration
        tailors such responses towards <strong>ensuring that the quality of teaching is assured</strong>, and so it is important that you answer thoroughly and honestly.
      </div>
    </div>
  `
}

async function downloadPDF() {
  const data = collectFormData()

  if (!data.course) {
    alert("Please select a course to evaluate before downloading.")
    return
  }

  showLoading()

  try {
    const { jsPDF } = window.jspdf
    const pdf = new jsPDF("p", "mm", "a4")

    // Header
    pdf.setFontSize(14)
    pdf.setFont(undefined, "bold")
    pdf.text("STUDENT COURSE EVALUATION FORM", 105, 20, { align: "center" })

    pdf.setFontSize(12)
    pdf.setFont(undefined, "italic")
    pdf.text("Ekiti State University.", 105, 28, { align: "center" })
    const deptName = document.getElementById("department")?.value || "Department"
    pdf.text(`Department of ${deptName}`, 105, 35, { align: "center" })

    // Basic info
    pdf.setFontSize(10)
    pdf.setFont(undefined, "normal")
    pdf.text("* For First and Second Semester Courses", 20, 45)
    pdf.text(`Session: ${data.session || "........................................"}`, 120, 45)
    pdf.text("** Read Footer Information", 20, 52)
    pdf.text(`Date: ${data.date || ".......... / ............. / .............."}`, 120, 52)

    // Draw border around header
    pdf.rect(15, 10, 180, 50)

    let yPos = 70

    // Course Summary Section (compact)
    pdf.setFont(undefined, "bold")
    pdf.text("COURSE SUMMARY", 20, yPos)
    yPos += 6
    pdf.setFont(undefined, "normal")
    const levelValue = document.getElementById("level")?.value || "________"
    const courseValue = data.course || "Not selected"
    pdf.rect(20, yPos, 170, 12)
    pdf.text(`Course: ${courseValue}`, 24, yPos + 8)
    pdf.text(`Level: ${levelValue}`, 120, yPos + 8)
    yPos += 18

    // Helper function to draw rating table
    const drawRatingTable = (title, questions, dataPrefix, yStart) => {
      let y = yStart

      // Section header
      pdf.setFont(undefined, "bold")
      pdf.rect(20, y, 170, 8, "F")
      pdf.text(title, 22, y + 5)
      y += 8

      // Rating scale header
      pdf.setFont(undefined, "normal")
      pdf.setFontSize(8)
      const ratings = ["Poor", "Fair", "Satisfactory", "Good", "Excellent"]
      pdf.rect(20, y, 100, 6)
      for (let i = 0; i < 5; i++) {
        pdf.rect(120 + i * 14, y, 14, 6)
        pdf.text(ratings[i], 127 + i * 14, y + 4, { align: "center" })
      }
      y += 6

      // Questions
      pdf.setFontSize(8)
      questions.forEach((question, index) => {
        const questionHeight = 10
        pdf.rect(20, y, 100, questionHeight)

        // Split long text
        const splitText = pdf.splitTextToSize(question, 95)
        pdf.text(splitText, 22, y + 4)

        // Rating checkboxes
        for (let i = 1; i <= 5; i++) {
          pdf.rect(120 + (i - 1) * 12, y, 12, questionHeight)
          pdf.rect(124 + (i - 1) * 12, y + 3.5, 3.5, 3.5)

          const selectedValue = document.querySelector(
            `input[name="${dataPrefix}_${String.fromCharCode(97 + index)}"]:checked`,
          )?.value
          if (selectedValue === i.toString()) {
            pdf.rect(125 + (i - 1) * 12, y + 4.5, 2, 2, "F")
          }
        }

        y += questionHeight
      })

      return y
    }

    // Instructor Assessment
    const instructorQuestions = [
      "a. The instructor was punctual and well organized for classes.",
      "b. The instructor was well-dressed and professional in appearance.",
      "c. The instructor demonstrated knowledge on the subject.",
      "d. The objectives, expectations, and grading policies were clearly stated and consistently implemented.",
    ]
    yPos = drawRatingTable("INSTRUCTOR ASSESSMENT SECTION", instructorQuestions, "instructor", yPos)

    // Course Assessment (single page target)

    const courseQuestions = [
      "a. The Course Manual provided was informative and easy to follow.",
      "b. My thinking about the topic was refined by the course.",
      "c. The instructor employed a variety of effective learning formats:",
      "d. The instructor was generally responsive to students' needs.",
    ]
    yPos = drawRatingTable("COURSE ASSESSMENT SECTION", courseQuestions, "course", yPos)

    // Omit Equipment section to keep within one page

    // Compact overall rating only
    yPos += 8
    pdf.setFont(undefined, "bold")
    pdf.text("Overall Rating:", 20, yPos)
    pdf.setFontSize(12)
    pdf.text(`${data.overallRating}%`, 60, yPos)

    // Footer
    yPos += 25
    pdf.setFontSize(8)
    pdf.setFont(undefined, "italic")
    const footerText =
      "** Course evaluations give you the opportunity to express views about a course and the way it was taught. Please answer thoroughly and honestly."
    pdf.text(pdf.splitTextToSize(footerText, 170), 20, yPos)

    // Save the PDF
    pdf.save(`Course_Evaluation_${data.course}_${new Date().toISOString().split("T")[0]}.pdf`)

    hideLoading()
    alert("PDF downloaded successfully!")
  } catch (error) {
    hideLoading()
    console.error("Error generating PDF:", error)
    alert("Error generating PDF. Please try again.")
  }
}

async function sendEmail() {
  const data = collectFormData()

  if (!data.course) {
    alert("Please select a course to evaluate before sending email.")
    return
  }

  showLoading()

  try {
    // Generate PDF blob for attachment
    const { jsPDF } = window.jspdf
    const pdf = new jsPDF()

    // Add content to PDF (same as downloadPDF function)
    pdf.setFontSize(16)
    pdf.setFont(undefined, "bold")
    pdf.text("STUDENT COURSE EVALUATION FORM", 105, 20, { align: "center" })

    pdf.setFontSize(12)
    pdf.text("Ekiti State University - Department of Computer Science", 105, 30, { align: "center" })

    // Add basic info and sections (abbreviated for space)
    pdf.setFont(undefined, "normal")
    pdf.setFontSize(10)
    const yPos = 50

    pdf.text(`Session: ${data.session || "Not specified"}`, 20, yPos)
    pdf.text(`Course: ${data.course || "Not selected"}`, 20, yPos + 10)
    pdf.text(`Overall Rating: ${data.overallRating}%`, 20, yPos + 20)

    // Get PDF as base64
    const pdfBase64 = pdf.output("datauristring").split(",")[1]

    // Prepare email content
    const emailContent = `
            Course Evaluation Submission
            
            Session: ${data.session || "Not specified"}
            Date: ${data.date || "Not specified"}
            Course: ${data.course || "Not selected"}
            Overall Rating: ${data.overallRating}%
            
            This evaluation has been submitted by a student from Ekiti State University, Department of Computer Science.
            
            Please find the detailed evaluation attached as a PDF.
        `

    // Send email using EmailJS
    const templateParams = {
      to_email: "akoredesalaudeen@gmail.com",
      subject: `Course Evaluation - ${data.course} - ${data.session}`,
      message: emailContent,
      attachment: pdfBase64,
      filename: `Course_Evaluation_${data.course}_${new Date().toISOString().split("T")[0]}.pdf`,
    }

    // Note: You'll need to set up EmailJS service and template
    // This is a placeholder for the actual EmailJS call
    console.log("Email would be sent with:", templateParams)

    // For actual EmailJS implementation, you would use:
    // await window.emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000))

    hideLoading()
    alert("Evaluation sent successfully to akoredesalaudeen@gmail.com!")
  } catch (error) {
    hideLoading()
    console.error("Error sending email:", error)
    alert("Error sending email. Please try again or download the PDF manually.")
  }
}

function logout() {
  // Show confirmation dialog
  if (confirm("Are you sure you want to logout? Any unsaved progress will be lost.")) {
    showLoading()

    // Clear localStorage
    localStorage.clear()

    // Clear all form data
    const inputs = document.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      if (input.type === "radio" || input.type === "checkbox") {
        input.checked = false
      } else {
        input.value = ""
      }
    })

    // Reset global variables
    overallRating = 0
    currentSection = "overview"

    // Reset dashboard stats
    document.getElementById("completedSections").textContent = "0"
    document.getElementById("overallRatingDisplay").textContent = "0%"
    document.getElementById("overallRatingPercent").textContent = "0%"
    document.getElementById("selectedCourse").textContent = "None"
    document.getElementById("overallProgress").style.width = "0%"
    document.getElementById("progressText").textContent = "0% Complete"

    // Navigate back to overview
    showSection("overview")

    // Set current date again
    document.getElementById("evaluationDate").value = new Date().toISOString().split("T")[0]

    // Simulate logout process and redirect
    setTimeout(() => {
      hideLoading()
      alert("You have been logged out successfully. Redirecting to landing page...")

      // Redirect to landing page (you can change this URL to your actual landing page)
      window.location.href = "/index.html" // or "/" for root, or any other landing page URL
    }, 1500)
  }
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("previewModal")
  if (event.target === modal) {
    closePreview()
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePreview()
  }
})

window.showSection = showSection
