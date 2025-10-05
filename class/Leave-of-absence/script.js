// Global variables
let currentUser = null
let applications = []
let currentApplication = null
let users = [] // Declare users variable

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Force landing page to show first
  showPage("landing-page")
  initializeApp()
  setupEventListeners()
  loadUserData()
})

function initializeApp() {
  // Always start with landing page - don't auto-show dashboard
  // Check if user is logged in but don't redirect automatically
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    // Don't automatically show dashboard - let user navigate manually
  }

  // Load applications from localStorage
  const savedApplications = localStorage.getItem("applications")
  if (savedApplications) {
    applications = JSON.parse(savedApplications)
  }
}

function setupEventListeners() {
  // Navigation toggle
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Form submissions
  document.getElementById("login-form").addEventListener("submit", handleLogin)
  document.getElementById("signup-form").addEventListener("submit", handleSignup)
  document.getElementById("reset-form").addEventListener("submit", handlePasswordReset)
  document.getElementById("leave-form").addEventListener("submit", handleLeaveApplication)
  document.getElementById("profile-form").addEventListener("submit", handleProfileUpdate)

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.classList.remove("active")
      }
    })
  })

  // Password visibility toggle
  document.querySelectorAll(".password-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const inputId = this.getAttribute("data-input-id")
      togglePassword(inputId)
    })
  })
}

// Page navigation
function showPage(pageId) {
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => page.classList.remove("active"))
  document.getElementById(pageId).classList.add("active")

  // Close mobile menu if open
  const navMenu = document.getElementById("nav-menu")
  if (navMenu) {
    navMenu.classList.remove("active")
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// Authentication functions
function showAuthForm(formType) {
  const forms = document.querySelectorAll(".auth-form")
  const tabs = document.querySelectorAll(".tab-btn")

  forms.forEach((form) => form.classList.remove("active"))
  tabs.forEach((tab) => tab.classList.remove("active"))

  document.getElementById(`${formType}-form`).classList.add("active")
  event.target.classList.add("active")
}

function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  // Get users from localStorage
  const usersData = JSON.parse(localStorage.getItem("users") || "[]")
  const user = usersData.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))
    showMessage("Login successful!", "success")
    showPage("dashboard-page")
    updateDashboard()
    loadProfileData()
  } else {
    showMessage("Invalid email or password!", "error")
  }
}

function handleSignup(event) {
  event.preventDefault()

  const name = document.getElementById("signup-name").value
  const studentId = document.getElementById("signup-student-id").value
  const department = document.getElementById("signup-department").value
  const faculty = document.getElementById("signup-faculty").value
  const email = document.getElementById("signup-email").value
  const phone = document.getElementById("signup-phone").value
  const level = document.getElementById("signup-level").value
  const address = document.getElementById("signup-address").value
  const password = document.getElementById("signup-password").value
  const confirmPassword = document.getElementById("signup-confirm-password").value

  if (password !== confirmPassword) {
    showMessage("Passwords do not match!", "error")
    return
  }

  // Get existing users
  const usersData = JSON.parse(localStorage.getItem("users") || "[]")

  // Check if user already exists
  if (usersData.find((u) => u.email === email || u.studentId === studentId)) {
    showMessage("User with this email or student ID already exists!", "error")
    return
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    studentId,
    department,
    faculty,
    email,
    phone,
    level,
    address,
    password,
    createdAt: new Date().toISOString(),
  }

  usersData.push(newUser)
  localStorage.setItem("users", JSON.stringify(usersData))

  showMessage("Account created successfully! Please login.", "success")
  showAuthForm("login")

  // Clear form
  document.getElementById("signup-form").reset()
}

let resetStep = "email" // 'email' or 'otp'
let resetEmail = ""
let generatedOTP = ""

function handlePasswordReset(event) {
  event.preventDefault()

  if (resetStep === "email") {
    resetEmail = document.getElementById("reset-email").value

    // Generate 6-digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()

    // Simulate sending OTP (in real app, this would be sent via email)
    console.log(`OTP sent to ${resetEmail}: ${generatedOTP}`) // For testing

    // Show OTP section
    document.getElementById("otp-section").style.display = "block"
    document.getElementById("reset-btn").textContent = "Reset Password"
    resetStep = "otp"

    showMessage(`OTP sent to ${resetEmail}. Check your email and enter the code below.`, "info")
  } else {
    // Verify OTP and reset password
    const enteredOTP = document.getElementById("otp-code").value
    const newPassword = document.getElementById("new-password").value
    const confirmPassword = document.getElementById("confirm-new-password").value

    if (enteredOTP !== generatedOTP) {
      showMessage("Invalid OTP. Please try again.", "error")
      return
    }

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match.", "error")
      return
    }

    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters long.", "error")
      return
    }

    // Update password in localStorage (in real app, this would update the database)
    const usersData = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = usersData.findIndex((user) => user.email === resetEmail)

    if (userIndex !== -1) {
      usersData[userIndex].password = newPassword
      localStorage.setItem("users", JSON.stringify(usersData))
      showMessage("Password reset successfully! You can now login with your new password.", "success")
    } else {
      showMessage("User not found. Please sign up first.", "error")
    }

    // Reset form and go back to login
    document.getElementById("reset-form").reset()
    document.getElementById("otp-section").style.display = "none"
    document.getElementById("reset-btn").textContent = "Send Reset Code"
    resetStep = "email"
    showAuthForm("login")
  }
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")

  // Clear all forms
  document.getElementById("login-form").reset()
  document.getElementById("signup-form").reset()
  document.getElementById("reset-form").reset()
  document.getElementById("leave-form").reset()

  showMessage("Logged out successfully!", "info")
  showPage("landing-page")
}

// Dashboard functions
function updateDashboard() {
  if (!currentUser) return

  // Update user name
  document.getElementById("user-name").textContent = `Welcome, ${currentUser.name}`

  // Update statistics
  const userApplications = applications.filter((app) => app.userId === currentUser.id)

  document.getElementById("sent-count").textContent = userApplications.length
  document.getElementById("pending-count").textContent = userApplications.filter(
    (app) => app.status === "pending",
  ).length
  document.getElementById("approved-count").textContent = userApplications.filter(
    (app) => app.status === "approved",
  ).length
  document.getElementById("rejected-count").textContent = userApplications.filter(
    (app) => app.status === "rejected",
  ).length
  document.getElementById("cancelled-count").textContent = userApplications.filter(
    (app) => app.status === "cancelled",
  ).length

  // Update recent applications
  updateRecentApplications()
  updateApplicationsList()
}

