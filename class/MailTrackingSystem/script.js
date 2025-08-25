// --- Authentication Logic ---
const AUTH_KEY = "isAuthenticated"
const LOGIN_EMAIL = "akorede@gmail.com"
const LOGIN_PASSWORD = "akorede"

function checkAuth() {
  const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true"
  if (isAuthenticated) {
    showDashboard()
  } else {
    showLandingPage()
  }
}

function showLandingPage() {
  document.getElementById("landing-page").style.display = "flex"
  document.getElementById("login-page").style.display = "none"
  document.getElementById("dashboard-page").style.display = "none"
}

function showLoginPage() {
  document.getElementById("landing-page").style.display = "none"
  document.getElementById("login-page").style.display = "flex"
  document.getElementById("dashboard-page").style.display = "none"
}

function showDashboard() {
  document.getElementById("landing-page").style.display = "none"
  document.getElementById("login-page").style.display = "none"
  document.getElementById("dashboard-page").style.display = "flex"
  // Initialize dashboard content when shown
  updateStats()
  renderRecentActivity()
  renderMailList()
  updateReports()
  generateTrackingNumber()
  // Set initial active tab for dashboard
  const dashboardTabBtn = document.querySelector('.tab-nav .tab-btn[data-tab="dashboard"]')
  if (dashboardTabBtn) {
    switchTab("dashboard", dashboardTabBtn)
  }
}

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (email === LOGIN_EMAIL && password === LOGIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true")
    showDashboard()
  } else {
    alert("Invalid email or password.")
  }
})

function logout() {
  localStorage.removeItem(AUTH_KEY)
  showLoginPage()
}

