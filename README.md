# Employee Task Management Portal

A dynamic and responsive client-side web application built with Vanilla JavaScript that simulates a real-world employee and manager dashboard. This project features role-based access, persistent data storage using `localStorage`, and a complete set of tools for task management, performance tracking, and team communication.

**[Live Demo Link Here]**

![Employee Task Management Portal](https://i.imgur.com/your-screenshot-url.png) ---
## Features

### Manager Dashboard
* **Assign Tasks:** Create and assign tasks with titles, descriptions, deadlines, and notes to specific employees.
* **Performance Leaderboard:** View a real-time leaderboard of all employees, ranked by task completion, with key metrics like completion rate and bonus tasks completed.
* **Employee Drill-Down:** Click on any employee from the leaderboard to view their detailed performance and complete task history.
* **Bonus Tasks:** Create open "bonus tasks" that any employee can accept.
* **Manage Employees:** Add or remove employees from the system.
* **Announcements:** Post announcements that are visible to all users on their dashboards.
* **Task Comments:** Add comments to in-progress tasks to provide feedback or guidance.

### Employee Dashboard
* **Kanban-Style Task Board:** View all assigned tasks in a clear "Pending," "In Progress," and "Completed" layout.
* **Task Actions:** Accept, reject (with a reason), and mark tasks as complete.
* **Bonus Task Pool:** View and accept available bonus tasks.
* **Personal Metrics:** Track personal performance with stats on total tasks, completed tasks, and completion rate.
* **Deadline Calendar:** View all upcoming deadlines on an interactive monthly calendar.
* **Task Comments:** Communicate with the manager by adding comments to in-progress tasks.

---
## Technologies Used

* **Front-End:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Styling:** Tailwind CSS
* **Data Storage:** Browser `localStorage`
* **Charts/Visualization:** Chart.js

This project was built **without any front-end frameworks** (like React or Vue) or a backend server to demonstrate strong foundational skills in core web technologies.

---
## Installation

To run this project locally, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```

3.  **Run with a live server:**
    * If you're using VS Code, you can use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension. Right-click on `index.html` and select "Open with Live Server."

---
## Usage

1.  Open the application in your browser.
2.  Use the following credentials to log in:
    * **Manager:**
        * **Email:** `alice.j@example.com`
        * **Password:** `password`
    * **Employee:**
        * **Email:** `bob.s@example.com`
        * **Password:** `password`
3.  The **Logout** button also functions as a **Reset** button, clearing all data from `localStorage` to return the application to its original state.

---
## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