function showDashboardSection(sectionId) {
  const sections = document.querySelectorAll(".dashboard-section")
  const menuItems = document.querySelectorAll(".sidebar-menu a")

  sections.forEach((section) => section.classList.remove("active"))
  menuItems.forEach((item) => item.classList.remove("active"))

  document.getElementById(`${sectionId}-section`).classList.add("active")
  event.target.classList.add("active")
}

function getApprovalStatus(submittedAt, currentStatus) {
  if (currentStatus !== "pending") return currentStatus === "auto-approved" ? "approved" : currentStatus

  const approvalTime = calculateApprovalTime(submittedAt)
  const now = new Date()

  if (now >= approvalTime) {
    return "approved"
  } else {
    const hoursLeft = Math.ceil((approvalTime - now) / (1000 * 60 * 60))
    const minutesLeft = Math.floor(((approvalTime - now) % (1000 * 60 * 60)) / (1000 * 60))
    const secondsLeft = Math.floor(((approvalTime - now) % (1000 * 60)) / 1000)
    return `pending (${hoursLeft}h ${minutesLeft}m ${secondsLeft}s remaining)`
  }
}

function updateRecentApplications() {
  const recentAppsList = document.getElementById("recent-apps-list")
  const userApplications = applications
    .filter((app) => app.userId === currentUser.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5)

  if (userApplications.length === 0) {
    recentAppsList.innerHTML =
      '<p class="no-applications">No applications yet. <a href="#" onclick="showDashboardSection(\'apply\')">Apply for leave</a></p>'
    return
  }

  recentAppsList.innerHTML = userApplications
    .map((app) => {
      const displayStatus = app.status === "auto-approved" ? "approved" : app.status
      return `
        <div class="application-item">
            <div class="application-info">
                <h4>${app.leaveType}</h4>
                <p>Submitted: ${new Date(app.submittedAt).toLocaleDateString()}</p>
                <p>Duration: ${app.duration}</p>
            </div>
            <div class="application-actions">
                <span class="status-badge status-${displayStatus}">${displayStatus}</span>
            </div>
        </div>
    `
    })
    .join("")
}

function calculateApprovalTime(submittedAt) {
  const submissionDate = new Date(submittedAt)
  const approvalDate = new Date(submissionDate.getTime() + 5 * 60 * 60 * 1000) // Add 5 hours
  return approvalDate
}

