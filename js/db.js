// file: db.js

const userRoles = { manager: 'manager', employee: 'employee' };

// Define the default database structure for first-time use
const defaultDb = {
  users: [
    { id: 'manager-1', name: 'Alice Johnson', email: 'alice.j@example.com', password: 'password', role: userRoles.manager, designation: 'Senior Manager' },
    { id: 'employee-1', name: 'Bob Smith', email: 'bob.s@example.com', password: 'password', role: userRoles.employee, designation: 'Software Engineer' },
    { id: 'employee-2', name: 'Jane Doe', email: 'jane.d@example.com', password: 'password', role: userRoles.employee, designation: 'UI/UX Designer' },
    { id: 'employee-3', name: 'Alex Lee', email: 'alex.l@example.com', password: 'password', role: userRoles.employee, designation: 'Project Manager' }
  ],
  tasks: [],
  bonusTasks: [],
  auditLog: [],
  announcements: []
};

// Try to load the database from localStorage.
let db = JSON.parse(localStorage.getItem('employeeAppDB'));

// If no database is found in localStorage, initialize with the default and save it.
if (!db) {
  db = defaultDb;
  localStorage.setItem('employeeAppDB', JSON.stringify(db));
}

let currentUser = null;
let chartInstances = {};