// --- Mail Data (in-memory for this HTML version) ---
let mailData = [
  {
    id: 1,
    trackingNumber: "ESU-MAIL-2024-001",
    sender: "Registrar Office",
    recipient: "Computer Science Dept",
    subject: "Student Admission Letters",
    status: "sent",
    priority: "high",
    department: "Academic Affairs",
    description: "Batch of admission letters for new students",
    dateSent: "2024-01-15",
    dateReceived: null,
  },
  {
    id: 2,
    trackingNumber: "ESU-MAIL-2024-002",
    sender: "Bursar Office",
    recipient: "All Departments",
    subject: "Fee Payment Notices",
    status: "pending",
    priority: "medium",
    department: "Finance",
    description: "Fee payment reminders for students",
    dateSent: null,
    dateReceived: null,
  },
  {
    id: 3,
    trackingNumber: "ESU-MAIL-2024-003",
    sender: "Vice Chancellor Office",
    recipient: "Faculty of Science",
    subject: "Research Grant Approval",
    status: "received",
    priority: "high",
    department: "Administration",
    description: "Approval letters for research grants",
    dateSent: "2024-01-10",
    dateReceived: "2024-01-12",
  },
  {
    id: 4,
    trackingNumber: "ESU-MAIL-2024-004",
    sender: "Library",
    recipient: "English Department",
    subject: "New Book Acquisition",
    status: "sent",
    priority: "low",
    department: "Academic Affairs",
    description: "Notification of new books added to the library collection",
    dateSent: "2024-02-01",
    dateReceived: null,
  },
  {
    id: 5,
    trackingNumber: "ESU-MAIL-2024-005",
    sender: "Admissions Office",
    recipient: "Prospective Students",
    subject: "Application Status Update",
    status: "pending",
    priority: "high",
    department: "Academic Affairs",
    description: "Updates on application status for 2024/2025 academic session",
    dateSent: null,
    dateReceived: null,
  },
  {
    id: 6,
    trackingNumber: "ESU-MAIL-2024-006",
    sender: "Registrar Office",
    recipient: "Faculty of Arts",
    subject: "Examination Timetable",
    status: "sent",
    priority: "high",
    department: "Academic Affairs",
    description: "Final examination timetable for the current semester",
    dateSent: "2024-03-05",
    dateReceived: null,
  },
  {
    id: 7,
    trackingNumber: "ESU-MAIL-2024-007",
    sender: "Health Services",
    recipient: "Student Affairs",
    subject: "Student Medical Records",
    status: "received",
    priority: "medium",
    department: "Student Affairs",
    description: "Confidential medical records for new students",
    dateSent: "2024-03-10",
    dateReceived: "2024-03-12",
  },
  {
    id: 8,
    trackingNumber: "ESU-MAIL-2024-008",
    sender: "Alumni Relations",
    recipient: "Graduates of 2023",
    subject: "Alumni Network Invitation",
    status: "sent",
    priority: "low",
    department: "Administration",
    description: "Invitation to join the university alumni network",
    dateSent: "2024-03-15",
    dateReceived: null,
  },
  {
    id: 9,
    trackingNumber: "ESU-MAIL-2024-009",
    sender: "Research & Grants",
    recipient: "Faculty of Engineering",
    subject: "Call for Research Proposals",
    status: "pending",
    priority: "high",
    department: "Academic Affairs",
    description: "Announcement for new research grant opportunities",
    dateSent: null,
    dateReceived: null,
  },
  {
    id: 10,
    trackingNumber: "ESU-MAIL-2024-010",
    sender: "Procurement Unit",
    recipient: "IT Department",
    subject: "New Equipment Delivery",
    status: "received",
    priority: "medium",
    department: "Administration",
    description: "Delivery confirmation for new IT equipment",
    dateSent: "2024-03-20",
    dateReceived: "2024-03-22",
  },
  {
    id: 11,
    trackingNumber: "ESU-MAIL-2024-011",
    sender: "Human Resources",
    recipient: "New Staff",
    subject: "Onboarding Documents",
    status: "sent",
    priority: "high",
    department: "Administration",
    description: "Welcome package and onboarding documents for new employees",
    dateSent: "2024-03-25",
    dateReceived: null,
  },
  {
    id: 12,
    trackingNumber: "ESU-MAIL-2024-012",
    sender: "Sports Unit",
    recipient: "Student Union",
    subject: "Inter-Faculty Sports Competition",
    status: "pending",
    priority: "low",
    department: "Student Affairs",
    description: "Details and registration for the annual sports competition",
    dateSent: null,
    dateReceived: null,
  },
  {
    id: 13,
    trackingNumber: "ESU-MAIL-2024-013",
    sender: "Legal Department",
    recipient: "Registrar Office",
    subject: "Policy Review Feedback",
    status: "received",
    priority: "medium",
    department: "Administration",
    description: "Feedback on the revised university policy documents",
    dateSent: "2024-03-28",
    dateReceived: "2024-03-30",
  },
  {
    id: 14,
    trackingNumber: "ESU-MAIL-2024-014",
    sender: "Admissions Office",
    recipient: "Applicant John Doe",
    subject: "Admission Offer Letter",
    status: "returned",
    priority: "high",
    department: "Academic Affairs",
    description: "Admission offer letter returned due to incorrect address",
    dateSent: "2024-04-01",
    dateReceived: null,
  },
  {
    id: 15,
    trackingNumber: "ESU-MAIL-2024-015",
    sender: "Dean of Students",
    recipient: "All Students",
    subject: "Semester Break Announcement",
    status: "sent",
    priority: "low",
    department: "Student Affairs",
    description: "Official announcement regarding the upcoming semester break",
    dateSent: "2024-04-05",
    dateReceived: null,
  },
]

// --- Initialization ---
document.addEventListener("DOMContentLoaded", checkAuth)

// --- Tab switching functionality ---
function switchTab(tabName, clickedButton) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((content) => (content.style.display = "none"))

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll("aside .btn")
  tabButtons.forEach((btn) => btn.classList.remove("btn-primary"))
  tabButtons.forEach((btn) => btn.classList.add("btn-outline"))

  // Show selected tab content
  document.getElementById(tabName).style.display = "block"

  // Add active class to clicked tab button
  clickedButton.classList.remove("btn-outline")
  clickedButton.classList.add("btn-primary")
}

// --- Update statistics ---
function updateStats() {
  const stats = {
    total: mailData.length,
    pending: mailData.filter((m) => m.status === "pending").length,
    sent: mailData.filter((m) => m.status === "sent").length,
    received: mailData.filter((m) => m.status === "received").length,
    returned: mailData.filter((m) => m.status === "returned").length,
  }
  document.getElementById("total-count").textContent = stats.total
  document.getElementById("pending-count").textContent = stats.pending
  document.getElementById("sent-count").textContent = stats.sent
  document.getElementById("received-count").textContent = stats.received
  document.getElementById("returned-count").textContent = stats.returned
}

