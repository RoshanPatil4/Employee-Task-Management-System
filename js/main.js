function initializeApp() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        showDashboard();
    } else {
        // If no user is logged in, add the background for the login page
        document.body.classList.add('login-background');
    }
}

function handleLogin(event) {
  // --- START DEBUGGING ---
  console.log("Login button clicked, handleLogin function started.");
  console.log("The event object is: ", event);
  // --- END DEBUGGING ---

  event.preventDefault(); // The important line

  console.log("event.preventDefault() was called. Page should NOT reload now.");

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const user = db.users.find(u => u.email === email && u.password === password);

  if (user) {
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      document.getElementById('login-error').classList.add('hidden');
      showDashboard();
  } else {
      document.getElementById('login-error').classList.remove('hidden');
  }
}

function showDashboard() {
    // Remove the background when showing the dashboard
    document.body.classList.remove('login-background');

    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    renderDashboard();
}
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('employeeAppDB');
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('login-error').classList.add('hidden');
    
    // Add the background back when the user logs out
    document.body.classList.add('login-background');
    window.location.reload();
}


// Initial app load
document.addEventListener('DOMContentLoaded', initializeApp);