function updateApplicationsList() {
  const applicationsList = document.getElementById("applications-list")
  const userApplications = applications
    .filter((app) => app.userId === currentUser.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  if (userApplications.length === 0) {
    applicationsList.innerHTML = '<p class="no-applications">No applications found.</p>'
    return
  }

  applicationsList.innerHTML = userApplications
    .map((app) => {
      const approvalStatus = getApprovalStatus(app.submittedAt, app.status)
      const approvalTime = calculateApprovalTime(app.submittedAt)

      return `
        <div class="application-item" data-app-id="${app.id}">
            <div class="application-info">
                <h4>${app.leaveType}</h4>
                <p><strong>Session:</strong> ${app.session || "Not specified"}</p>
                <p><strong>Semester:</strong> ${app.semester || "Not specified"}</p>
                <p><strong>Duration:</strong> ${app.duration}</p>
                <p><strong>Start Date:</strong> ${new Date(app.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${new Date(app.endDate).toLocaleDateString()}</p>
                <p><strong>Submitted:</strong> ${new Date(app.submittedAt).toLocaleDateString()}</p>
                ${app.status === "pending" ? `<p><strong>Expected Approval:</strong> ${approvalTime.toLocaleString()}</p>` : ""}
            </div>
            <div class="application-actions">
                <span class="status-badge status-${app.status.replace(" ", "-").replace("(", "").replace(")", "")}">${approvalStatus}</span>
                <button class="btn btn-outline" onclick="viewApplication('${app.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                ${
                  app.status === "pending"
                    ? `<button class="btn btn-danger" onclick="cancelApplication('${app.id}')">
                    <i class="fas fa-times"></i> Cancel
                </button>`
                    : ""
                }
                ${
                  app.status === "cancelled"
                    ? `<button class="btn btn-danger" onclick="deleteApplication('${app.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>`
                    : ""
                }
            </div>
        </div>
    `
    })
    .join("")
}

// Leave application functions
function handleLeaveApplication(event) {
  event.preventDefault()

  const formData = {
    id: Date.now().toString(),
    userId: currentUser.id,
    leaveType: document.getElementById("leave-type").value,
    duration: document.getElementById("leave-duration").value,
    session: document.getElementById("leave-session").value,
    semester: document.getElementById("leave-semester").value,
    startDate: document.getElementById("start-date").value,
    endDate: document.getElementById("end-date").value,
    reason: document.getElementById("leave-reason").value,
    emergencyContact: document.getElementById("emergency-contact").value,
    status: "pending",
    submittedAt: new Date().toISOString(),
  }

  applications.push(formData)
  localStorage.setItem("applications", JSON.stringify(applications))

  showMessage("Leave application submitted successfully! Expected approval in 5 hours.", "success")
  document.getElementById("leave-form").reset()
  updateDashboard()
  showDashboardSection("applications")
}

function previewApplication() {
  const formData = {
    leaveType: document.getElementById("leave-type").value,
    duration: document.getElementById("leave-duration").value,
    session: document.getElementById("leave-session").value,
    semester: document.getElementById("leave-semester").value,
    startDate: document.getElementById("start-date").value,
    endDate: document.getElementById("end-date").value,
    reason: document.getElementById("leave-reason").value,
    emergencyContact: document.getElementById("emergency-contact").value,
  }

  // Validate form
  if (
    !formData.leaveType ||
    !formData.duration ||
    !formData.session ||
    !formData.semester ||
    !formData.startDate ||
    !formData.endDate ||
    !formData.reason ||
    !formData.emergencyContact
  ) {
    showMessage("Please fill in all required fields!", "error")
    return
  }

  currentApplication = formData
  generateApplicationPreview(formData)
  showModal("preview-modal")
}

// function generateApplicationPreview(data) {
//   const preview = document.getElementById("application-preview")

//   preview.innerHTML = `
//         <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
//             <!-- School Letterhead -->
//             <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px;">
//                 <h1 style="color: #0ea5e9; margin-bottom: 5px; font-size: 28px;">EKITI STATE UNIVERSITY</h1>
//                 <p style="color: #334155; margin: 5px 0; font-size: 16px;">ADO-EKITI, EKITI STATE, NIGERIA</p>
//                 <p style="color: #64748b; margin: 5px 0; font-size: 14px;">Tel: +234-803-XXX-XXXX | Email: info@eksu.edu.ng</p>
//                 <p style="color: #64748b; margin: 5px 0; font-size: 14px;">Website: www.eksu.edu.ng</p>
//             </div>
            
//             <!-- Letter Content -->
//             <div style="margin-bottom: 30px;">
//                 <p style="text-align: right; margin-bottom: 20px; color: #64748b;">Date: ${new Date().toLocaleDateString("en-GB")}</p>
                
//                 <div style="margin-bottom: 30px;">
//                     <p style="margin-bottom: 5px;"><strong>To:</strong></p>
//                     <p style="margin-left: 20px; color: #334155;">The Registrar,<br>
//                     Academic Affairs Division,<br>
//                     Ekiti State University,<br>
//                     Ado-Ekiti, Ekiti State.</p>
//                 </div>
                
//                 <div style="margin-bottom: 30px;">
//                     <p style="margin-bottom: 5px;"><strong>From:</strong></p>
//                     <p style="margin-left: 20px; color: #334155;">
//                         <strong>Name:</strong> Omojeje Gbadebo<br>
//                         <strong>Matric No:</strong> 230902988<br>
//                         <strong>Level:</strong> 200 Level<br>
//                         <strong>Department:</strong> ${currentUser.department || "Computer Science"}<br>
//                         <strong>Faculty:</strong> ${currentUser.faculty || "Science"}<br>
//                         <strong>Phone:</strong> 2340998770889<br>
//                         <strong>Email:</strong> ${currentUser.email || "omojeje.gbadebo@student.eksu.edu.ng"}
//                     </p>
//                 </div>
                
//                 <div style="text-align: center; margin: 30px 0;">
//                     <h3 style="color: #0ea5e9; text-decoration: underline; margin: 0;">
//                         APPLICATION FOR LEAVE OF ABSENCE
//                     </h3>
//                 </div>
                
//                 <div style="margin-bottom: 25px;">
//                     <p style="color: #334155; margin-bottom: 15px;">Dear Sir/Madam,</p>
                          
                    
//                     <p style="color: #334155; margin-bottom: 15px; text-align: justify;">
//                         ${data.reason}
//                     </p>              
//                     <p style="color: #334155; margin-bottom: 15px; text-align: justify;">
//                         <strong>Period of Leave:</strong> From <strong>${new Date(data.startDate).toLocaleDateString("en-GB")}</strong> 
//                         to <strong>${new Date(data.endDate).toLocaleDateString("en-GB")}</strong>
//                     </p>
                    
//                     <p style="color: #334155; margin-bottom: 15px; text-align: justify;">
//                         During my absence, I can be reached through my emergency contact: 
//                         <strong>${data.emergencyContact}</strong>
//                     </p>
                    
//                     <p style="color: #334155; margin-bottom: 5px;">Yours faithfully,</p>
//                 </div>
                
//                 <!-- Signature Section -->
//                 <div style="margin-top: 40px;">
//                     <div style="display: inline-block; margin-right: 100px;">
//                         <div style="border-bottom: 2px solid #334155; width: 200px; margin-bottom: 5px; height: 40px;"></div>
//                         <p style="margin: 0; color: #334155;"><strong>Omojeje Gbadebo</strong></p>
//                         <p style="margin: 0; color: #64748b; font-size: 14px;">Student Signature</p>
//                         <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Matric No: 230902988</p>
//                     </div>
//                 </div>
                
//                 <!-- Official Use Section -->
//                 <div style="margin-top: 60px; border-top: 2px solid #e2e8f0; padding-top: 20px;">
//                     <h4 style="color: #0ea5e9; margin-bottom: 20px;">FOR OFFICIAL USE ONLY</h4>
                    
//                     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
//                         <div>
//                             <p style="margin-bottom: 30px; color: #334155;"><strong>Head of Department:</strong></p>
//                             <div style="border-bottom: 2px solid #334155; width: 200px; margin-bottom: 5px;"></div>
//                             <p style="font-size: 14px; color: #64748b;">Signature & Date</p>
//                         </div>
//                         <div>
//                             <p style="margin-bottom: 30px; color: #334155;"><strong>Dean of Faculty:</strong></p>
//                             <div style="border-bottom: 2px solid #334155; width: 200px; margin-bottom: 5px;"></div>
//                             <p style="font-size: 14px; color: #64748b;">Signature & Date</p>
//                         </div>
//                     </div>
                    
//                     <div>
//                         <p style="margin-bottom: 30px; color: #334155;"><strong>Registrar's Decision:</strong></p>
//                         <div style="border: 2px solid #e2e8f0; padding: 15px; min-height: 80px; background: #f8fafc;"></div>
//                         <div style="margin-top: 20px;">
//                             <div style="border-bottom: 2px solid #334155; width: 200px; margin-bottom: 5px;"></div>
//                             <p style="font-size: 14px; color: #64748b;">Registrar's Signature & Date</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `
// }

// function generateApplicationPreview(data) {
//   const preview = document.getElementById("application-preview")
//   const today = new Date().toLocaleDateString()

//   preview.innerHTML = `
//     <div style="font-family: 'Times New Roman', serif; line-height: 1.6; color: #000; max-width: 800px; margin: 0 auto; padding: 20px;">
//         <!-- Header -->
//         <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #000; padding-bottom: 20px;">
//             <h1 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase;">EKITI STATE UNIVERSITY</h1>
//             <p style="margin: 5px 0; font-size: 16px; font-weight: bold;">ADO-EKITI, EKITI STATE</p>
//             <p style="margin: 5px 0; font-size: 14px;">OFFICE OF THE REGISTRAR</p>
//             <p style="margin: 5px 0; font-size: 14px;">Tel: +234-30-250249, Email: registrar@eksu.edu.ng</p>
//         </div>
        
//         <!-- Reference and Date -->
//         <div style="margin-bottom: 20px;">
//             <p style="margin: 0; font-size: 12px;"><strong>Ref: EKSU/REG/LOA/${currentUser.studentId}/${new Date().getFullYear()}</strong></p>
//             <p style="margin: 0; font-size: 12px; text-align: right;"><strong>Date: ${today}</strong></p>
//         </div>
        
//         <!-- Title -->
//         <div style="text-align: center; margin-bottom: 30px;">
//             <h2 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase; text-decoration: underline;">APPLICATION FOR LEAVE OF ABSENCE</h2>
//         </div>
        
//         <!-- Student Information Section -->
//         <div style="margin-bottom: 25px;">
//             <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 15px; text-decoration: underline;">STUDENT INFORMATION:</h3>
            
//             <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
//                 <tr>
//                     <td style="padding: 5px; width: 25%; font-weight: bold;">Matric No:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000; width: 25%;">${currentUser.studentId}</td>
//                     <td style="padding: 5px; width: 25%; font-weight: bold; padding-left: 20px;">Full Name:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000; width: 25%;">${currentUser.name}</td>
//                 </tr>
//                 <tr>
//                     <td style="padding: 5px; font-weight: bold;">Department:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${currentUser.department || "Not specified"}</td>
//                     <td style="padding: 5px; font-weight: bold; padding-left: 20px;">Faculty:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${currentUser.faculty || "Not specified"}</td>
//                 </tr>
//                 <tr>
//                     <td style="padding: 5px; font-weight: bold;">Level:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${currentUser.level}</td>
//                     <td style="padding: 5px; font-weight: bold; padding-left: 20px;">Session:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${data.session || "Not specified"}</td>
//                 </tr>
//                 <tr>
//                     <td style="padding: 5px; font-weight: bold;">Semester:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${data.semester || "Not specified"}</td>
//                     <td style="padding: 5px; font-weight: bold; padding-left: 20px;">Phone:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${currentUser.phone}</td>
//                 </tr>
//                 <tr>
//                     <td style="padding: 5px; font-weight: bold;">Email:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;" colspan="3">${currentUser.email}</td>
//                 </tr>
//                 <tr>
//                     <td style="padding: 5px; font-weight: bold;">Home Address:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;" colspan="3">${currentUser.address || "Not provided"}</td>
//                 </tr>
//             </table>
//         </div>
        
//         <!-- Leave Details Section -->
//         <div style="margin-bottom: 25px;">
//             <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 15px; text-decoration: underline;">LEAVE DETAILS:</h3>
            
//             <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
//                 <tr>
//                     <td style="padding: 5px; width: 25%; font-weight: bold;">Type of Leave:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000; width: 25%;">${data.leaveType}</td>
//                     <td style="padding: 5px; width: 25%; font-weight: bold; padding-left: 20px;">Duration:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000; width: 25%;">${data.duration}</td>
//                 </tr>
//                 <tr>
//                     <td style="padding: 5px; font-weight: bold;">Commencement Date:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${new Date(data.startDate).toLocaleDateString()}</td>
//                     <td style="padding: 5px; font-weight: bold; padding-left: 20px;">Resumption Date:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;">${new Date(data.endDate).toLocaleDateString()}</td>
//                 </tr>
//                 <tr>
//                     <td style="padding: 5px; font-weight: bold;">Emergency Contact:</td>
//                     <td style="padding: 5px; border-bottom: 1px solid #000;" colspan="3">${data.emergencyContact}</td>
//                 </tr>
//             </table>
//         </div>
        
//         <!-- Reason Section -->
//         <div style="margin-bottom: 25px;">
//             <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; text-decoration: underline;">REASON FOR LEAVE:</h3>
//             <div style="border: 1px solid #000; padding: 10px; min-height: 80px; font-size: 12px;">
//                 ${data.reason}
//             </div>
//         </div>
        
//         <!-- Declaration Section -->
//         <div style="margin-bottom: 25px;">
//             <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; text-decoration: underline;">DECLARATION:</h3>
//             <p style="text-align: justify; margin-bottom: 15px; font-size: 12px;">
//                 I hereby apply for leave of absence as stated above. I understand that this application is subject to approval by the appropriate authority and that I must not assume approval until officially notified.
//             </p>
//         </div>
        
//         <!-- Signatures Section -->
//         <div style="margin-top: 30px;">
//             <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
//                 <tr>
//                     <td style="width: 50%; text-align: left; padding: 15px 0;">
//                         <div style="border-top: 1px solid #000; width: 150px; margin-bottom: 5px;"></div>
//                         <p style="margin: 0; font-weight: bold;">Student's Signature</p>
//                         <p style="margin: 5px 0 0 0;">Date: ${today}</p>
//                     </td>
//                     <td style="width: 50%; text-align: right; padding: 15px 0;">
//                         <div style="border-top: 1px solid #000; width: 150px; margin: 0 0 5px auto;"></div>
//                         <p style="margin: 0; font-weight: bold;">Head of Department</p>
//                         <p style="margin: 5px 0 0 0;">Date: _______________</p>
//                     </td>
//                 </tr>
//             </table>
//         </div>
        
//         <!-- Approval Section
//         <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 20px;">
//             <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 15px; text-decoration: underline;">FOR OFFICIAL USE ONLY:</h3>
//             <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
//                 <tr>
//                     <td style="padding: 10px; border: 1px solid #000; width: 50%;">
//                         <p style="margin: 0; font-weight: bold;">RECOMMENDATION BY HEAD OF DEPARTMENT:</p>
//                         <p style="margin: 10px 0;">☐ Approved ☐ Not Approved</p>
//                         <p style="margin: 5px 0;">Comments: _________________________</p>
//                         <p style="margin: 5px 0;">_________________________________</p>
//                         <p style="margin: 10px 0 0 0;">Signature: _____________ Date: _______</p>
//                     </td>
//                     <td style="padding: 10px; border: 1px solid #000; width: 50%;">
//                         <p style="margin: 0; font-weight: bold;">FINAL APPROVAL BY REGISTRAR:</p>
//                         <p style="margin: 10px 0;">☐ Approved ☐ Not Approved</p>
//                         <p style="margin: 5px 0;">Comments: _________________________</p>
//                         <p style="margin: 5px 0;">_________________________________</p>
//                         <p style="margin: 10px 0 0 0;">Signature: _____________ Date: _______</p>
//                     </td>
//                 </tr>
//             </table>
//         </div> -->
//     </div>
//   `
// }

function generateApplicationPreview(data) {
  const preview = document.getElementById("application-preview");
  const today = new Date().toLocaleDateString();

  preview.innerHTML = `
    <div style="font-family: 'Times New Roman', serif; color: #000; max-width: 800px; margin: auto; line-height: 1.8; font-size: 14px; padding: 20px;">
      
      <!-- Sender's Address -->
      <div style="text-align: right; white-space: pre-line; margin-bottom: 20px;">
        ${currentUser.name}<br>
        Matric No: ${currentUser.studentId}<br>
        ${currentUser.department} Department,<br>
        Ekiti State University,<br>
        Ado Ekiti.<br>
        ${today}
      </div>

      <!-- Recipients -->
      <div style="margin-bottom: 15px;">
        <strong>Thro:</strong><br>
        Head of Department,<br>
        ${currentUser.department} Department,<br>
        Ekiti State University,<br>
        Ado Ekiti.<br><br>

        <strong>To:</strong><br>
        Dean of the Faculty of ${currentUser.faculty || "Science"},<br>
        Ekiti State University,<br>
        Ado Ekiti.<br><br>

        <strong>To:</strong><br>
        The Vice Chancellor,<br>
        Ekiti State University,<br>
        Ado Ekiti.
      </div>

      <!-- Salutation -->
      <div style="margin-bottom: 15px;">
        Dear Sir/Ma,
      </div>

      <!-- Title -->
      <div style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; text-decoration: underline;">
        Request for Leave of Absence for ${data.session || "____"} Academic Session
      </div>

      <!-- Body -->
      <div style="text-align: justify; margin-bottom: 20px;">
        I, ${currentUser.name}, with Matric Number ${currentUser.studentId}, a ${currentUser.level} level student in ${currentUser.department} Department, Faculty of ${currentUser.faculty || "Science"}, humbly request for leave of absence for ${data.session || "____"} due to ${data.reason || "personal and financial challenges"}. I was unable to participate in the examinations and pay my tuition fees due to my financial situation.

        I hope to resume by ${data.resumptionDate || "the stated resumption date"} in the ${data.semester || "Second Semester"} of the ${data.session || "____"} Academic Session.
      </div>

      <div style="margin-bottom: 20px;">
        I will be looking forward to your approval soonest.<br>
        Thanks.
      </div>

      <!-- Closing -->
      <div>
        Yours faithfully,<br><br><br>
        <strong>${currentUser.name}</strong><br>
        ${currentUser.phone}
      </div>
    </div>
  `;
}


function viewApplication(applicationId) {
  const application = applications.find((app) => app.id === applicationId)
  if (application) {
    currentApplication = application
    generateApplicationPreview(application)
    showModal("preview-modal")
  }
}

// Modal functions
function showModal(modalId) {
  document.getElementById(modalId).classList.add("active")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active")
}

// PDF and sharing functions
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "A4" });

  doc.setFont("times", "normal");
  let y = 50;

  // Sender's Address (top right)
  doc.setFontSize(12);
  const addressLines = [
    currentUser.name,
    `Matric No: ${currentUser.studentId}`,
    `${currentUser.department} Department`,
    "Ekiti State University",
    "Ado-Ekiti.",
    new Date().toLocaleDateString()
  ];
  addressLines.forEach(line => {
    doc.text(line, 400, y, { align: "left" });
    y += 14;
  });

  y += 20;

  // Thro section
  doc.setFont("times", "bold");
  doc.text("Thro:", 50, y);
  doc.setFont("times", "normal");
  y += 14;
  doc.text(`Head of Department,`, 50, y); y += 14;
  doc.text(`${currentUser.department} Department,`, 50, y); y += 14;
  doc.text("Ekiti State University,", 50, y); y += 14;
  doc.text("Ado-Ekiti.", 50, y);

  y += 20;

  // To section
  doc.setFont("times", "bold");
  doc.text("To:", 50, y);
  doc.setFont("times", "normal");
  y += 14;
  doc.text(`Dean of the Faculty of ${currentUser.faculty || "Science"},`, 50, y); y += 14;
  doc.text("Ekiti State University,", 50, y); y += 14;
  doc.text("Ado-Ekiti.", 50, y);

  y += 20;

  doc.setFont("times", "bold");
  doc.text("To:", 50, y);
  doc.setFont("times", "normal");
  y += 14;
  doc.text("The Vice Chancellor,", 50, y); y += 14;
  doc.text("Ekiti State University,", 50, y); y += 14;
  doc.text("Ado-Ekiti.", 50, y);

  y += 30;

  // Salutation
  doc.setFont("times", "normal");
  doc.text("Dear Sir/Ma,", 50, y);

  y += 25;

  // Title centered, bold, underlined
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text(
    "REQUEST FOR LEAVE OF ABSENCE FOR " +
    (currentApplication.session || "____") +
    " ACADEMIC SESSION",
    297.5,
    y,
    { align: "center" }
  );
  doc.setLineWidth(0.5);
  const titleWidth = doc.getTextWidth(
    "REQUEST FOR LEAVE OF ABSENCE FOR " +
    (currentApplication.session || "____") +
    " ACADEMIC SESSION"
  );
  doc.line(297.5 - titleWidth / 2, y + 2, 297.5 + titleWidth / 2, y + 2);

  y += 30;

  // Body paragraphs
  doc.setFont("times", "normal");
  doc.setFontSize(12);

  const paragraph1 =
    `I, ${currentUser.name}, with Matric Number ${currentUser.studentId}, a ${currentUser.level} level student in ${currentUser.department} Department, Faculty of ${currentUser.faculty || "Science"}, humbly request for leave of absence for ${currentApplication.session || "____"} due to ${currentApplication.reason || "personal and financial challenges"}. I was unable to participate in the examinations and pay my tuition fees due to my financial situation.`;

  const paragraph2 =
    `I hope to resume by ${currentApplication.endDate ? new Date(currentApplication.endDate).toLocaleDateString() : "the stated resumption date"} in the ${currentApplication.semester || "Second Semester"} of the ${currentApplication.session || "____"} Academic Session.`;

  const paragraph3 = "I will be looking forward to your approval soonest.\nThanks.";

  [paragraph1, paragraph2, paragraph3].forEach(p => {
    const lines = doc.splitTextToSize(p, 500);
    doc.text(lines, 50, y, { align: "justify" });
    y += lines.length * 14 + 14;
  });

  y += 30;

  // Closing
  doc.text("Yours faithfully,", 50, y);
  y += 50; // space for signature

  doc.setFont("times", "bold");
  doc.text(currentUser.name, 50, y);
  doc.setFont("times", "normal");
  doc.text(currentUser.phone, 50, y + 14);

  // Save
  doc.save(`leave-letter-${currentUser.studentId}.pdf`);

  showMessage("PDF downloaded successfully!", "success");
}


