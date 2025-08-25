// staff_profiling_spa.js

// ---------------------------------------------
// SPA Navigation Logic
// ---------------------------------------------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  const navLink = document.getElementById("nav-" + pageId);
  if (navLink) navLink.classList.add("active");
}

function toggleMobileMenu() {
  document.getElementById("nav-menu").classList.toggle("active");
}

// ---------------------------------------------
// Signup & Login
// ---------------------------------------------
document.getElementById("signupForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (name && email && password) {
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    alert("Signup successful! Please login.");
    showPage("login");
  } else {
    alert("Please fill in all fields.");
  }
});

document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (
    storedUser &&
    storedUser.email === email &&
    storedUser.password === password
  ) {
    localStorage.setItem("isLoggedIn", "true");
    updateNavForAuth(true);
    showPage("home");
  } else {
    alert("Invalid login credentials.");
  }
});

function logout() {
  localStorage.removeItem("isLoggedIn");
  updateNavForAuth(false);
  showPage("login");
}

function updateNavForAuth(isLoggedIn) {
  const siteLinks = document.querySelectorAll(".site-link");
  if (isLoggedIn) {
    siteLinks.forEach((l) => (l.style.display = "block"));
    document.getElementById("logout-link").style.display = "block";
    document.getElementById("signup-link").style.display = "none";
    document.getElementById("login-link").style.display = "none";
  } else {
    siteLinks.forEach((l) => (l.style.display = "none"));
    document.getElementById("logout-link").style.display = "none";
    document.getElementById("signup-link").style.display = "block";
    document.getElementById("login-link").style.display = "block";
  }
}

window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  updateNavForAuth(isLoggedIn);
  showPage(isLoggedIn ? "home" : "signup");
};

// ---------------------------------------------
// Subscribe Function
// ---------------------------------------------
function subscribe() {
  const emailInput = document.getElementById("subscribeEmail");
  const email = emailInput.value.trim();

  if (email === "") {
    alert("Please enter your email to subscribe.");
    return;
  }

  let subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem("subscribers", JSON.stringify(subscribers));
    alert("Thank you for subscribing!");
  } else {
    alert("You are already subscribed.");
  }

  emailInput.value = "";
}

// ---------------------------------------------
// STAFF PROFILE FORM HANDLING & PREVIEW
// ---------------------------------------------
const form = document.getElementById("staffForm");
const display = document.getElementById("profile-display");
const formSection = document.getElementById("profile-form");
const profileContent = document.getElementById("profileContent");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Gather data
  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const specialization = document.getElementById("specialization").value;
  const leadership = document.getElementById("leadership").value;
  const status = document.getElementById("status").value;
  const welcome = document.getElementById("welcome").value;
  const department = document.getElementById("department").value;
  const staffCode = document.getElementById("staffCode").value;
  const qualification = document.getElementById("qualification").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const facebook = document.getElementById("facebook").value;
  const twitter = document.getElementById("twitter").value;
  const instagram = document.getElementById("instagram").value;
  const youtube = document.getElementById("youtube").value;
  const favGroup = document.getElementById("fav-group").value;
  const favResearch = document.getElementById("fav-research").value;
  const lifeExp = document.getElementById("life-experience").value;

  // Get multiple selected options for skills and hobbies
  const skills = Array.from(
    document.getElementById("skills").selectedOptions
  ).map((opt) => opt.value);
  const hobbies = Array.from(
    document.getElementById("hobbies").selectedOptions
  ).map((opt) => opt.value);

  // Photo
  const photoInput = document.getElementById("photo");
  const photoFile = photoInput.files[0];

  if (!photoFile) {
    alert("Please upload a photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgData = e.target.result;

    profileContent.innerHTML = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color:#000; font-weight:bold;">STAFF PROFILING FORM: <a href="#">(Output)</a></h2>
        <table width="100%" cellspacing="20">
          <tr>
            <td style="width: 30%; vertical-align: top;">
              <img src="${imgData}" alt="Profile Picture" style="width:100%; max-width:180px; border-radius:6px; border:2px solid #ccc;">
              <p style="margin-top:10px; font-style: italic;">${welcome}</p>
              <p><strong>DEPARTMENT:</strong><br><span style="color:#3366cc;">${department}</span></p>
              ${
                staffCode
                  ? `<p><strong>STUDENT ID:</strong><br>${staffCode}</p>`
                  : ""
              }
              ${
                leadership
                  ? `<p><strong>LEADERSHIP POSITION:</strong><br>${leadership}</p>`
                  : ""
              }
              <p><strong>CONTACT:</strong><br>${phone}<br><a href="mailto:${email}">${email}</a></p>
              <p><strong>SOCIAL MEDIA HANDLE:</strong><br>
                ${
                  facebook
                    ? `Facebook: <a href="${facebook}" target="_blank">${facebook}</a><br>`
                    : ""
                }
                ${
                  twitter
                    ? `Twitter: <a href="${twitter}" target="_blank">${twitter}</a><br>`
                    : ""
                }
                ${
                  instagram
                    ? `Instagram: <a href="${instagram}" target="_blank">${instagram}</a><br>`
                    : ""
                }
                ${
                  youtube
                    ? `YouTube: <a href="${youtube}" target="_blank">${youtube}</a><br>`
                    : ""
                }
              </p>
              <p><strong>AREAS OF SPECIALIZATION:</strong><br>${specialization.replace(
                /\n/g,
                "<br>"
              )}</p>
            </td>
            <td style="vertical-align: top;">
              <h2 style="color:#3366cc;">${name}</h2>
              <h3 style="color:#6666cc; font-weight:normal;">${specialization}</h3>
              ${
                leadership
                  ? `<h4 style="color:#6666cc;">${leadership}</h4>`
                  : ""
              }
              <h3>ABOUT ME</h3>
              <p>${bio}</p>
              <h3>PROFESSIONAL SKILLS</h3>
              <ul>${skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>
              <h3>EDUCATION</h3>
              <p>${qualification}</p>
              <h3>MOTIVATION</h3>
              <ul>
                <li><strong>Favorite Working Group:</strong> ${favGroup}</li>
                <li><strong>Favorite Research Group:</strong> ${favResearch}</li>
                <li><strong>Life Experience:</strong> ${lifeExp}</li>
              </ul>
              <h3>HOBBIES</h3>
              <p>${hobbies.join(" – ")}</p>
            </td>
          </tr>
        </table>
        <div style="text-align:center; margin-top:30px; font-size:14px;">
          <i>CSC 208 - Assignment (HTML FORM/WEBPAGE)</i>
        </div>
      </div>
    `;

    formSection.style.display = "none";
    display.style.display = "block";
    document.getElementById("downloadBtnContainer").style.display = "block";
  };

  reader.readAsDataURL(photoFile);
});

// ---------------------------------------------
// DOWNLOAD BUTTON
// ---------------------------------------------
document.getElementById("downloadBtn")?.addEventListener("click", function () {
  const content = document.getElementById("profileContent").innerHTML;

  // Wrap content into full HTML so it opens cleanly
  const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Staff Profile</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        td { vertical-align: top; padding: 10px; }
        img { border-radius: 6px; border: 2px solid #ccc; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  // Create a Blob for download
  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Create temporary <a> to trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "staff_profile.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
});

// ---------------------------------------------
// DOWNLOAD BUTTON (Now as PDF instead of HTML)
// ---------------------------------------------
function downloadPDF() {
  const { jsPDF } = window.jspdf; // get jsPDF
  const profile = document.getElementById("profileContent");

  html2canvas(profile, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("staff_profile.pdf");
  });
}
