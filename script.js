const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const taskList = document.getElementById("taskList");
const taskCounterBtn = document.getElementById("taskCounterBtn");

function updateTaskCounter() {
  const count = Array.from(document.querySelectorAll("#taskList li"))
    .filter((li) => !li.classList.contains("completed")).length;
  taskCounterBtn.textContent = `Tasks Left: ${count}`;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  if (task.completed) {
    li.classList.add("completed");
  }
  li.draggable = true;

  // Task text and due date container
  const textContainer = document.createElement("span");
  textContainer.textContent = task.text;

  // Due date display
  const dueDateSpan = document.createElement("span");
  dueDateSpan.style.marginLeft = "10px";
  dueDateSpan.style.fontSize = "12px";
  dueDateSpan.style.color = "#555";
  if (task.dueDate) {
    dueDateSpan.textContent = `Due: ${task.dueDate}`;
  }

  // Combine text and due date
  const infoContainer = document.createElement("div");
  infoContainer.style.display = "flex";
  infoContainer.style.alignItems = "center";
  infoContainer.appendChild(textContainer);
  infoContainer.appendChild(dueDateSpan);

  // Drag handle
  const dragHandle = document.createElement("span");
  dragHandle.className = "drag-handle";
  dragHandle.innerHTML = "&#9776;"; // Unicode for three horizontal lines
  dragHandle.style.cursor = "grab";
  dragHandle.style.marginRight = "10px";
  dragHandle.style.fontSize = "18px";
  dragHandle.style.display = "flex";
  dragHandle.style.alignItems = "center";

  // Prevent drag events from bubbling from buttons
  dragHandle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  // Drag and drop events
  li.addEventListener("dragstart", (e) => {
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
    window.draggedLi = li;
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    window.draggedLi = null;
    saveTasks();
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const dragging = document.querySelector(".dragging");
    if (dragging && dragging !== li) {
      const bounding = li.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      if (offset > bounding.height / 2) {
        li.parentNode.insertBefore(dragging, li.nextSibling);
      } else {
        li.parentNode.insertBefore(dragging, li);
      }
    }
  });

  // Task click to toggle completed
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    taskList.removeChild(li);
    saveTasks();
  });

  li.appendChild(dragHandle);
  li.appendChild(infoContainer);
  li.appendChild(deleteBtn);
  return li;
}

// Update saveTasks to also update the counter
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    const infoContainer = li.querySelector("div");
    const text = infoContainer ? infoContainer.firstChild.textContent : "";
    const dueDateSpan = infoContainer ? infoContainer.querySelector("span:last-child") : null;
    const dueDate = dueDateSpan ? dueDateSpan.textContent.replace("Due: ", "") : "";
    tasks.push({
      text,
      completed: li.classList.contains("completed"),
      dueDate,
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTaskCounter();
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
  updateTaskCounter();
}

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  if (taskText !== "") {
    const li = createTaskElement({ text: taskText, completed: false, dueDate });
    taskList.appendChild(li);
    taskInput.value = "";
    dueDateInput.value = "";
    saveTasks();
  }
});

// Clear all tasks button logic
document.getElementById("clearAllBtn").addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateTaskCounter();
});

// Load tasks on page load
window.addEventListener("DOMContentLoaded", loadTasks);
window.addEventListener("DOMContentLoaded", loadTasks);
