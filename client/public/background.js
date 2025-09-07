// Background script for SmartResumeAI Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('SmartResumeAI extension installed')
})

// Handle side panel opening
chrome.sidePanel.onOpened.addListener((windowId) => {
  console.log('Side panel opened for window:', windowId)
})

// Handle tab updates to detect job postings
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the tab contains job posting content
    if (isJobPostingUrl(tab.url)) {
      // Notify content script to extract job description
      chrome.tabs.sendMessage(tabId, {
        action: 'extractJobDescription'
      }).catch(() => {
        // Content script might not be ready yet
      })
    }
  }
})

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'jobDescriptionExtracted') {
    // Store the extracted job description
    chrome.storage.local.set({
      extractedJobDescription: request.data
    })
    
    // Notify side panel if it's open
    chrome.runtime.sendMessage({
      action: 'jobDescriptionReady',
      data: request.data
    }).catch(() => {
      // Side panel might not be open
    })
  }
})

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

// Handle OAuth authentication
chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  if (signedIn) {
    console.log('User signed in:', account)
    // Store user authentication state
    chrome.storage.local.set({
      userAuthenticated: true,
      userAccount: account
    })
  } else {
    console.log('User signed out')
    // Clear user authentication state
    chrome.storage.local.remove(['userAuthenticated', 'userAccount'])
  }
})
