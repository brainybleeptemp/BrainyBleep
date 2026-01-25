// === ELEMENTS ===
const taskInput = document.getElementById("task-input");
const subjectInput = document.getElementById("subject-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("task-list");
const addBtn = document.getElementById("add-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const quoteEl = document.getElementById("quote");
const body = document.body;

// === LOAD TASKS AND SETTINGS ===
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastCompletedDate = localStorage.getItem("lastCompletedDate") || null;

// === USER PERSONALIZATION ===
let userName = localStorage.getItem("userName");
if (!userName) {
  userName = prompt("What’s your name?") || "Student";
  localStorage.setItem("userName", userName);
}
document.querySelector("header p").textContent = `Hi, ${userName}! Deadlines don’t ghost you here.`;

// === SUBJECT COLORS & EMOJIS ===
const subjects = {
  Math: { color: "#10b981", emoji: "📐" },
  Science: { color: "#3b82f6", emoji: "🔬" },
  English: { color: "#facc15", emoji: "📖" },
  History: { color: "#f472b6", emoji: "🏛️" },
  Other: { color: "#8b5cf6", emoji: "✨" }
};

// === MOTIVATIONAL QUOTES ===
const quotes = {
  morning: ["Rise & shine! ☀️", "Start strong! 💪"],
  afternoon: ["Keep pushing! ⚡", "Almost there! 🏃‍♀️"],
  evening: ["Wrap it up! 🌙", "You got this! 🔥"],
  completed: ["All done! Time for a break 🌟", "Tasks conquered! 🎉"]
};

// === SAVE TASKS & SETTINGS ===
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastCompletedDate", lastCompletedDate);
}

// === RENDER TASKS WITH GROUPING, COLORS, EMOJIS, ANIMATIONS ===
function renderTasks() {
  taskList.innerHTML = "";

  const taskGroups = {};
  tasks.forEach(task => {
    const dateStr = new Date(task.date).toDateString();
    if (!taskGroups[dateStr]) taskGroups[dateStr] = [];
    taskGroups[dateStr].push(task);
  });

  const sortedDates = Object.keys(taskGroups).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  sortedDates.forEach(date => {
    const dateHeader = document.createElement("h4");
    dateHeader.textContent = date;
    taskList.appendChild(dateHeader);

    taskGroups[date].forEach(task => {
      const subjectData = subjects[task.subject] || subjects["Other"];
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="task-header">
          <span class="badge subject-badge" style="background-color: ${subjectData.color}">${subjectData.emoji} ${task.subject}</span>
          <span class="badge due-badge" style="background-color: ${
            new Date(task.date).toDateString() === new Date().toDateString() ? "#ef4444" : "#f87171"
          }">${task.date}</span>
        </div>
        <p class="task-text">${task.text}</p>
        <button onclick="toggleComplete(${tasks.indexOf(task)})">${task.completed ? "Undo" : "Complete"}</button>
        <button onclick="deleteTask(${tasks.indexOf(task)})">Delete</button>
      `;
      if (task.completed) li.classList.add("completed");

      taskList.appendChild(li);
      setTimeout(() => li.classList.add("show"), 50);
    });
  });

  // Update progress bar
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = percent + "%";
  progressText.textContent = `${completed} of ${total} tasks completed`;

  // Update motivational quote
  const nowHour = new Date().getHours();
  let currentQuote = quotes.morning[0];
  if (completed === total && total > 0) {
    currentQuote = quotes.completed[Math.floor(Math.random() * quotes.completed.length)];
  } else if (nowHour >= 6 && nowHour < 12) currentQuote = quotes.morning[Math.floor(Math.random() * quotes.morning.length)];
  else if (nowHour >= 12 && nowHour < 18) currentQuote = quotes.afternoon[Math.floor(Math.random() * quotes.afternoon.length)];
  else currentQuote = quotes.evening[Math.floor(Math.random() * quotes.evening.length)];
  quoteEl.textContent = currentQuote;
}

// === ADD TASK ===
addBtn.addEventListener("click", () => {
  if (!taskInput.value || !subjectInput.value || !dateInput.value) return alert("Fill all fields!");

  const newTask = {
    text: taskInput.value,
    subject: subjectInput.value,
    date: dateInput.value,
    completed: false,
    notified: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  subjectInput.value = "";
  dateInput.value = "";
});

// === DELETE TASK ===
function deleteTask(index) {
  const liElements = taskList.querySelectorAll("li");
  const li = liElements[index];
  if (li) {
    li.classList.add("delete-animation");
    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }, 300);
  }
}

// === TOGGLE COMPLETE / UNDO ===
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;

  // Update streak if completing today
  const todayStr = new Date().toDateString();
  if (tasks[index].completed && todayStr !== lastCompletedDate) {
    streak += 1;
    lastCompletedDate = todayStr;
  }

  saveTasks();
  renderTasks();

  const liElements = taskList.querySelectorAll("li");
  const li = liElements[index];
  if (li) {
    li.style.backgroundColor = "#d1fae5";
    setTimeout(() => (li.style.backgroundColor = "transparent"), 200);
  }
}

// === UPCOMING TASK NOTIFICATIONS ===
let notificationLeadHours = parseInt(localStorage.getItem("notificationLeadHours")) || 3;

function notifyUpcomingTasks() {
  const now = new Date();
  tasks.forEach(task => {
    if (task.completed) return;
    const taskTime = new Date(task.date);
    const diffHours = (taskTime - now) / (1000 * 60 * 60);

    if (diffHours > 0 && diffHours <= notificationLeadHours && !task.notified) {
      alert(`⏰ Reminder: "${task.text}" is due at ${taskTime.toLocaleTimeString()}`);
      task.notified = true;
      saveTasks();
    }
  });
}

// === DARK MODE TOGGLE ===
const darkToggle = document.createElement("button");
darkToggle.textContent = "Toggle Dark Mode";
darkToggle.style.position = "fixed";
darkToggle.style.top = "10px";
darkToggle.style.right = "10px";
darkToggle.style.zIndex = "999";
body.appendChild(darkToggle);

if (localStorage.getItem("darkMode") === "true") body.classList.add("dark-mode");

darkToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
});

// === INITIALIZE ===
renderTasks();
notifyUpcomingTasks();
setInterval(notifyUpcomingTasks, 10 * 60 * 1000); // every 10 min
