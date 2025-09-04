/** =====================
 * MANAGER DASHBOARD LOGIC
 * ===================== */

function renderManagerDashboard() {
  const dashboardContent = document.getElementById('dashboard-content');
  
  // Set the user info in the header
  document.getElementById('current-user-info').textContent = `${currentUser.name} (${currentUser.role})`;

  // Controls
  dashboardContent.innerHTML = `
    <div class="mb-6 flex space-x-4">
      <button onclick="openAssignTaskModal()" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg">Assign Task</button>
      <button onclick="openBonusTaskModal()" class="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg">Create Bonus Task</button>
      <button onclick="openAnnouncementModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">Make Announcement</button>
      <button onclick="viewAuditLog()" class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg">View Audit Log</button>
      <button onclick="openEditEmployeesModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg">Edit Employee List</button>
    </div>
    
    <div id="main-manager-view" class="bg-white rounded-xl shadow-lg p-6">
        <!-- Tab Navigation -->
        <div class="flex justify-start border-b border-gray-200 mb-4">
            <button id="manager-tab-leaderboard" onclick="switchManagerTab('leaderboard')" class="py-2 px-4 font-semibold text-gray-700 border-b-2 border-indigo-600 focus:outline-none">Leaderboard</button>
            <button id="manager-tab-tasks" onclick="switchManagerTab('tasks')" class="py-2 px-4 font-semibold text-gray-500 hover:text-gray-700 focus:outline-none">All Tasks</button>
        </div>

        <!-- Tab Content -->
        <div id="leaderboard-tab-content" class="manager-tab-content">
            <h2 class="text-2xl font-bold mb-4">Employee Performance Leaderboard</h2>
            <div id="employee-leaderboard" class="grid grid-cols-1 gap-4"></div>
        </div>
        
        <div id="tasks-tab-content" class="manager-tab-content hidden">
            <h2 class="text-2xl font-bold mb-4">All Tasks</h2>
            <div id="task-list" class="space-y-4"></div>
        </div>
    </div>
  `;

  renderLeaderboardWithMetrics();
  renderManagerTaskList();
}

function switchManagerTab(tab) {
    const tabs = ['leaderboard', 'tasks'];
    tabs.forEach(t => {
        document.getElementById(`manager-tab-${t}`).classList.remove('border-indigo-600', 'text-gray-700');
        document.getElementById(`manager-tab-${t}`).classList.add('border-transparent', 'text-gray-500');
        document.getElementById(`${t}-tab-content`).classList.add('hidden');
    });

    document.getElementById(`manager-tab-${tab}`).classList.remove('border-transparent', 'text-gray-500');
    document.getElementById(`manager-tab-${tab}`).classList.add('border-indigo-600', 'text-gray-700');
    document.getElementById(`${tab}-tab-content`).classList.remove('hidden');
}


/* ========== Assign Task ========== */
function openAssignTaskModal() {
  let employeeOptions = db.users
    .filter(u => u.role === userRoles.employee)
    .map(u => `<option value="${u.id}">${u.name}</option>`)
    .join("");

  openModal(
    "Assign Task",
    `
      <input id="task-title" placeholder="Task Title" class="w-full p-2 border rounded mb-2">
      <textarea id="task-desc" placeholder="Task Description" class="w-full p-2 border rounded mb-2"></textarea>
      <input id="task-deadline" type="date" class="w-full p-2 border rounded mb-2">
      <textarea id="task-note" placeholder="Additional Note" class="w-full p-2 border rounded mb-2"></textarea>
      <select id="task-employee" class="w-full p-2 border rounded">${employeeOptions}</select>
    `,
    `<button onclick="handleAssignTask()" class="bg-green-600 text-white px-4 py-2 rounded">Assign</button>`
  );
}

function handleAssignTask() {
  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const deadline = document.getElementById('task-deadline').value;
  const note = document.getElementById('task-note').value.trim();
  const employeeId = document.getElementById('task-employee').value;

  if (!title || !deadline || !employeeId) {
    alert("Please fill all required fields.");
    return;
  }

  const task = {
    id: generateUniqueId(),
    title,
    description: desc,
    deadline,
    note,
    employeeId,
    status: "Assigned",
    assignedBy: currentUser.id,
    type: "regular",
    comments: []
  };

  db.tasks.push(task);
  createAuditLog("Task Assigned", `Task "${title}" assigned to ${employeeId}`);

  const employee = db.users.find(u => u.id === employeeId);
  sendEmailNotification(employee.email, "New Task Assigned", `Task: ${title}\nDeadline: ${deadline}`);

  closeModal();
  renderDashboard();
}

