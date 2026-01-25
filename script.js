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

  // Apply completed style if task is done
  if (task.completed) {
    li.classList.add("completed");
  }

  // Append first, then animate in
  taskList.appendChild(li);
  setTimeout(() => li.classList.add("show"), 50);
});

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
  const liElements = taskList.querySelectorAll("li");
  const li = liElements[index];

  if (li) {
    li.classList.add("delete-animation");
    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }, 300); // matches CSS transition
  }
}
// Toggle a task as completed or not
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed; // flip true/false
  saveTasks(); // save changes to localStorage
  renderTasks(); // re-render task list

  // Optional: tiny visual flash when toggled
  const liElements = taskList.querySelectorAll("li");
  const li = liElements[index];
  if (li) {
    li.style.backgroundColor = "#d1fae5"; // light green flash
    setTimeout(() => li.style.backgroundColor = "transparent", 200);
  }
}

// Complete task
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Initial render
renderTasks();
function checkDueTasks() {
  const now = new Date();

  tasks.forEach(task => {
    const taskDate = new Date(task.date);
    const isDueToday =
      taskDate.getFullYear() === now.getFullYear() &&
      taskDate.getMonth() === now.getMonth() &&
      taskDate.getDate() === now.getDate() &&
      !task.completed;

    if (isDueToday) {
      alert(`Reminder: "${task.text}" is due today!`);
    }
  });
}

// Check when page loads
checkDueTasks();





  








