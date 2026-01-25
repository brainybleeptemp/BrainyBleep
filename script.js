// Elements
const taskInput = document.getElementById("task-input");
const subjectInput = document.getElementById("subject-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("task-list");
const addBtn = document.getElementById("add-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const quoteEl = document.getElementById("quote");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add motivational quote
const quotes = [
  "Small steps every day 🧠✨",
  "You’re closer than you think 💪",
  "Future you is cheering 📣",
  "One task at a time 📚",
  "Progress beats perfection 🌱"
];
if (quoteEl) {
  quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="task-header">
        <span class="badge subject-badge">${task.subject}</span>
        <span class="badge due-badge">${task.date}</span>
      </div>
      <p class="task-text">${task.text}</p>
      <button onclick="toggleComplete(${index})">
        ${task.completed ? "Undo" : "Complete"}
      </button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    if (task.completed) {
      li.style.textDecoration = "line-through";
      li.style.opacity = "0.6";
    }

    taskList.appendChild(li);
  });

  // Update progress bar
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = percent + "%";
  progressText.textContent = `${completed} of ${total} tasks completed`;
}

// Add task
addBtn.addEventListener("click", () => {
  if (
    taskInput.value === "" ||
    subjectInput.value === "" ||
    dateInput.value === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  const newTask = {
    text: taskInput.value,
    subject: subjectInput.value,
    date: dateInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  subjectInput.value = "";
  dateInput.value = "";
});

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Complete task
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Initial render
renderTasks();




  