// --- Render recent activity ---
function renderRecentActivity() {
  const container = document.getElementById("recent-activity")
  const recentMails = mailData.slice(0, 5) // Show only first 5
  container.innerHTML = recentMails
    .map(
      (mail) => `
          <div class="mail-item">
              <div class="mail-info">
                  <div class="status-dot ${mail.status}"></div>
                  <div class="mail-details">
                      <h4>${mail.trackingNumber}</h4>
                      <p>${mail.subject}</p>
                      <p style="font-size: 0.75rem;">${mail.sender} &rarr; ${mail.recipient}</p>
                  </div>
              </div>
              <div class="text-right">
                  <span class="badge ${mail.priority}">${mail.priority}</span>
                  <p style="font-size: 0.75rem; margin-top: 0.25rem;">${mail.dateSent || "Not sent"}</p>
              </div>
          </div>
          `,
    )
    .join("")
}

// --- Render mail list for Manage Mail tab ---
function renderMailList() {
  const container = document.getElementById("mail-list")
  container.innerHTML = mailData
    .map(
      (mail) => `
          <div class="mail-item">
              <div class="mail-info">
                  <div class="status-dot ${mail.status}"></div>
                  <div class="mail-details">
                      <h4>${mail.trackingNumber}</h4>
                      <p>${mail.subject}</p>
                      <p style="font-size: 0.75rem;">${mail.sender} &rarr; ${mail.recipient}</p>
                  </div>
              </div>
              <div class="mail-actions">
                  <span class="badge ${mail.priority}">${mail.priority}</span>
                  <span class="badge status ${mail.status}">${mail.status}</span>
                  <button class="btn btn-outline h-7 w-7" onclick="viewMail(${mail.id})">
                      <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-outline h-7 w-7" onclick="editMail(${mail.id})">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-outline h-7 w-7" onclick="deleteMail(${mail.id})">
                      <i class="fas fa-trash"></i>
                  </button>
              </div>
          </div>
          `,
    )
    .join("")
}

// --- Filter mails for Manage Mail tab ---
function filterMails() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()
  const statusFilter = document.getElementById("status-filter").value
  const priorityFilter = document.getElementById("priority-filter").value

  const filteredMails = mailData.filter((mail) => {
    const matchesSearch =
      mail.trackingNumber.toLowerCase().includes(searchTerm) ||
      mail.sender.toLowerCase().includes(searchTerm) ||
      mail.recipient.toLowerCase().includes(searchTerm) ||
      mail.subject.toLowerCase().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || mail.status === statusFilter
    const matchesPriority = priorityFilter === "all" || mail.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const container = document.getElementById("mail-list")
  if (filteredMails.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No mail found matching filters.</p>'
  } else {
    container.innerHTML = filteredMails
      .map(
        (mail) => `
              <div class="mail-item">
                  <div class="mail-info">
                      <div class="status-dot ${mail.status}"></div>
                      <div class="mail-details">
                          <h4>${mail.trackingNumber}</h4>
                          <p>${mail.subject}</p>
                          <p style="font-size: 0.75rem;">${mail.sender} &rarr; ${mail.recipient}</p>
                      </div>
                  </div>
                  <div class="mail-actions">
                      <span class="badge ${mail.priority}">${mail.priority}</span>
                      <span class="badge status ${mail.status}">${mail.status}</span>
                      <button class="btn btn-outline h-7 w-7" onclick="viewMail(${mail.id})">
                          <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-outline h-7 w-7" onclick="editMail(${mail.id})">
                          <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline h-7 w-7" onclick="deleteMail(${mail.id})">
                          <i class="fas fa-trash"></i>
                      </button>
                  </div>
              </div>
              `,
      )
      .join("")
  }
}

// --- Track mail functionality ---
function trackMail() {
  const trackingNumber = document.getElementById("track-input").value.trim()
  const resultsContainer = document.getElementById("track-results")
  if (!trackingNumber) {
    resultsContainer.innerHTML = '<p style="color: var(--primary-red);">Please enter a tracking number.</p>'
    return
  }
  const mail = mailData.find((m) => m.trackingNumber.toLowerCase().includes(trackingNumber.toLowerCase()))
  if (mail) {
    resultsContainer.innerHTML = `
              <div class="card" style="border-left: 4px solid var(--primary-blue); margin-top: 1rem;">
                  <div class="card-content">
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                          <div>
                              <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${mail.trackingNumber}</h3>
                              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                  <p><strong>Subject:</strong> ${mail.subject}</p>
                                  <p><strong>From:</strong> ${mail.sender}</p>
                                  <p><strong>To:</strong> ${mail.recipient}</p>
                                  <p><strong>Department:</strong> ${mail.department}</p>
                              </div>
                          </div>
                          <div>
                              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                                  <span class="badge status ${mail.status}">${mail.status.toUpperCase()}</span>
                                  <span class="badge ${mail.priority}">${mail.priority} priority</span>
                              </div>
                              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                  ${mail.dateSent ? `<p><strong>Date Sent:</strong> ${mail.dateSent}</p>` : ""}
                                  ${mail.dateReceived ? `<p><strong>Date Received:</strong> ${mail.dateReceived}</p>` : ""}
                                  <p><strong>Description:</strong> ${mail.description}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              `
  } else {
    resultsContainer.innerHTML = '<p style="color: var(--primary-red);">No mail found with that tracking number.</p>'
  }
}

// --- Update reports ---
function updateReports() {
  const stats = {
    total: mailData.length,
    pending: mailData.filter((m) => m.status === "pending").length,
    sent: mailData.filter((m) => m.status === "sent").length,
    received: mailData.filter((m) => m.status === "received").length,
    returned: mailData.filter((m) => m.status === "returned").length,
  }
  // Update progress bars
  document.getElementById("pending-progress").style.width = `${(stats.pending / stats.total) * 100 || 0}%`
  document.getElementById("sent-progress").style.width = `${(stats.sent / stats.total) * 100 || 0}%`
  document.getElementById("received-progress").style.width = `${(stats.received / stats.total) * 100 || 0}%`
  document.getElementById("returned-progress").style.width = `${(stats.returned / stats.total) * 100 || 0}%`
  // Update text
  document.getElementById("pending-text").textContent = stats.pending
  document.getElementById("sent-text").textContent = stats.sent
  document.getElementById("received-text").textContent = stats.received
  document.getElementById("returned-text").textContent = stats.returned
}

// --- Generate tracking number ---
function generateTrackingNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  const trackingNumber = `ESU-MAIL-${year}-${random}`
  document.getElementById("tracking-number").value = trackingNumber
}