/* ========== Bonus Task ========== */
function openBonusTaskModal() {
  openModal(
    "Create Bonus Task",
    `
      <input id="bonus-title" placeholder="Bonus Task Title" class="w-full p-2 border rounded mb-2">
      <textarea id="bonus-desc" placeholder="Bonus Task Description" class="w-full p-2 border rounded mb-2"></textarea>
      <input id="bonus-deadline" type="date" class="w-full p-2 border rounded mb-2">
      <textarea id="bonus-note" placeholder="Additional Note" class="w-full p-2 border rounded mb-2"></textarea>
    `,
    `<button onclick="handleCreateBonusTask()" class="bg-yellow-600 text-white px-4 py-2 rounded">Create</button>`
  );
}

function handleCreateBonusTask() {
  const title = document.getElementById('bonus-title').value.trim();
  const desc = document.getElementById('bonus-desc').value.trim();
  const deadline = document.getElementById('bonus-deadline').value;
  const note = document.getElementById('bonus-note').value.trim();

  if (!title || !deadline) {
    alert("Please provide title and deadline.");
    return;
  }

  const bonusTask = {
    id: generateUniqueId(),
    title,
    description: desc,
    deadline, 
    note,
    status: "Available",
    type: "bonus",
    assigneeId: null, // New bonus tasks are unassigned
    comments: []
  };

  db.bonusTasks.push(bonusTask);
  createAuditLog("Bonus Task Created", `Bonus task "${title}" created`);

  closeModal();
  renderDashboard();
}

/* ========== Edit Employees Modal ========== */
function openEditEmployeesModal() {
    const employeeListHtml = db.users
        .filter(u => u.role === userRoles.employee)
        .map(employee => `
            <div class="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                <span class="font-medium">${employee.name} - ${employee.designation}</span>
                <button onclick="confirmRemoveEmployee('${employee.id}')" class="text-red-500 hover:text-red-700 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `).join('');

    openModal(
        "Manage Employees",
        `
        <div class="space-y-4 max-h-64 overflow-y-auto mb-4">${employeeListHtml}</div>
        <hr class="my-4">
        <h4 class="text-lg font-bold mb-2">Add New Employee</h4>
        <input id="new-employee-name" placeholder="Name" class="w-full p-2 border rounded mb-2" required>
        <input id="new-employee-email" type="email" placeholder="Email" class="w-full p-2 border rounded mb-2" required>
        <input id="new-employee-designation" placeholder="Designation" class="w-full p-2 border rounded mb-2" required>
        `,
        `<div class="flex justify-between space-x-2 mt-4">
            <button onclick="handleAddEmployee()" class="bg-green-600 text-white px-4 py-2 rounded">Add Employee</button>
            <button onclick="closeModal()" class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Done</button>
        </div>`
    );
}

function handleAddEmployee() {
    const name = document.getElementById('new-employee-name').value.trim();
    const email = document.getElementById('new-employee-email').value.trim();
    const designation = document.getElementById('new-employee-designation').value.trim();

    if (!name || !email || !designation) {
        alert('Please fill out all fields.');
        return;
    }

    const newEmployee = {
        id: generateUniqueId(),
        name,
        email,
        designation,
        role: userRoles.employee,
    };
    db.users.push(newEmployee);
    createAuditLog('Added a new employee', { name, email });

    renderDashboard(); // <-- ADD THIS LINE to refresh the leaderboard
    openEditEmployeesModal(); // This refreshes the list inside the modal
}

function confirmRemoveEmployee(employeeId) {
    const employee = db.users.find(u => u.id === employeeId);
    openModal(
        "Confirm Deletion",
        `<p>Are you sure you want to remove ${employee.name}? This will also delete all of their assigned tasks.</p>`,
        `
        <button onclick="handleRemoveEmployee('${employeeId}')" class="bg-red-600 text-white px-4 py-2 rounded">Remove</button>
        <button onclick="openEditEmployeesModal()" class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
        `
    );
}

function handleRemoveEmployee(employeeId) {
    db.users = db.users.filter(u => u.id !== employeeId);
    db.tasks = db.tasks.filter(t => t.employeeId !== employeeId);
    createAuditLog('Removed an employee and their tasks', { employeeId });
    
    renderDashboard(); // <-- ADD THIS LINE to refresh the leaderboard
    openEditEmployeesModal(); // This refreshes the list inside the modal
}


