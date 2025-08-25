// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")
    }
  })
}, observerOptions)

// Observe elements when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Observe all animated elements
  const animatedElements = document.querySelectorAll(".animate-slide-up, .animate-fade-in")
  animatedElements.forEach((el) => observer.observe(el))

  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add loading animation to buttons (but not form submit buttons)
  document.querySelectorAll(".btn:not([type='submit'])").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // Skip if it's a form button or has specific onclick handlers
      if (this.type === "submit" || this.onclick || this.getAttribute("onclick")) {
        return
      }

      if (!this.classList.contains("loading")) {
        this.classList.add("loading")
        setTimeout(() => {
          this.classList.remove("loading")
        }, 1000)
      }
    })
  })
})

// Add CSS for additional animations
if (!document.querySelector("#main-animations")) {
  const additionalStyles = document.createElement("style")
  additionalStyles.id = "main-animations"
  additionalStyles.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    .btn.loading {
      position: relative;
      color: transparent;
    }
    
    .btn.loading::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 50%;
      margin-left: -10px;
      margin-top: -10px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `
  document.head.appendChild(additionalStyles)
}
