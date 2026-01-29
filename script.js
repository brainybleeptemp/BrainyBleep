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

  // ===== TASK STORAGE =====
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const taskListEl = document.getElementById('task-list');
  const progressBarEl = document.getElementById('progress-bar');
  const progressTextEl = document.getElementById('progress-text');

  const subjectInput = document.getElementById('subject');
  const descriptionInput = document.getElementById('description');
  const dueInput = document.getElementById('due-date');
  const saveBtn = document.getElementById('save-task');

  // ===== SAVE TASK =====
  saveBtn.addEventListener('click', () => {
    const subject = subjectInput.value.trim();
    const description = descriptionInput.value.trim();
    const due = dueInput.value;

    if (!subject || !description || !due) {
      alert('Please fill in all fields');
      return;
    }

    const newTask = {
      subject,
      description,
      due,
      completed: false
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    subjectInput.value = '';
    descriptionInput.value = '';
    dueInput.value = '';

    renderTasks();
  });

  // ===== RENDER TASKS =====
  function renderTasks() {
    taskListEl.innerHTML = '';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed-task' : '';

      li.innerHTML = `
        <strong>${task.subject}</strong>: ${task.description}<br>
        Due: ${new Date(task.due).toLocaleString()}<br>
        <button onclick="toggleComplete(${index})">
          ${task.completed ? 'Undo' : 'Done'}
        </button>
        <button onclick="deleteTask(${index})">Delete</button>
      `;

      taskListEl.appendChild(li);
    });

    updateProgress();
  }

  // ===== PROGRESS =====
  function updateProgress() {
    if (tasks.length === 0) {
      progressBarEl.style.width = '0%';
      progressTextEl.textContent = '0 of 0 tasks completed';
      return;
    }

    const completed = tasks.filter(t => t.completed).length;
    const percent = (completed / tasks.length) * 100;

    progressBarEl.style.width = percent + '%';
    progressTextEl.textContent = `${completed} of ${tasks.length} tasks completed`;
  }

  // ===== GLOBAL FUNCTIONS =====
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

  // Initial render
  renderTasks();
});