/* ========== Leaderboard with Metrics ========== */
function renderLeaderboardWithMetrics() {
    const leaderboardDiv = document.getElementById('employee-leaderboard');
    if (!leaderboardDiv) return;

    const employeesWithMetrics = db.users
        .filter(u => u.role === userRoles.employee)
        .map(employee => {
            const employeeTasks = db.tasks.filter(t => t.employeeId === employee.id);
            const tasksAssigned = employeeTasks.length;
            const tasksCompleted = employeeTasks.filter(t => t.status === 'Completed').length;
            const bonusTasksCompleted = db.bonusTasks.filter(t => t.assigneeId === employee.id && t.status === 'Completed').length;
            const completionPercentage = tasksAssigned > 0 ? ((tasksCompleted / tasksAssigned) * 100).toFixed(0) : 0;
            return {
                ...employee,
                tasksAssigned,
                tasksCompleted,
                bonusTasksCompleted,
                completionPercentage
            };
        });

    const sortedEmployees = employeesWithMetrics.sort((a, b) => b.tasksCompleted - a.tasksCompleted);
    
    if (sortedEmployees.length === 0) {
        leaderboardDiv.innerHTML = `<p class="text-center text-gray-500 mt-4">No employees to rank yet.</p>`;
        return;
    }

    leaderboardDiv.innerHTML = sortedEmployees.map((employee, index) => {
        return `
            <div onclick="viewEmployeeDetails('${employee.id}')" class="cursor-pointer p-4 bg-white rounded-lg shadow transition-shadow hover:shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <span class="text-xl font-bold text-gray-800 mr-2">${index + 1}.</span>
                      <div>
                        <h3 class="text-lg font-bold text-gray-800">${employee.name}</h3>
                        <p class="text-xs text-gray-500">${employee.designation}</p>
                      </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 text-center text-xs">
                    <div class="p-1 bg-gray-100 rounded">
                        <p class="font-semibold text-gray-700">Assigned</p>
                        <p class="text-sm font-bold text-blue-600">${employee.tasksAssigned}</p>
                    </div>
                    <div class="p-1 bg-gray-100 rounded">
                        <p class="font-semibold text-gray-700">Completed</p>
                        <p class="text-sm font-bold text-green-600">${employee.tasksCompleted}</p>
                    </div>
                    <div class="p-1 bg-gray-100 rounded">
                        <p class="font-semibold text-gray-700">Bonus Tasks</p>
                        <p class="text-sm font-bold text-yellow-600">${employee.bonusTasksCompleted}</p>
                    </div>
                    <div class="p-1 bg-gray-100 rounded">
                        <p class="font-semibold text-gray-700">Completion %</p>
                        <p class="text-sm font-bold text-indigo-600">${employee.completionPercentage}%</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


// file: manager.js

function viewEmployeeDetails(employeeId) {
    const mainView = document.getElementById('main-manager-view');
    const employee = db.users.find(u => u.id === employeeId);
    
    if (!employee) return;

    // ================== START: THE FIX ==================
    // Combine both regular and bonus tasks for this employee
    const employeeTasks = [
        ...db.tasks.filter(t => t.employeeId === employeeId),
        ...db.bonusTasks.filter(t => t.assigneeId === employeeId)
    ];
    // =================== END: THE FIX ===================
    
    const completedTasks = employeeTasks.filter(t => t.status === 'Completed').length;
    const totalTasks = employeeTasks.length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;
    
    mainView.innerHTML = `
        <button onclick="renderDashboard()" class="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back to Dashboard
        </button>

        <div class="bg-white p-8 rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">${employee.name}'s Performance</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
                <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
                    <p class="text-gray-500 font-medium">Total Tasks</p>
                    <p class="text-4xl font-extrabold text-indigo-600 mt-2">${totalTasks}</p>
                </div>
                <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
                    <p class="text-gray-500 font-medium">Completed Tasks</p>
                    <p class="text-4xl font-extrabold text-green-600 mt-2">${completedTasks}</p>
                </div>
                <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
                    <p class="text-gray-500 font-medium">Completion Rate</p>
                    <p class="text-4xl font-extrabold text-yellow-600 mt-2">${completionRate}%</p>
                </div>
            </div>

            <h3 class="text-2xl font-bold text-gray-800 mb-4">Task History</h3>
            <div class="bg-gray-100 p-6 rounded-lg max-h-96 overflow-y-auto">
                <div class="space-y-4">
                    ${employeeTasks.length > 0 ? employeeTasks.map(task => `
                        <div class="p-4 rounded-lg border-l-4 ${task.status === 'Completed' ? 'border-green-500 bg-white' : 'border-gray-500 bg-white'} shadow-sm">
                            <h4 class="font-semibold text-gray-900">${task.title}</h4>
                            <p class="text-sm text-gray-600">Status: ${task.status}</p>
                            <p class="text-xs text-gray-500">Deadline: ${task.deadline}</p>
                        </div>
                    `).join('') : '<p class="text-gray-500">No tasks found for this employee.</p>'}
                </div>
            </div>
        </div>
    `;
}


/* ========== Task List ========== */
function renderManagerTaskList() {
  const taskList = document.getElementById('task-list');
  // I made a mistake here previously. The logic was flawed.
  // The correct way is to combine both regular and bonus tasks into one list.
  const allTasks = [...db.tasks, ...db.bonusTasks];

  if (allTasks.length === 0) {
    taskList.innerHTML = `<p class="text-gray-500">No tasks assigned yet.</p>`;
    return;
  }
  taskList.innerHTML = allTasks.map(task => {
    // Determine the employee name based on task type
    let employee = task.employeeId ? db.users.find(u => u.id === task.employeeId) : db.users.find(u => u.id === task.assigneeId);
    let assigneeName = employee ? employee.name : 'Not yet accepted';
    let status = task.status;

    return `
      <div onclick="showManagerTaskDetails('${task.id}')" class="p-4 bg-gray-50 border rounded cursor-pointer hover:bg-gray-100 transition-colors">
        <h3 class="font-bold">${task.title}</h3>
        <p class="text-sm"><b>Assigned to:</b> ${assigneeName}</p>
        <p class="text-sm"><b>Status:</b> ${status}</p>
      </div>`;
  }).join("");
}

// New function to show task details for the manager
// file: manager.js

function showManagerTaskDetails(taskId) {
    const task = [...db.tasks, ...db.bonusTasks].find(t => t.id === taskId);
    const employee = task.employeeId ? db.users.find(u => u.id === task.employeeId) : db.users.find(u => u.id === task.assigneeId);
    if (!task) return;

    const assignedToText = employee ? employee.name : 'Not yet accepted';

    // Generate HTML for comments
    const commentsHtml = task.comments.map(comment => `
        <div class="p-2 bg-gray-100 rounded-md mb-2">
            <p class="text-sm text-gray-800">${comment.text}</p>
            <p class="text-xs text-gray-500 text-right">
                - ${comment.authorName} (${comment.authorRole}) on ${new Date(comment.timestamp).toLocaleDateString()}
            </p>
        </div>
    `).join('');

    // Generate HTML for adding a comment (only if task is 'Accepted')
    const addCommentHtml = task.status === 'Accepted' ? `
        <div class="mt-4">
            <h4 class="font-semibold text-gray-700">Add Comment</h4>
            <textarea id="new-comment-text" class="w-full p-2 border rounded mt-1" placeholder="Type your comment..."></textarea>
            <button onclick="handleAddComment('${task.id}')" class="bg-indigo-600 text-white py-1 px-3 rounded-md mt-2">Post</button>
        </div>
    ` : '';

    openModal(
        task.title,
        `
        <div class="max-h-96 overflow-y-auto space-y-4">
            <div class="p-3 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-gray-700">Status</h4>
                <p class="text-sm text-gray-600 mt-1">${task.status}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-gray-700">Assigned To</h4>
                <p class="text-sm text-gray-600 mt-1">${assignedToText}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-gray-700">Description</h4>
                <p class="text-sm text-gray-600 mt-1">${task.description}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-gray-700">Deadline</h4>
                <p class="text-sm text-gray-600 mt-1">${task.deadline}</p>
            </div>
            
            <div class="p-3 bg-white rounded-lg border">
                <h4 class="font-semibold text-gray-700 mb-2">Comments</h4>
                <div class="max-h-40 overflow-y-auto">
                    ${commentsHtml || '<p class="text-sm text-gray-500">No comments yet.</p>'}
                </div>
                ${addCommentHtml}
            </div>
        </div>
        `,
        `<button onclick="closeModal()" class="bg-gray-500 text-white py-2 px-4 rounded-md">Close</button>`
    );
}

/* ========== Audit Log ========== */
function viewAuditLog() {
  openModal("Audit Log", `
    <div class="max-h-80 overflow-y-auto">
      ${db.auditLog.map(log => `
        <div class="border-b py-2">
          <p><b>${log.timestamp}</b> - ${log.action} by ${log.user}</p>
          <p>${log.details}</p>
        </div>`).join("")}
    </div>
  `);
}


function openAnnouncementModal() {
  openModal(
    "Make an Announcement",
    `
      <input id="announcement-title" placeholder="Announcement Title" class="w-full p-2 border rounded mb-2">
      <textarea id="announcement-content" placeholder="Announcement Content..." class="w-full p-2 border rounded mb-2" rows="5"></textarea>
    `,
    `<button onclick="handlePostAnnouncement()" class="bg-blue-600 text-white px-4 py-2 rounded">Post Announcement</button>`
  );
}

function handlePostAnnouncement() {
  const title = document.getElementById('announcement-title').value.trim();
  const content = document.getElementById('announcement-content').value.trim();

  if (!title || !content) {
    alert("Please fill out both title and content.");
    return;
  }

  const announcement = {
    id: generateUniqueId(),
    title,
    content,
    author: currentUser.name,
    timestamp: new Date().toISOString()
  };

  db.announcements.push(announcement);
  createAuditLog("Announcement Posted", `Title: "${title}"`);
  
  closeModal();
  renderDashboard(); // Re-render the dashboard to show the new announcement
}