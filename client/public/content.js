// Content script for SmartResumeAI Chrome Extension

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractJobDescription') {
    extractJobDescription()
  }
})

// Function to extract job description from the current page
function extractJobDescription() {
  const jobDescription = extractJobContent()
  
  if (jobDescription) {
    // Send extracted content back to background script
    chrome.runtime.sendMessage({
      action: 'jobDescriptionExtracted',
      data: {
        text: jobDescription,
        url: window.location.href,
        source: 'tab',
        title: document.title
      }
    })
  }
}

// Function to extract job content from various job sites
function extractJobContent() {
  // LinkedIn Jobs
  if (window.location.hostname.includes('linkedin.com')) {
    const description = document.querySelector('.jobs-description-content__text')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // Indeed
  if (window.location.hostname.includes('indeed.com')) {
    const description = document.querySelector('#jobDescriptionText')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // Glassdoor
  if (window.location.hostname.includes('glassdoor.com')) {
    const description = document.querySelector('.jobDescriptionContent')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // Monster
  if (window.location.hostname.includes('monster.com')) {
    const description = document.querySelector('#JobDescription')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // ZipRecruiter
  if (window.location.hostname.includes('ziprecruiter.com')) {
    const description = document.querySelector('.jobDescriptionSection')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // CareerBuilder
  if (window.location.hostname.includes('careerbuilder.com')) {
    const description = document.querySelector('.job-description')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // Dice
  if (window.location.hostname.includes('dice.com')) {
    const description = document.querySelector('.job-details')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // AngelList
  if (window.location.hostname.includes('angel.co')) {
    const description = document.querySelector('.job-description')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // Stack Overflow Jobs
  if (window.location.hostname.includes('stackoverflow.com')) {
    const description = document.querySelector('.job-details')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // GitHub Jobs
  if (window.location.hostname.includes('github.com')) {
    const description = document.querySelector('.job-description')
    if (description) {
      return description.innerText.trim()
    }
  }
  
  // Generic fallback - look for common job description selectors
  const genericSelectors = [
    '.job-description',
    '.job-description-content',
    '.job-details',
    '.description',
    '.content',
    '[data-testid="job-description"]',
    '[data-testid="description"]'
  ]
  
  for (const selector of genericSelectors) {
    const element = document.querySelector(selector)
    if (element && element.innerText.trim().length > 100) {
      return element.innerText.trim()
    }
  }
  
  return null
}

// Add a floating button to job pages for quick access
function addFloatingButton() {
  if (document.getElementById('smart-resume-ai-button')) {
    return // Button already exists
  }
  
  const button = document.createElement('div')
  button.id = 'smart-resume-ai-button'
  button.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #3b82f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      transition: all 0.3s ease;
    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
      <span style="color: white; font-weight: bold; font-size: 16px;">SR</span>
    </div>
  `
  
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'openSidePanel'
    })
  })
  
  document.body.appendChild(button)
}

// Check if current page is a job posting and add floating button
if (isJobPostingUrl(window.location.href)) {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFloatingButton)
  } else {
    addFloatingButton()
  }
}

// Helper function to detect job posting URLs
function isJobPostingUrl(url) {
  const jobSites = [
    'linkedin.com/jobs',
    'indeed.com/viewjob',
    'glassdoor.com/job-listing',
    'monster.com/jobs',
    'ziprecruiter.com/jobs',
    'careerbuilder.com/job',
    'dice.com/jobs',
    'angel.co/jobs',
    'stackoverflow.com/jobs',
    'github.com/jobs'
  ]
  
  return jobSites.some(site => url.includes(site))
}
