let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let dragElement = null;

// Load tasks from localStorage
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`); // FIXED
    data[col].forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task");
      div.setAttribute("draggable", "true");

      div.innerHTML = `
        <h2>${task.title}</h2>
        <p>${task.desc}</p>
        <button class="delete-btn">Delete</button>
      `;
      column.appendChild(div);

      div.addEventListener("drag", () => {
        dragElement = div;
      });

      div.querySelector(".delete-btn").addEventListener("click", () => {
        showToast("Task deleted!");
        div.remove();
        updateStorageAndCounts();
      });
    });

    const tasks = column.querySelectorAll(".task");
    const count = column.querySelector(".right");
    count.innerHTML = tasks.length;
  }
}

// Attach drag events to existing tasks
document.querySelectorAll(".task").forEach((task) => {
  task.addEventListener("drag", () => {
    dragElement = task;
  });
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
    dragElement = task;
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
  });
});

// Helper to add drag/drop events on columns
function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.appendChild(dragElement);
    column.classList.remove("hover-over");
    updateStorageAndCounts();

    showToast(`Task moved to ${column.querySelector(".left").innerText}`);
  });
}
addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// Modal related
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task"); // FIXED ID

toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

document
  .querySelector("#task-title-input")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTaskButton.click();
    }
  });

addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value.trim();
  const taskDesc = document
    .querySelector("#task-description-input")
    .value.trim();

  if (!taskTitle) return; // prevent empty tasks

  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${taskTitle}</h2>
    <p>${taskDesc}</p>
    <button class="delete-btn">Delete</button>
  `;

  todo.appendChild(div);

  showToast("Task added!");

  div.addEventListener("drag", () => {
    dragElement = div;
  });

  div.addEventListener("dragstart", () => {
    div.classList.add("dragging");
    dragElement = div;
  });
  div.addEventListener("dragend", () => {
    div.classList.remove("dragging");
  });

  div.querySelector(".delete-btn").addEventListener("click", () => {
    showToast("Task deleted!");
    div.remove();
    updateStorageAndCounts();
  });

  updateStorageAndCounts();

  // Reset inputs and close modal
  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-description-input").value = "";
  modal.classList.remove("active");
});

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Utility: update localStorage and counts
function updateStorageAndCounts() {
  [todo, progress, done].forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h2").innerText,
      desc: t.querySelector("p").innerText,
    }));

    count.innerText = tasks.length;
  });
  localStorage.setItem("tasks", JSON.stringify(tasksData));
}
