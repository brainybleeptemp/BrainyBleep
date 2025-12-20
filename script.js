function addTask() {
    const input = document.getElementById("task-input");
    const task = input.value.trim();
  
    if (task) {
      const list = document.getElementById("task-list");
      const li = document.createElement("li");
      li.textContent = task;
      list.appendChild(li);
      input.value = "";
    }
  }
  