// ========================
// BrainyBleep script.js
// ========================

document.addEventListener('DOMContentLoaded', () => {

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (document.body.classList.contains('light')) {
        document.body.className = 'dark';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.className = 'light';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ===== NAME SAVE =====
  const nameInput = document.getElementById('name-input');
  const saveNameBtn = document.getElementById('save-name-btn');
  const greetingEl = document.getElementById('greeting');

  // Load saved name
  const storedName = localStorage.getItem('studentName');
  if (storedName) {
    greetingEl.textContent = `Welcome back, ${storedName} 👋`;
  }

  saveNameBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return;
    localStorage.setItem('studentName', name);
    greetingEl.textContent = `Welcome back, ${name} 👋`;
    nameInput.value = '';
  });

  // ===== TASK STORAGE & RENDERING =====
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const taskListEl = document.getElementById('task-list');
  const progressBarEl = document.getElementById('progress-bar');
  const progressTextEl = document.getElementById('progress-text');

  const taskDescInput = document.getElementById('task-input');
  const taskSubjectInput = document.getElementById('subject-input');
  const taskDueInput = document.getElementById('date-input');
  const addBtn = document.getElementById('add-btn');

  // ===== NOTIFICATIONS =====
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") console.log("Notifications allowed");
    });
  }

  function showTaskNotification(task) {
    if ('Notification' in window && navigator.serviceWorker && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(`Reminder: ${task.subject}`, {
          body: `Task: ${task.description}\nDue: ${new Date(task.due).toLocaleString()}`,
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
      const timeout = taskTime - now - 5 * 60 * 1000; // 5 min before

      if (timeout > 0) {
        setTimeout(() => showTaskNotification(task), timeout);
      }
    });
  }

  // ===== TASK FUNCTIONS =====
  addBtn.addEventListener('click', () => {
    const description = taskDescInput.value.trim();
    const subject = taskSubjectInput.value.trim();
    const due = taskDueInput.value;

    if (!description || !subject || !due) return;

    const task = { description, subject, due, completed: false };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear inputs
    taskDescInput.value = '';
    taskSubjectInput.value = '';
    taskDueInput.value = '';

    renderTasks();
    showTaskNotification(task);
    scheduleNotifications([task]);
  });

  // Make toggleComplete and deleteTask global
  window.toggleComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  };

  // ===== RENDER TASKS =====
  function renderTasks() {
    taskListEl.innerHTML = '';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed-task' : '';
      li.innerHTML = `
        <strong>${task.subject}</strong>: ${task.description}<br>
        Due: ${new Date(task.due).toLocaleString()}<br>
        <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Done'}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      `;
      taskListEl.appendChild(li);
    });

    updateProgress();
  }

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

  // Schedule notifications for existing tasks on load
  scheduleNotifications(tasks);

  // Initial render
  renderTasks();
  // ======= MINI CHALLENGES & STREAK =======
let streak = parseInt(localStorage.getItem('streak')) || 0;
let challenges = JSON.parse(localStorage.getItem('challenges')) || [
  { desc: "Solve a math problem", done: false },
  { desc: "Read 5 pages of a book", done: false },
  { desc: "Write a 5-line journal", done: false }
];

const challengeListEl = document.createElement('ul');
challengeListEl.id = 'challenge-list';
document.querySelector('main').appendChild(challengeListEl);

function renderChallenges() {
  challengeListEl.innerHTML = `<h3>Mini Challenges (Streak: ${streak})</h3>`;

  challenges.forEach((c, index) => {
    const li = document.createElement('li');
    li.className = c.done ? 'completed-challenge' : '';
    li.innerHTML = `
      ${c.desc}
      <button onclick="completeChallenge(${index})">${c.done ? 'Undo' : 'Done'}</button>
    `;
    challengeListEl.appendChild(li);
  });
}

window.completeChallenge = (index) => {
  challenges[index].done = !challenges[index].done;

  // Increase streak only when marking done for first time
  if (challenges[index].done) streak += 1;
  else streak -= 1;

  localStorage.setItem('challenges', JSON.stringify(challenges));
  localStorage.setItem('streak', streak);
  renderChallenges();
}

// Initial render of challenges
renderChallenges();
});