async function shareViaEmail() {
  // Generate PDF first
  const pdfBlob = await generatePDFBlob()
  const pdfUrl = URL.createObjectURL(pdfBlob)

  const subject = encodeURIComponent("Leave of Absence Application - PDF Attached")
  const body = encodeURIComponent(`
Dear Academic Advisor,

Please find my leave of absence application attached as a PDF document.

Student Details:
- Name: ${currentUser.name}
- Student ID: ${currentUser.studentId}
- Department: ${currentUser.department || "Not specified"}
- Faculty: ${currentUser.faculty || "Not specified"}
- Type of Leave: ${currentApplication.leaveType}
- Duration: ${currentApplication.duration}

Please download the PDF from: ${window.location.origin}

Best regards,
${currentUser.name}
  `)

  window.open(`mailto:?subject=${subject}&body=${body}`)

  // Also trigger PDF download
  const link = document.createElement("a")
  link.href = pdfUrl
  link.download = `leave-application-${currentUser.studentId}.pdf`
  link.click()

  closeModal("share-modal")
  showMessage("PDF generated and email client opened!", "success")
}

async function generatePDFBlob() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  // Set font
  doc.setFont("times", "normal")

  // Header
  doc.setFontSize(18)
  doc.setFont("times", "bold")
  doc.text("EKITI STATE UNIVERSITY", 105, 20, { align: "center" })

  doc.setFontSize(14)
  doc.text("ADO-EKITI, EKITI STATE", 105, 30, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("times", "normal")
  doc.text("Tel: +234-30-250249, Email: registrar@eksu.edu.ng", 105, 38, { align: "center" })

  // Line
  doc.setLineWidth(1)
  doc.line(20, 52, 190, 52)

  doc.setFontSize(16)
  doc.setFont("times", "bold")
  doc.text("APPLICATION FOR LEAVE OF ABSENCE", 105, 65, { align: "center" })

  // Student Information
  doc.setFontSize(12)
  doc.setFont("times", "bold")
  doc.text("STUDENT INFORMATION:", 20, 80)

  doc.setFontSize(10)
  doc.setFont("times", "normal")
  let yPos = 90

  const addField = (label, value, x = 20, width = 80) => {
    doc.setFont("times", "bold")
    doc.text(label + ":", x, yPos)
    doc.setFont("times", "normal")
    doc.text(value, x + 35, yPos)
    doc.line(x + 35, yPos + 2, x + width, yPos + 2)
  }

  addField("Matric No", currentUser.studentId, 20, 90)
  addField("Full Name", currentUser.name, 110, 180)
  yPos += 12

  addField("Department", currentUser.department || "Not specified", 20, 90)
  addField("Faculty", currentUser.faculty || "Not specified", 110, 180)
  yPos += 12

  addField("Level", currentUser.level, 20, 90)
  addField("Session", currentApplication.session || "Not specified", 110, 180)
  yPos += 12

  addField("Semester", currentApplication.semester || "Not specified", 20, 90)
  addField("Phone", currentUser.phone, 110, 180)
  yPos += 12

  addField("Email", currentUser.email, 20, 170)
  yPos += 12

  addField("Home Address", currentUser.address || "Not provided", 20, 170)
  yPos += 20

  // Leave Details
  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("LEAVE DETAILS:", 20, yPos)
  yPos += 10

  doc.setFontSize(10)
  addField("Type of Leave", currentApplication.leaveType, 20, 90)
  addField("Duration", currentApplication.duration, 110, 180)
  yPos += 12

  addField("Commencement Date", new Date(currentApplication.startDate).toLocaleDateString(), 20, 90)
  addField("Resumption Date", new Date(currentApplication.endDate).toLocaleDateString(), 110, 180)
  yPos += 12

  addField("Emergency Contact", currentApplication.emergencyContact, 20, 170)
  yPos += 20

  // Reason section
  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("REASON FOR LEAVE:", 20, yPos)
  yPos += 10

  doc.rect(20, yPos, 170, 40)
  doc.setFont("times", "normal")
  doc.setFontSize(10)
  const splitReason = doc.splitTextToSize(currentApplication.reason, 160)
  doc.text(splitReason, 25, yPos + 8)
  yPos += 50

  // Declaration
  doc.setFont("times", "bold")
  doc.setFontSize(12)
  doc.text("DECLARATION:", 20, yPos)
  yPos += 8

  doc.setFont("times", "normal")
  doc.setFontSize(9)
  const declaration =
    "I hereby apply for leave of absence as stated above. I understand that this application is subject to approval by the appropriate authority and that I must not assume approval until officially notified."
  const splitDeclaration = doc.splitTextToSize(declaration, 170)
  doc.text(splitDeclaration, 20, yPos)
  yPos += 25

  // Signatures - Student and Head of Department only
  doc.setFont("times", "normal")
  doc.setFontSize(10)
  doc.line(30, yPos, 80, yPos)
  doc.text("Student's Signature", 55, yPos + 8, { align: "center" })
  doc.text("Date", 155, yPos + 8, { align: "center" })

  doc.setFont("times", "normal")
  doc.text(`${new Date().toLocaleDateString()}`, 55, yPos + 16, { align: "center" })
  doc.text("_______________", 155, yPos + 16, { align: "center" })

  return doc.output("blob")
}

