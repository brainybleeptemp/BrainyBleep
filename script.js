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

  // Initial render
  renderTasks();
});
