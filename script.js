// ========================
// BrainyBleep script.js
// ========================
// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  document.body.className = savedTheme;
}

themeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('light')) {
    document.body.className = 'dark';
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.className = 'light';
    localStorage.setItem('theme', 'light');
  }
});
// Request notification permission
if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") console.log("Notifications allowed");
  });
}

// ======= TASK STORAGE & RENDERING =======
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskListEl = document.getElementById('task-list');
const progressBarEl = document.getElementById('progress-bar');
const progressTextEl = document.getElementById('progress-text');

// Render all tasks
function renderTasks() {
  taskListEl.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed-task' : '';

    li.innerHTML = `
      <strong>${task.subject}</strong>: ${task.description} <br>
      Due: ${new Date(task.due).toLocaleString()} 
      <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Done'}</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    taskListEl.appendChild(li);
  });

  updateProgress();
}

// Update progress bar
function updateProgress() {
  if (tasks.length === 0) {
    progressBarEl.style.width = '0%';
    progressTextEl.textContent = '0 of 0 tasks completed';
    return;
  }

  const completed = tasks.filter(t => t.completed).length;
  const percent = (completed / tasks.length) * 100;
  progressBarEl.style.width = `${percent}%`;
  progressTextEl.textContent = `${completed} of ${tasks.length} tasks completed`;
}

// ======= TASK FUNCTIONS =======

// Add task
function addTask() {
  const description = document.getElementById('task-input').value;
  const subject = document.getElementById('subject-input').value;
  const due = document.getElementById('date-input').value;

  if (!description || !subject || !due) return;

  const task = { description, subject, due, completed: false };
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTasks();
  showTaskNotification(task);
  scheduleNotifications([task]);

  // Clear inputs
  document.getElementById('task-input').value = '';
  document.getElementById('subject-input').value = '';
  document.getElementById('date-input').value = '';
}

// Toggle completed
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// ======= NOTIFICATIONS =======

function showTaskNotification(task) {
  if ('Notification' in window && navigator.serviceWorker && Notification.permission === "granted") {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(`Reminder: ${task.subject}`, {
        body: `Task: ${task.description}\nDue: ${task.due}`,
        icon: 'mascot-head-icon.png',
        badge: 'mascot-head-icon.png',
        vibrate: [200, 100, 200],
        data: { url: './index.html' }
      });
    });
  }
}

function scheduleNotifications(taskList) {
  taskList.forEach(task => {
    const now = new Date();
    const taskTime = new Date(task.due);
    const timeout = taskTime - now - 5 * 60 * 1000; // 5 min before deadline

    if (timeout > 0) {
      setTimeout(() => showTaskNotification(task), timeout);
    }
  });
}

// Schedule notifications for existing tasks on load
scheduleNotifications(tasks);

// Initial render
renderTasks();

// ======= OPTIONAL: add event listener for button =======
document.getElementById('add-btn').addEventListener('click', addTask);