function shareViaWhatsApp() {
  const message = encodeURIComponent(`
*Leave of Absence Application*

Student: ${currentUser.name}
ID: ${currentUser.studentId}
Department: ${currentUser.department || "Not specified"}
Faculty: ${currentUser.faculty || "Not specified"}
Type: ${currentApplication.leaveType}
Duration: ${currentApplication.duration}
Start: ${new Date(currentApplication.startDate).toLocaleDateString()}
Return: ${new Date(currentApplication.endDate).toLocaleDateString()}

Reason: ${currentApplication.reason}
    `)

  window.open(`https://wa.me/?text=${message}`)
  closeModal("share-modal")
}

function shareViaTelegram() {
  const message = encodeURIComponent(`
Leave of Absence Application

Student: ${currentUser.name}
ID: ${currentUser.studentId}
Department: ${currentUser.department || "Not specified"}
Faculty: ${currentUser.faculty || "Not specified"}
Type: ${currentApplication.leaveType}
Duration: ${currentApplication.duration}
Start: ${new Date(currentApplication.startDate).toLocaleDateString()}
Return: ${new Date(currentApplication.endDate).toLocaleDateString()}

Reason: ${currentApplication.reason}
    `)

  window.open(`https://t.me/share/url?text=${message}`)
  closeModal("share-modal")
}

