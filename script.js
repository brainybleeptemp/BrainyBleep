const taskInput = document.getElementById("task-input");
const subjectInput = document.getElementById("subject-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("task-list");
const addBtn = document.getElementById("add-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${task.subject}</strong> — ${task.text}<br>
      <small>Due: ${task.date}</small><br>
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

// Load on refresh
renderTasks();


  
