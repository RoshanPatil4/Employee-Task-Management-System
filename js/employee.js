/** =====================
 * EMPLOYEE DASHBOARD LOGIC
 * ===================== */

function renderEmployeeDashboard() {
  const dashboardContent = document.getElementById('dashboard-content');
  
  // Set the user info in the header
  document.getElementById('current-user-info').textContent = `${currentUser.name} (${currentUser.role})`;

  dashboardContent.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-800 mb-4 md:mb-0">My Dashboard</h2>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-start border-b border-gray-200">
            <button id="tab-tasks" onclick="switchTab('tasks')" class="py-2 px-4 font-semibold text-gray-700 border-b-2 border-indigo-600 focus:outline-none">My Tasks</button>
            <button id="tab-metrics" onclick="switchTab('metrics')" class="py-2 px-4 font-semibold text-gray-500 hover:text-gray-700 focus:outline-none">My Metrics</button>
        </div>

        <div id="tasks-tab-content" class="tab-content mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 class="font-bold text-lg text-blue-700 mb-2">Pending</h3>
                    <div id="pending-tasks" class="space-y-3"></div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 class="font-bold text-lg text-yellow-700 mb-2">In Progress</h3>
                    <div id="accepted-tasks" class="space-y-3"></div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 class="font-bold text-lg text-green-700 mb-2">Completed</h3>
                    <div id="completed-tasks" class="space-y-3"></div>
                </div>
            </div>

            <div class="mt-8">
                <h2 class="text-2xl font-bold mb-4">Open Bonus Tasks</h2>
                <div id="bonus-task-list" class="space-y-4"></div>
            </div>
        </div>

        <div id="metrics-tab-content" class="tab-content hidden mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-center">
                <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
                    <p class="text-gray-500 font-medium">Total Tasks Assigned</p>
                    <p id="total-tasks" class="text-4xl font-extrabold text-indigo-600 mt-2">0</p>
                </div>
                <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
                    <p class="text-gray-500 font-medium">Completed Tasks</p>
                    <p id="completed-tasks-count" class="text-4xl font-extrabold text-green-600 mt-2">0</p>
                </div>
                <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
                    <p class="text-gray-500 font-medium">Completion Rate</p>
                    <p id="completion-rate" class="text-4xl font-extrabold text-yellow-600 mt-2">0%</p>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <h3 class="text-lg font-bold mb-4 text-gray-800 text-center">Monthly Task Overview</h3>
                <div id="calendar-header" class="flex justify-between items-center mb-4">
                    <button onclick="changeMonth(-1)" class="p-2 rounded-full hover:bg-gray-200"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
                    <span id="month-year" class="text-xl font-semibold"></span>
                    <button onclick="changeMonth(1)" class="p-2 rounded-full hover:bg-gray-200"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
                <div class="grid grid-cols-7 text-center font-bold text-gray-600 text-sm mb-2">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div id="calendar-grid" class="grid grid-cols-7 gap-1"></div>

                <div class="mt-8">
                    <h4 class="font-bold text-gray-800">Deadlines This Month</h4>
                    <div id="deadline-index" class="text-sm mt-2 space-y-2"></div>
                </div>
            </div>
            
        </div>
    </div>
  `;

  renderEmployeeTasks();
  renderEmployeeBonusTasks();
  renderMetrics();
  renderCalendar();
}

let currentDate = new Date();
const today = new Date();

function switchTab(tab) {
  const tabs = ['tasks', 'metrics'];
  tabs.forEach(t => {
    document.getElementById(`tab-${t}`).classList.remove('border-indigo-600', 'text-gray-700');
    document.getElementById(`tab-${t}`).classList.add('border-transparent', 'text-gray-500');
    document.getElementById(`${t}-tab-content`).classList.add('hidden');
  });

  document.getElementById(`tab-${tab}`).classList.remove('border-transparent', 'text-gray-500');
  document.getElementById(`tab-${tab}`).classList.add('border-indigo-600', 'text-gray-700');
  document.getElementById(`${tab}-tab-content`).classList.remove('hidden');
}

function renderEmployeeTasks() {
    const myTasks = db.tasks.filter(t => t.employeeId === currentUser.id);
    const myBonusTasks = db.bonusTasks.filter(t => t.assigneeId === currentUser.id);
    const allMyTasks = [...myTasks, ...myBonusTasks];
    
    const pendingTasks = allMyTasks.filter(t => t.status === 'Assigned' || t.status === 'Available');
    const acceptedTasks = allMyTasks.filter(t => t.status === 'Accepted');
    const completedTasks = allMyTasks.filter(t => t.status === 'Completed');
    
    // Function to generate task HTML for each category
    const generateTaskHtml = (tasks) => tasks.length > 0 ? tasks.map(task => `
        <div onclick="showTaskDetails('${task.id}')" class="p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
            <h4 class="font-semibold text-gray-800">${task.title}</h4>
            <p class="text-sm text-gray-600">Deadline: ${task.deadline}</p>
            ${task.type === 'bonus' ? `<span class="inline-block bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full mt-2">Bonus Task</span>` : ''}
            <div class="flex space-x-2 mt-2">
                ${task.status === "Assigned" || task.status === "Available" ? `
                    <button onclick="event.stopPropagation(); handleAcceptTask('${task.id}', '${task.type}')" class="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Accept</button>
                    <button onclick="event.stopPropagation(); openRejectModal('${task.id}')" class="bg-red-500 text-white text-xs px-3 py-1 rounded-full">Reject</button>
                ` : ""}
                ${task.status === "Accepted" ? `
                    <button onclick="event.stopPropagation(); handleCompleteTask('${task.id}', '${task.type}')" class="w-full bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Mark as Completed</button>
                ` : ""}
            </div>
        </div>
    `).join('') : `<p class="text-center text-gray-500 text-sm">No tasks.</p>`;

    document.getElementById('pending-tasks').innerHTML = generateTaskHtml(pendingTasks);
    document.getElementById('accepted-tasks').innerHTML = generateTaskHtml(acceptedTasks);
    document.getElementById('completed-tasks').innerHTML = generateTaskHtml(completedTasks);
}
// file: employee.js

function showTaskDetails(taskId) {
    const task = [...db.tasks, ...db.bonusTasks].find(t => t.id === taskId);
    if (!task) return;

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
                <h4 class="font-semibold text-gray-700">Description</h4>
                <p class="text-sm text-gray-600 mt-1">${task.description}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-gray-700">Deadline</h4>
                <p class="text-sm text-gray-600 mt-1">${task.deadline}</p>
            </div>
            ${task.note ? `<div class="p-3 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-gray-700">Notes</h4>
                <p class="text-sm text-gray-600 mt-1">${task.note}</p>
            </div>` : ''}
            
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


function renderEmployeeBonusTasks() {
  const bonusList = document.getElementById('bonus-task-list');
  const openBonusTasks = db.bonusTasks.filter(t => t.status === 'Available');

  if (openBonusTasks.length === 0) {
    bonusList.innerHTML = `<p class="text-gray-500">No bonus tasks available.</p>`;
    return;
  }

  bonusList.innerHTML = openBonusTasks.map(task => `
    <div class="p-4 bg-yellow-50 border rounded">
      <h3 class="font-bold">${task.title}</h3>
      <p>${task.description}</p>
      <p><b>Deadline:</b> ${task.deadline}</p>
      ${task.status === "Available" ? `
        <button onclick="acceptBonusTask('${task.id}')" class="bg-yellow-500 text-white px-3 py-1 rounded">Accept Bonus</button>
      ` : `<p>Status: ${task.status}</p>`}
    </div>
  `).join("");
}

function handleAcceptTask(taskId, type) {
    if (type === 'regular') {
        const task = db.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = "Accepted";
        }
    } else if (type === 'bonus') {
        const bonusTask = db.bonusTasks.find(t => t.id === taskId);
        if (bonusTask) {
            bonusTask.status = "Accepted";
            bonusTask.assigneeId = currentUser.id;
        }
    }
  
    createAuditLog("Task Accepted", `Task "${taskId}" accepted by ${currentUser.name}`);
    renderDashboard();
}

function openRejectModal(taskId) {
  openModal(
    "Reject Task",
    `<textarea id="reject-reason" placeholder="Reason for rejection" class="w-full p-2 border rounded"></textarea>`,
    `<button onclick="handleRejectTask('${taskId}')" class="bg-red-600 text-white px-4 py-2 rounded">Submit</button>`
  );
}

function handleRejectTask(taskId) {
  let task = db.tasks.find(t => t.id === taskId);
  let reason = document.getElementById('reject-reason').value.trim();
  task.status = "Rejected";
  createAuditLog("Task Rejected", `Task "${task.title}" rejected by ${currentUser.name}. Reason: ${reason}`);
  closeModal();
  renderDashboard();
}

function handleCompleteTask(taskId, type) {
    if (type === 'regular') {
        const task = db.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = "Completed";
        }
    } else if (type === 'bonus') {
        const bonusTask = db.bonusTasks.find(t => t.id === taskId);
        if (bonusTask) {
            bonusTask.status = "Completed";
        }
    }

    createAuditLog("Task Completed", `Task "${taskId}" completed by ${currentUser.name}`);
    renderDashboard();
}

function acceptBonusTask(taskId) {
  let bonusTask = db.bonusTasks.find(t => t.id === taskId);
  
  bonusTask.status = "Accepted";
  bonusTask.assigneeId = currentUser.id;
  
  createAuditLog("Bonus Task Accepted", `Bonus task "${bonusTask.title}" accepted by ${currentUser.name}`);
  renderDashboard();
}

/* ========== Metrics & Calendar ========== */
function renderMetrics() {
    const myTasks = [...db.tasks.filter(t => t.employeeId === currentUser.id), ...db.bonusTasks.filter(t => t.assigneeId === currentUser.id)];
    const totalTasks = myTasks.length;
    const completedTasks = myTasks.filter(t => t.status === 'Completed').length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;
    
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks-count').textContent = completedTasks;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
}

function renderCalendar() {
    const monthYearSpan = document.getElementById('month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    const deadlineIndex = document.getElementById('deadline-index');
    
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    monthYearSpan.textContent = `${monthName} ${year}`;
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const myTasksWithDeadlines = [...db.tasks.filter(t => t.employeeId === currentUser.id), ...db.bonusTasks.filter(t => t.assigneeId === currentUser.id)];
    
    const tasksWithDeadlines = myTasksWithDeadlines.filter(t => {
        const deadlineDate = new Date(t.deadline);
        // ================== START: THE FIX ==================
        // Add a check to exclude rejected tasks
        return t.status !== 'Completed' && t.status !== 'Rejected' && deadlineDate.getFullYear() === year && deadlineDate.getMonth() === month;
        // =================== END: THE FIX ===================
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    calendarGrid.innerHTML = '';
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid.innerHTML += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isDeadline = tasksWithDeadlines.some(t => new Date(t.deadline).getDate() === day);

        const dayClasses = ['py-2', 'text-center', 'cursor-pointer', 'hover:bg-gray-200'];
        if (isToday) {
            dayClasses.push('bg-indigo-600', 'text-white', 'font-bold', 'rounded-full');
        } else if (isDeadline) {
            dayClasses.push('bg-red-400', 'text-white', 'font-bold', 'rounded-full');
        }
        
        const dateElement = `<div class="${dayClasses.join(' ')}">${day}</div>`;
        calendarGrid.innerHTML += dateElement;
    }

    // Render deadline index
    if (tasksWithDeadlines.length > 0) {
        deadlineIndex.innerHTML = tasksWithDeadlines.map(task => `
            <div class="flex items-center space-x-2">
                <span class="text-red-500 font-bold">${new Date(task.deadline).getDate()}</span>
                <span class="text-gray-700">${task.title}</span>
            </div>
        `).join('');
    } else {
        deadlineIndex.innerHTML = '<p class="text-gray-500">No deadlines this month.</p>';
    }
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
    renderMetrics();
}