function copyToClipboard() {
  const text = `
Leave of Absence Application

Student Name: ${currentUser.name}
Student ID: ${currentUser.studentId}
Department: ${currentUser.department || "Not specified"}
Faculty: ${currentUser.faculty || "Not specified"}
Phone: ${currentUser.phone}
Level: ${currentUser.level}
Email: ${currentUser.email}
Address: ${currentUser.address || "Not provided"}

Type of Leave: ${currentApplication.leaveType}
Duration: ${currentApplication.duration}
Start Date: ${new Date(currentApplication.startDate).toLocaleDateString()}
Expected Return: ${new Date(currentApplication.endDate).toLocaleDateString()}
Emergency Contact: ${currentApplication.emergencyContact}

Reason for Leave:
${currentApplication.reason}
    `

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showMessage("Application details copied to clipboard!", "success")
      closeModal("share-modal")
    })
    .catch(() => {
      showMessage("Failed to copy to clipboard!", "error")
    })
}

// Utility functions
function showMessage(message, type = "info") {
  const messageDiv = document.createElement("div")
  messageDiv.className = `message message-${type}`
  messageDiv.textContent = message

  // Use primary color for success messages
  if (type) {
    messageDiv.style.background = "var(--red)"
    messageDiv.style.color = "var(--white)"
  }

  document.body.appendChild(messageDiv)

  setTimeout(() => {
    messageDiv.classList.add("show")
  }, 100)

  setTimeout(() => {
    messageDiv.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(messageDiv)
    }, 300)
  }, 3000)
}

