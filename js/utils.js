function saveDb() {
  localStorage.setItem('employeeAppDB', JSON.stringify(db));
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

function createAuditLog(action, details) {
  db.auditLog.push({
    id: generateUniqueId(),
    timestamp: new Date().toISOString(),
    user: currentUser.name,
    userId: currentUser.id,
    action,
    details
  });
  console.log('Audit Logged:', { action, details });
  saveDb();
}

function sendEmailNotification(recipientEmail, subject, body) {
  console.log(`--- SIMULATING EMAIL ---`);
  console.log(`To: ${recipientEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log(`------------------------`);
}

// file: utils.js

function handleAddComment(taskId) {
  const commentText = document.getElementById('new-comment-text').value.trim();
  if (!commentText) {
    alert('Comment cannot be empty.');
    return;
  }

  const task = [...db.tasks, ...db.bonusTasks].find(t => t.id === taskId);
  if (!task) return;

  const newComment = {
    authorName: currentUser.name,
    authorRole: currentUser.role,
    text: commentText,
    timestamp: new Date().toISOString()
  };

  task.comments.push(newComment);
  createAuditLog("Comment Added", `Comment added to task "${task.title}" by ${currentUser.name}`);

  // Refresh the modal to show the new comment
  if (currentUser.role === 'manager') {
    showManagerTaskDetails(taskId);
  } else {
    showTaskDetails(taskId);
  }
}