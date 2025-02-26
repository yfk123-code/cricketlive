// Telegram Mini App for Cricket Live Streaming
// This is a starter template using JavaScript and Telegram Mini Apps API

// Import Telegram WebApp API
const telegramWebApp = window.Telegram.WebApp;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  // Expand to full height
  telegramWebApp.expand();
  
  // Set header color
  telegramWebApp.setHeaderColor('#1e3a8a');
  
  // Set background color
  telegramWebApp.setBackgroundColor('#f1f5f9');
  
  // Initialize the app
  initApp();
});

// Main app initialization
function initApp() {
  // Load upcoming matches
  loadUpcomingMatches();
  
  // Set up navigation
  setupNavigation();
  
  // Check if there's any live match right now
  checkLiveMatches();
}

// Load upcoming matches from your API/backend
function loadUpcomingMatches() {
  // This is where you would connect to your blog's API or RSS feed
  // For demonstration, using static data
  const upcomingMatches = [
    {
      id: 1,
      tournament: "Champions Trophy",
      teams: "India vs Pakistan",
      time: "March 1, 2025 - 14:30 IST",
      thumbnail: "india_pak.jpg"
    },
    {
      id: 2,
      tournament: "Women's Premier League",
      teams: "Mumbai Indians vs Delhi Capitals",
      time: "March 3, 2025 - 19:30 IST",
      thumbnail: "mi_dc.jpg"
    },
    {
      id: 3,
      tournament: "IPL 2025",
      teams: "Chennai Super Kings vs Royal Challengers Bangalore",
      time: "March 8, 2025 - 20:00 IST",
      thumbnail: "csk_rcb.jpg"
    }
  ];
  
  // Render upcoming matches
  renderUpcomingMatches(upcomingMatches);
}

// Render the upcoming matches in the UI
function renderUpcomingMatches(matches) {
  const matchesContainer = document.getElementById('upcoming-matches');
  matchesContainer.innerHTML = '';
  
  matches.forEach(match => {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    matchCard.innerHTML = `
      <div class="match-thumbnail placeholder"></div>
      <div class="match-info">
        <div class="tournament-name">${match.tournament}</div>
        <div class="teams">${match.teams}</div>
        <div class="match-time">${match.time}</div>
      </div>
      <button class="reminder-btn" data-match-id="${match.id}">Set Reminder</button>
    `;
    
    matchesContainer.appendChild(matchCard);
    
    // Add event listener to the reminder button
    const reminderBtn = matchCard.querySelector('.reminder-btn');
    reminderBtn.addEventListener('click', function() {
      setReminder(match);
    });
    
    // Add event listener to the match card
    matchCard.addEventListener('click', function(e) {
      if (!e.target.classList.contains('reminder-btn')) {
        showMatchDetails(match);
      }
    });
  });
}

// Check if there are any live matches currently
function checkLiveMatches() {
  // This would be replaced with an actual API call to your backend
  const liveMatches = [
    {
      id: 101,
      tournament: "Champions Trophy",
      teams: "Australia vs England",
      status: "LIVE",
      score: "AUS: 235/6 (42.3 overs)",
      thumbnail: "aus_eng.jpg"
    }
  ];
  
  if (liveMatches.length > 0) {
    showLiveMatchBanner(liveMatches[0]);
  }
}

// Show live match banner
function showLiveMatchBanner(match) {
  const liveBanner = document.createElement('div');
  liveBanner.className = 'live-banner';
  liveBanner.innerHTML = `
    <div class="live-indicator">LIVE</div>
    <div class="live-match-info">
      <div>${match.tournament}: ${match.teams}</div>
      <div class="live-score">${match.score}</div>
    </div>
    <button class="watch-now-btn">Watch Now</button>
  `;
  
  document.querySelector('.app-container').prepend(liveBanner);
  
  document.querySelector('.watch-now-btn').addEventListener('click', function() {
    openLiveStream(match);
  });
}

// Set up navigation between different sections
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-section');
      
      // Update active nav item
      navItems.forEach(navItem => navItem.classList.remove('active'));
      this.classList.add('active');
      
      // Show target section, hide others
      sections.forEach(section => {
        if (section.id === targetSection) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });
}

// Set a reminder for a match
function setReminder(match) {
  // Here you would integrate with Telegram notifications
  telegramWebApp.showPopup({
    title: 'Set Reminder',
    message: `You'll be notified 15 minutes before ${match.teams} starts.`,
    buttons: [{type: 'ok'}]
  });
  
  // You would also need a backend service to handle the actual reminders
  console.log(`Reminder set for match: ${match.id}`);
}

// Show match details
function showMatchDetails(match) {
  telegramWebApp.showPopup({
    title: match.teams,
    message: `${match.tournament}\n${match.time}`,
    buttons: [
      {id: 'stream', type: 'default', text: 'Watch Stream'},
      {id: 'cancel', type: 'cancel'}
    ]
  }, function(buttonId) {
    if (buttonId === 'stream') {
      // The match isn't live yet, but show info about when it will be
      telegramWebApp.showAlert(`The stream will be available when the match starts on ${match.time}`);
    }
  });
}

// Open live stream
function openLiveStream(match) {
  // Here you would get the actual stream URL from your backend
  const streamUrl = `https://livelinkcricket.blogspot.com/live-stream/${match.id}`;
  
  // You could either:
  // 1. Open within the mini app if you're embedding players
  loadStreamPlayer(streamUrl, match);
  
  // 2. Or open in external browser/app
  // window.open(streamUrl, '_blank');
}

// Load stream player
function loadStreamPlayer(streamUrl, match) {
  // Create a full-screen streaming view
  const appContainer = document.querySelector('.app-container');
  appContainer.innerHTML = '';
  
  const streamContainer = document.createElement('div');
  streamContainer.className = 'stream-container';
  streamContainer.innerHTML = `
    <div class="stream-header">
      <button class="back-btn">← Back</button>
      <div class="stream-title">${match.tournament}: ${match.teams}</div>
    </div>
    <div class="player-container">
      <div class="video-placeholder">
        <div class="loading-spinner"></div>
        <div>Loading stream from LiveLinkCricket...</div>
      </div>
    </div>
    <div class="stream-info">
      <div class="live-score">${match.score}</div>
      <div class="stream-quality">
        <button class="quality-btn active">HD</button>
        <button class="quality-btn">SD</button>
        <button class="quality-btn">Low</button>
      </div>
    </div>
    <div class="chat-container">
      <div class="chat-messages" id="chat-messages">
        <div class="chat-message">
          <span class="user-name">Cricket Fan:</span> Great bowling by Anderson!
        </div>
        <div class="chat-message">
          <span class="user-name">Sports Lover:</span> Australia looking good for 300+
        </div>
      </div>
      <div class="chat-input-container">
        <input type="text" class="chat-input" placeholder="Type a message...">
        <button class="send-btn">Send</button>
      </div>
    </div>
  `;
  
  appContainer.appendChild(streamContainer);
  
  // Handle back button
  document.querySelector('.back-btn').addEventListener('click', function() {
    // Reload the main app view
    initApp();
  });
  
  // In a real implementation, you would:
  // 1. Load your actual video player here (e.g., embed from your blog)
  // 2. Handle quality selection
  // 3. Implement real chat functionality
}