function loadUserData() {
  // Simulate some existing applications for demo purposes
  if (applications.length === 0) {
    // Add some sample data
    const sampleApplications = [
      {
        id: "1",
        userId: 1,
        leaveType: "Medical Leave",
        duration: "2 weeks",
        session: "2023/2024",
        semester: "First",
        startDate: "2024-01-15",
        endDate: "2024-01-29",
        reason: "Medical treatment required",
        emergencyContact: "John Doe - 1234567890",
        status: "approved",
        submittedAt: "2024-01-10T10:00:00Z",
      },
    ]

    // Only add sample data if there's a logged-in user
    if (currentUser) {
      applications.push(
        ...sampleApplications.map((app) => ({
          ...app,
          userId: currentUser.id,
        })),
      )
      localStorage.setItem("applications", JSON.stringify(applications))
    }
  }
}

// Print functionality
function printApplication() {
  window.print()
}

// Add print button to modal if needed
document.addEventListener("DOMContentLoaded", () => {
  const modalFooter = document.querySelector("#preview-modal .modal-footer")
  if (modalFooter) {
    const printBtn = document.createElement("button")
    printBtn.className = "btn btn-outline"
    printBtn.innerHTML = '<i class="fas fa-print"></i> Print'
    printBtn.onclick = printApplication
    modalFooter.insertBefore(printBtn, modalFooter.lastElementChild)
  }
})

function loadProfileData() {
  if (!currentUser) return

  document.getElementById("profile-name").value = currentUser.name || ""
  document.getElementById("profile-student-id").value = currentUser.studentId || ""
  document.getElementById("profile-department").value = currentUser.department || ""
  document.getElementById("profile-faculty").value = currentUser.faculty || ""
  document.getElementById("profile-email").value = currentUser.email || ""
  document.getElementById("profile-phone").value = currentUser.phone || ""
  document.getElementById("profile-level").value = currentUser.level || ""
  document.getElementById("profile-address").value = currentUser.address || ""
}

function handleProfileUpdate(event) {
  event.preventDefault()

  const updatedData = {
    name: document.getElementById("profile-name").value,
    studentId: document.getElementById("profile-student-id").value,
    department: document.getElementById("profile-department").value,
    faculty: document.getElementById("profile-faculty").value,
    email: document.getElementById("profile-email").value,
    phone: document.getElementById("profile-phone").value,
    level: document.getElementById("profile-level").value,
    address: document.getElementById("profile-address").value,
  }

  // Update current user
  currentUser = { ...currentUser, ...updatedData }
  localStorage.setItem("currentUser", JSON.stringify(currentUser))

  // Update users array
  const usersData = JSON.parse(localStorage.getItem("users") || "[]")
  const userIndex = usersData.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    usersData[userIndex] = currentUser
    localStorage.setItem("users", JSON.stringify(usersData))
  }

  showMessage("Profile updated successfully!", "success")
  updateDashboard()
}

let confirmationCallback = null

function showConfirmationModal(title, message, callback) {
  document.getElementById("confirmation-title").textContent = title
  document.getElementById("confirmation-message").textContent = message
  document.getElementById("confirmation-modal").style.display = "flex"
  confirmationCallback = callback
}

function closeConfirmationModal() {
  document.getElementById("confirmation-modal").style.display = "none"
  confirmationCallback = null
}

// Handle confirmation action
document.getElementById("confirm-action-btn").addEventListener("click", () => {
  if (confirmationCallback) {
    confirmationCallback()
  }
  closeConfirmationModal()
})

function cancelApplication(applicationId) {
  showConfirmationModal(
    "Cancel Application",
    "Are you sure you want to cancel this application? This action cannot be undone.",
    () => {
      const appIndex = applications.findIndex((app) => app.id === applicationId)
      if (appIndex !== -1) {
        applications[appIndex].status = "cancelled"
        localStorage.setItem("applications", JSON.stringify(applications))
        showMessage("Application cancelled successfully!", "success")
        updateDashboard()
      }
    },
  )
}

