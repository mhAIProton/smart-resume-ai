chrome.runtime.onInstalled.addListener(() => {
  console.log('SmartResumeAI extension installed')
})

// Handle action button click
chrome.action.onClicked.addListener((tab) => {
  // Try to open side panel if supported
  if (chrome.sidePanel?.open) {
    try {
      chrome.sidePanel.open({ windowId: tab.windowId });
      chrome.runtime.sendMessage({ action: 'refreshUserData' });
    } catch (error) {
      console.error('Error opening side panel:', error)
    }
  } else {
    console.log('Side panel not available, popup should open')
  }
})

// Google OAuth methods
async function initiateGoogleAuth(apiUrl = 'http://localhost:3000') {
  try {
    // Use Google OAuth directly with proper redirect_uri
    const clientId = '1042963792345-mlb3jmbungsmno1vensbne979rdi7mjn.apps.googleusercontent.com'; // dev
    // const clientId = '800726633839-h9t8d32fka49q26bo3qtbe2qbp7o2rf8.apps.googleusercontent.com'; // prod
    const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=code&scope=email%20profile&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Launch OAuth flow
    const redirectUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    });
    
    if (!redirectUrl) {
      throw new Error('OAuth flow was cancelled by user');
    }
    
    // Extract authorization code from URL
    const url = new URL(redirectUrl);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    if (error) {
      throw new Error(`OAuth error: ${error} - ${errorDescription}`);
    }
    
    if (!code) {
      throw new Error('Authorization code not received');
    }
    
    // Exchange code for token on server
    const tokenRequest = {
      code,
      redirectUri: redirectUri,
    };
    
    const response = await fetch(`${apiUrl}/auth/google/token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(tokenRequest),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange code for token: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    const { user, token } = data;
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    if (!user) {
      throw new Error('No user data received from server');
    }
    
    // Store token and user data
    await chrome.storage.local.set({ 
      'smart_resume_auth_token': token, 
      'smart_resume_user_data': user 
    });
    
    return { success: true, token, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getUserProfile(token, apiUrl = 'http://localhost:3000') {
  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
}

async function logout() {
  try {
    await chrome.storage.local.remove(['smart_resume_auth_token', 'smart_resume_user_data']);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Handle OAuth redirects
chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  console.log('Sign in status changed:', { account, signedIn });
  
  if (!signedIn) {
    // User signed out, clear storage
    chrome.storage.local.clear();
  }
});

// Basic message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request)
  
  switch (request.action) {
    case 'test':
      sendResponse({ status: 'ok' });
      break;
      
    case 'openSidePanel':
      // Open side panel and request user data
      if (chrome.sidePanel && chrome.sidePanel.open) {
        try {
          chrome.sidePanel.open({ windowId: sender.tab.windowId });
          chrome.runtime.sendMessage({ action: 'refreshUserData' });
          sendResponse({ success: true });
        } catch (error) {
          console.error('Error opening side panel:', error);
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'Side panel not available' });
      }
      break;
      
    case 'googleAuth':
      const apiUrl = request.apiUrl || 'http://localhost:3000';
      initiateGoogleAuth(apiUrl).then(result => {
        sendResponse(result);
      });
      return true; // Keep message channel open for async response
      
    case 'getUserProfile':
      const profileApiUrl = request.apiUrl || 'http://localhost:3000';
      getUserProfile(request.token, profileApiUrl).then(profile => {
        sendResponse({ success: true, profile });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
      
    case 'logout':
      logout().then(() => {
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ status: 'unknown_action' });
  }
})
