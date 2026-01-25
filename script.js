// === ELEMENTS ===
const taskInput = document.getElementById("task-input");
const subjectInput = document.getElementById("subject-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("task-list");
const addBtn = document.getElementById("add-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const quoteEl = document.getElementById("quote");

// === LOAD TASKS FROM LOCAL STORAGE ===
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// === MOTIVATIONAL QUOTES ===
const quotes = [
  "Small steps every day 🧠✨",
  "You’re closer than you think 💪",
  "Future you is cheering 📣",
  "One task at a time 📚",
  "Progress beats perfection 🌱",
  "Keep going, almost there 🔥"
];
if (quoteEl) {
  quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// === SAVE TASKS ===
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === RENDER TASKS WITH GROUPED VIEW, ANIMATIONS, AND PROGRESS BAR ===
function renderTasks() {
  taskList.innerHTML = "";

  // Group tasks by date
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
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="task-header">
          <span class="badge subject-badge">${task.subject}</span>
          <span class="badge due-badge" style="background-color: ${
            new Date(task.date).toDateString() === new Date().toDateString()
              ? '#ef4444'
              : '#f87171'
          }">${task.date}</span>
        </div>
        <p class="task-text">${task.text}</p>
        <button onclick="toggleComplete(${tasks.indexOf(task)})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button onclick="deleteTask(${tasks.indexOf(task)})">Delete</button>
      `;

      if (task.completed) li.classList.add("completed");

      taskList.appendChild(li);
      setTimeout(() => li.classList.add("show"), 50);
    });
  });

  // Update progress bar
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = percent + "%";
  progressText.textContent = `${completed} of ${total} tasks completed`;
}

// === ADD TASK ===
addBtn.addEventListener("click", () => {
  if (!taskInput.value || !subjectInput.value || !dateInput.value) {
    alert("Please fill in all fields");
    return;
  }

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

  // Clear inputs
  taskInput.value = "";
  subjectInput.value = "";
  dateInput.value = "";
});

// === DELETE TASK WITH ANIMATION ===
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
  saveTasks();
  renderTasks();

  const liElements = taskList.querySelectorAll("li");
  const li = liElements[index];
  if (li) {
    li.style.backgroundColor = "#d1fae5"; // tiny flash
    setTimeout(() => (li.style.backgroundColor = "transparent"), 200);
  }
}

// === NOTIFICATIONS FOR UPCOMING TASKS ===
function notifyUpcomingTasks() {
  const now = new Date();
  tasks.forEach(task => {
    if (task.completed) return;
    const taskTime = new Date(task.date);
    const diffHours = (taskTime - now) / (1000 * 60 * 60);
    if (diffHours > 0 && diffHours <= 3 && !task.notified) {
      alert(`⏰ Upcoming: "${task.text}" is due at ${taskTime.toLocaleTimeString()}`);
      task.notified = true;
      saveTasks();
    }
  });
}

// === INITIALIZE ===
renderTasks();
notifyUpcomingTasks();
setInterval(notifyUpcomingTasks, 10 * 60 * 1000); // check every 10 min

  