function deleteApplication(applicationId) {
  showConfirmationModal(
    "Delete Application",
    "Are you sure you want to permanently delete this application? This action cannot be undone.",
    () => {
      const appIndex = applications.findIndex((app) => app.id === applicationId)
      if (appIndex !== -1) {
        applications.splice(appIndex, 1)
        localStorage.setItem("applications", JSON.stringify(applications))
        showMessage("Application deleted successfully!", "success")
        updateDashboard()
      }
    },
  )
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const toggle = input.parentElement.querySelector(".password-toggle i")

  if (input.type === "password") {
    input.type = "text"
    toggle.classList.remove("fa-eye")
    toggle.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    toggle.classList.remove("fa-eye-slash")
    toggle.classList.add("fa-eye")
  }
}

function updateApplicationCountdown() {
  applications.forEach((app, index) => {
    if (app.status === "pending") {
      const approvalTime = new Date(app.submittedAt).getTime() + 5 * 60 * 60 * 1000 // 5 hours in milliseconds
      const now = new Date().getTime()
      const timeLeft = approvalTime - now

      if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

        const countdownElement = document.querySelector(`[data-app-id="${app.id}"] .countdown-timer`)
        if (countdownElement) {
          countdownElement.textContent = `${hours}H ${minutes}M ${seconds}S REMAINING`
        }
      } else {
        app.status = "approved"
        app.approvedAt = new Date().toISOString()
        saveApplications()
        updateDashboard()
      }
    }
  })
}

// Function to save applications to localStorage
function saveApplications() {
  localStorage.setItem("applications", JSON.stringify(applications))
}

// Function to load dashboard
function loadDashboard() {
  updateDashboard()
}

function generatePDF(applicationId) {
  const application = applications.find((app) => app.id === applicationId)
  if (!application) return

  const user = users.find((u) => u.id === application.userId)
  if (!user) return

  const { jsPDF } = window.jspdf

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const margin = 20

  // Header
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("EKITI STATE UNIVERSITY", pageWidth / 2, 30, { align: "center" })
  doc.text("ADO-EKITI, EKITI STATE", pageWidth / 2, 40, { align: "center" })

  doc.setFontSize(14)
  doc.text("APPLICATION FOR LEAVE OF ABSENCE", pageWidth / 2, 60, { align: "center" })

  // Reference number
  doc.setFontSize(10)
  doc.text(`Ref: EKSU/REG/LOA/${user.studentId}/${new Date().getFullYear()}`, margin, 80)

  // Student Information
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("STUDENT INFORMATION:", margin, 100)

  doc.setFont("helvetica", "normal")
  let yPos = 115
  doc.text(`Full Name: ${user.name}`, margin, yPos)
  doc.text(`Matric No: ${user.studentId}`, margin + 100, yPos)

  yPos += 15
  doc.text(`Department: ${user.department}`, margin, yPos)
  doc.text(`Faculty: ${user.faculty}`, margin + 100, yPos)

  yPos += 15
  doc.text(`Level: ${user.level}`, margin, yPos)
  doc.text(`Session: ${application.session || "Not specified"}`, margin + 100, yPos)

  yPos += 15
  doc.text(`Semester: ${application.semester || "Not specified"}`, margin, yPos)
  doc.text(`Phone: ${user.phone}`, margin + 100, yPos)

  yPos += 15
  doc.text(`Email: ${user.email}`, margin, yPos)

  yPos += 15
  doc.text(`Home Address: ${user.address}`, margin, yPos)

  // Leave Details
  yPos += 25
  doc.setFont("helvetica", "bold")
  doc.text("LEAVE DETAILS:", margin, yPos)

  doc.setFont("helvetica", "normal")
  yPos += 15
  doc.text(`Type of Leave: ${application.leaveType}`, margin, yPos)
  doc.text(`Duration: ${application.duration}`, margin + 100, yPos)

  yPos += 15
  doc.text(`Commencement Date: ${new Date(application.startDate).toLocaleDateString()}`, margin, yPos)
  doc.text(`Resumption Date: ${new Date(application.endDate).toLocaleDateString()}`, margin + 100, yPos)

  yPos += 15
  doc.text(`Emergency Contact: ${application.emergencyContact}`, margin, yPos)

  // Reason for Leave
  yPos += 25
  doc.setFont("helvetica", "bold")
  doc.text("REASON FOR LEAVE:", margin, yPos)

  doc.setFont("helvetica", "normal")
  yPos += 15
  const splitReason = doc.splitTextToSize(application.reason, pageWidth - 2 * margin)
  doc.text(splitReason, margin, yPos)

  // Declaration
  yPos += splitReason.length * 5 + 25
  doc.setFont("helvetica", "bold")
  doc.text("DECLARATION:", margin, yPos)

  doc.setFont("helvetica", "normal")
  yPos += 15
  const declaration =
    "I hereby apply for leave of absence as stated above. I understand that this application is subject to approval by the appropriate authority and that I must not assume approval until officially notified."
  const splitDeclaration = doc.splitTextToSize(declaration, pageWidth - 2 * margin)
  doc.text(splitDeclaration, margin, yPos)

  // Signatures - Student only
  yPos += splitDeclaration.length * 5 + 30
  doc.text("Student's Signature: _________________ Date: _________", margin, yPos)

  doc.save(`Leave_Application_${user.studentId}_${application.id}.pdf`)
}

function updateFooterStats() {
  const totalUsers = users.length
  const totalApplications = applications.length
  const lastUpdate = new Date().toLocaleDateString()

  document.getElementById("footer-total-users").textContent = totalUsers
  document.getElementById("footer-total-applications").textContent = totalApplications
  document.getElementById("footer-last-update").textContent = lastUpdate
}

function loadUsers() {
  users = JSON.parse(localStorage.getItem("users") || "[]")
}

function loadApplications() {
  applications = JSON.parse(localStorage.getItem("applications") || "[]")
}

function isLoggedIn() {
  return currentUser !== null
}

document.addEventListener("DOMContentLoaded", () => {
  loadUsers()
  loadApplications()
  updateFooterStats()

  // Update footer stats every 30 seconds
  setInterval(updateFooterStats, 30000)

  if (isLoggedIn()) {
    showPage("dashboard-page")
    loadDashboard()
  } else {
    showPage("landing-page")
  }
})
