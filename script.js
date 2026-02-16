// ========================
// BrainyBleep script.js (FIXED STABLE VERSION)
// ========================

document.addEventListener('DOMContentLoaded', () => {

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) document.body.className = savedTheme;

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

  // ===== NAME SAVE (SAFE VERSION) =====
  const nameInput = document.getElementById('name-input');
  const saveNameBtn = document.getElementById('save-name-btn');
  const greetingEl = document.getElementById('greeting');

  const storedName = localStorage.getItem('studentName');
  if (storedName && greetingEl) {
    greetingEl.textContent = `Welcome back, ${storedName} 👋`;
  }

  if (saveNameBtn && nameInput && greetingEl) {
    saveNameBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) return;
      localStorage.setItem('studentName', name);
      greetingEl.textContent = `Welcome back, ${name} 👋`;
      nameInput.value = '';
    });
  }

  // ===== TASK STORAGE =====
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
    Notification.requestPermission();
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
      const timeout = taskTime - now - 5 * 60 * 1000;

      if (timeout > 0) {
        setTimeout(() => showTaskNotification(task), timeout);
      }
    });
  }

  // ===== ADD TASK (FIXED BUTTON) =====
  if (addBtn && taskDescInput && taskSubjectInput && taskDueInput) {
    addBtn.addEventListener('click', () => {

      const description = taskDescInput.value.trim();
      const subject = taskSubjectInput.value.trim();
      const due = taskDueInput.value;

      if (!description || !subject || !due) return;

      const task = { description, subject, due, completed: false };
      tasks.push(task);

      localStorage.setItem('tasks', JSON.stringify(tasks));

      taskDescInput.value = '';
      taskSubjectInput.value = '';
      taskDueInput.value = '';

      updateQuest("addedTask");

      renderTasks();
      showTaskNotification(task);
      scheduleNotifications([task]);
      updateHomeProgress();
    });
  }

  // ===== TOGGLE COMPLETE =====
  window.toggleComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    if (tasks[index].completed) {
      updateQuest("completedTask");
    }

    renderTasks();
    updateHomeProgress();
  };

  // ===== DELETE TASK =====
  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateHomeProgress();
  };

  // ===== RENDER TASKS =====
  function renderTasks() {
    if (!taskListEl) return;

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
    if (!progressBarEl || !progressTextEl) return;

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

  scheduleNotifications(tasks);
  renderTasks();
});


// ========================
// DAILY QUEST SYSTEM
// ========================

const todayKey = new Date().toDateString();
let dailyData = JSON.parse(localStorage.getItem("dailyQuests")) || {};

if (!dailyData[todayKey]) {
  dailyData[todayKey] = {
    addedTask: false,
    completedTask: false,
  };
  localStorage.setItem("dailyQuests", JSON.stringify(dailyData));
}

function updateQuest(type) {
  dailyData[todayKey][type] = true;
  localStorage.setItem("dailyQuests", JSON.stringify(dailyData));
  updateQuestUI();
}

function updateQuestUI() {
  const quests = dailyData[todayKey];
  if (!quests) return;

  if (quests.addedTask)
    document.getElementById("quest-add")?.classList.add("quest-done");

  if (quests.completedTask)
    document.getElementById("quest-complete")?.classList.add("quest-done");
}

updateQuestUI();

function updateHomeProgress() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  const bar = document.getElementById("home-progress-bar");
  const text = document.getElementById("home-progress-text");

  if (!bar || !text) return;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.textContent = `${completed} of ${total} tasks completed`;
}

updateHomeProgress();
// ========================
// PROFILE SYSTEM
// ========================

document.addEventListener("DOMContentLoaded", () => {

  const streak = parseInt(localStorage.getItem("streak")) || 0;

  const streakEl = document.getElementById("streak-count");
  const badgeEl = document.getElementById("badge-name");
  const flameEl = document.getElementById("flame");

  // SHOW STREAK
  if (streakEl) {
    streakEl.textContent = `${streak} Days`;
  }

  // BADGE SYSTEM (AUTO)
  if (badgeEl) {
    let badge = "Amateur";

    if (streak >= 7) badge = "Focused";
    if (streak >= 30) badge = "Consistent";
    if (streak >= 90) badge = "Elite";
    if (streak >= 180) badge = "Unstoppable";

    badgeEl.textContent = badge;
  }

  // FLAME GROWTH
  if (flameEl) {
    const baseSize = 70;
    const growth = streak * 4;
    flameEl.style.height = `${baseSize + growth}px`;

    if (streak >= 30) {
      flameEl.style.background = "linear-gradient(to top, red, orange, yellow)";
    }

    if (streak >= 90) {
      flameEl.style.background = "linear-gradient(to top, purple, red, orange)";
    }
  }

 // PROFILE PICTURE SYSTEM (FIXED)
const uploadInput = document.getElementById("upload-pic");
const profilePic = document.getElementById("profile-pic");

if (profilePic) {
  const savedPic = localStorage.getItem("profilePic");

  if (savedPic) {
    profilePic.src = savedPic;
  } else {
    profilePic.src = "https://via.placeholder.com/140";
  }
}

if (uploadInput && profilePic) {
  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const imageData = e.target.result;
      localStorage.setItem("profilePic", imageData);
      profilePic.src = imageData;
    };

    reader.readAsDataURL(file);
  });
}
// FLAME NAME SYSTEM (IMPROVED)
const flameNameInput = document.getElementById("flame-name-input");
const saveFlameBtn = document.getElementById("save-flame-name");
const flameNameDisplay = document.getElementById("flame-name-display");

if (flameNameDisplay) {
  const savedFlameName = localStorage.getItem("flameName");

  if (savedFlameName) {
    flameNameDisplay.textContent = savedFlameName;
    flameNameInput.style.display = "none";
    saveFlameBtn.style.display = "none";
  }
}

if (saveFlameBtn && flameNameInput && flameNameDisplay) {
  saveFlameBtn.addEventListener("click", () => {
    const name = flameNameInput.value.trim();
    if (!name) return;

    localStorage.setItem("flameName", name);
    flameNameDisplay.textContent = name;

    flameNameInput.style.display = "none";
    saveFlameBtn.style.display = "none";
  });
}

 