// --- Modal functions ---
function openAddMailModal() {
  generateTrackingNumber()
  document.getElementById("add-mail-modal").classList.add("active")
}

function closeAddMailModal() {
  document.getElementById("add-mail-modal").classList.remove("active")
  document.getElementById("add-mail-form").reset()
}

// --- Add mail function ---
function addMail(event) {
  event.preventDefault()
  const newMail = {
    id: mailData.length > 0 ? Math.max(...mailData.map((m) => m.id)) + 1 : 1,
    trackingNumber: document.getElementById("tracking-number").value,
    sender: document.getElementById("sender").value,
    recipient: document.getElementById("recipient").value,
    subject: document.getElementById("subject").value,
    status: document.getElementById("status").value,
    priority: document.getElementById("priority").value,
    department: document.getElementById("department").value,
    description: document.getElementById("description").value,
    dateSent: document.getElementById("status").value === "sent" ? new Date().toISOString().split("T")[0] : null,
    dateReceived:
      document.getElementById("status").value === "received" ? new Date().toISOString().split("T")[0] : null,
  }
  mailData.push(newMail)
  // Update all displays
  updateStats()
  renderRecentActivity()
  renderMailList()
  updateReports()
  // Close modal
  closeAddMailModal()
  alert("Mail added successfully!")
}

// --- Mail action functions ---
function viewMail(id) {
  const mail = mailData.find((m) => m.id === id)
  if (mail) {
    alert(
      `Viewing mail: ${mail.trackingNumber}\nSubject: ${mail.subject}\nStatus: ${mail.status}\nSender: ${mail.sender}\nRecipient: ${mail.recipient}\nDepartment: ${mail.department}\nPriority: ${mail.priority}\nDescription: ${mail.description}\nDate Sent: ${mail.dateSent || "N/A"}\nDate Received: ${mail.dateReceived || "N/A"}`,
    )
  }
}

function editMail(id) {
  alert(`Edit functionality for mail ID: ${id} would be implemented here.`)
}

function deleteMail(id) {
  if (confirm("Are you sure you want to delete this mail?")) {
    mailData = mailData.filter((m) => m.id !== id)
    updateStats()
    renderRecentActivity()
    renderMailList()
    updateReports()
    alert("Mail deleted successfully!")
  }
}

// Close modal when clicking outside
document.getElementById("add-mail-modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeAddMailModal()
  }
})
