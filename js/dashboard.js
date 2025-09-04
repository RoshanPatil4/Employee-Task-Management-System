function renderDashboard() {
  const userInfoElement = document.getElementById('current-user-info');
  userInfoElement.textContent = `Logged in as: ${currentUser.name} (${currentUser.role})`;

  const dashboardContent = document.getElementById('dashboard-content');
  dashboardContent.innerHTML = '';

  // Destroy old charts
  Object.values(chartInstances).forEach(chart => chart.destroy());
  chartInstances = {};

  renderLatestAnnouncement();

  if (currentUser.role === userRoles.manager) {
    renderManagerDashboard();
  } else {
    renderEmployeeDashboard();
  }
}

function deleteLatestAnnouncement() {
  if (db.announcements.length > 0) {
    const removedAnnouncement = db.announcements.pop(); // Permanently remove the last announcement
    createAuditLog("Announcement Deleted", `Manager deleted announcement: "${removedAnnouncement.title}"`);
    renderDashboard(); // Refresh the UI for all users
  }
}

// REPLACE the existing renderLatestAnnouncement function with this one
function renderLatestAnnouncement() {
  const container = document.getElementById('announcement-container');
  container.innerHTML = ''; // Clear previous announcements

  if (db.announcements.length === 0) return;

  const latestAnnouncement = db.announcements[db.announcements.length - 1];

  // Conditionally create the delete button only if the user is a manager
  let deleteButtonHtml = '';
  if (currentUser.role === userRoles.manager) {
    deleteButtonHtml = `
      <button onclick="deleteLatestAnnouncement()" class="absolute top-2 right-3 text-red-600 hover:text-red-800 font-bold text-lg" title="Permanently delete announcement">
        &times;
      </button>
    `;
  }

  container.innerHTML = `
    <div class="relative bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg" role="alert">
      
      ${deleteButtonHtml}

      <p class="font-bold text-lg break-words pr-6">${latestAnnouncement.title}</p>
      <p class="mt-1 break-words">${latestAnnouncement.content}</p>
      <p class="text-xs text-right mt-2 italic">
        - ${latestAnnouncement.author} on ${new Date(latestAnnouncement.timestamp).toLocaleDateString()}
      </p>
    </div>
  `;
}