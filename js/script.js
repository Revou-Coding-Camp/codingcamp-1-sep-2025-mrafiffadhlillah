let todoList = [];
let currentFilter = {
  status: "all",
  start: "",
  end: ""
};

/* SweetAlert2 Toast configuration for notifications */
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 6000,
  timerProgressBar: true,
  showCloseButton: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

/* Format a given date string into readable format */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", options);
}

/* Validate input fields before adding a todo item */
function validateInput() {
  const todoInput = document.getElementById('todo-input').value;
  const todoDateInput = document.getElementById('todo-date-input').value;

  if (todoInput === '' || todoDateInput === '') {
    Toast.fire({
        icon: "error",
        title: "Please fill in both fields."
    });
    return;
  } else {
    addTodo(todoInput, todoDateInput);
    document.getElementById('todo-input').value = '';
    document.getElementById('todo-date-input').value = '';
  }
}

/* Add a new todo item to the list */
function addTodo(task, dueDate) {
  const todoItem = {
    task,
    dueDate,
    completed: false
  };
  todoList.push(todoItem);
  renderTodoList();
    Toast.fire({
        icon: "success",
        title: "Todo added successfully"
    });
}

/* Delete all todo items with confirmation dialog */
function deleteAllTodo() {
    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
    if (result.isConfirmed) {
        todoList = [];
        renderTodoList();

        Swal.fire({
        title: "Deleted!",
        text: "All Todo has been deleted.",
        icon: "success"
        });
    }
    });
}

/* Toggle the status of a todo item (complete <-> pending) */
function toggleStatus(index) {
  todoList[index].completed = !todoList[index].completed;
  renderTodoList();
}

/* Delete a single todo item from the list */
function deleteTodo(index) {
  todoList.splice(index, 1);
  renderTodoList();
  Toast.fire({
      icon: "success",
      title: "Deleted successfully"
  });
}

/* Apply filters (status or date range) to the todo list */
function applyFilter() {
  currentFilter.status = document.getElementById("status-filter").value;
  currentFilter.start = document.getElementById("start-date").value;
  currentFilter.end = document.getElementById("end-date").value;

  /* Special validation for date range */
  if ((currentFilter.start && !currentFilter.end) || (!currentFilter.start && currentFilter.end)) {
    Toast.fire({
        icon: "error",
        title: "Please fill both Start Date and End Date to use date range filter."
    });
    return;
  }

  renderTodoList();
}

/* Clear all applied filters and reset to default */
function clearFilter() {
  currentFilter = { status: "all", start: "", end: "" };
  document.getElementById("status-filter").value = "all";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").value = "";
  renderTodoList();
}

/* Render the todo list to the HTML table with applied filters */
function renderTodoList() {
  const todoListContainer = document.getElementById('todo-list');
  const filterInfo = document.getElementById('filter-info-text');
  todoListContainer.innerHTML = '';

  let filteredList = todoList.filter(item => {
    if (currentFilter.status === "completed" && !item.completed) return false;
    if (currentFilter.status === "pending" && item.completed) return false;
    if (currentFilter.start && item.dueDate < currentFilter.start) return false;
    if (currentFilter.end && item.dueDate > currentFilter.end) return false;
    return true;
  });

  // Update filter info text
  let infoText = `Showing: ${currentFilter.status.toUpperCase()} tasks`;
  if (currentFilter.start || currentFilter.end) {
    infoText += ` | Date: ${currentFilter.start ? formatDate(currentFilter.start) : "Any"} - ${currentFilter.end ? formatDate(currentFilter.end) : "Any"}`;
  }
  filterInfo.textContent = infoText;

  if (filteredList.length === 0) {
    todoListContainer.innerHTML = `
      <tr>
        <td colspan="4" class="empty-msg">No task found</td>
      </tr>
    `;
    return;
  }

  /* Display each filtered todo item */
  filteredList.forEach((item, index) => {
    todoListContainer.innerHTML += `
  <tr>
    <td>${item.task}</td>
    <td>${formatDate(item.dueDate)}</td>
    <td>${item.completed ? "✅ Done" : "⏳ Pending"}</td>
    <td>
      <button class="status-btn ${item.completed ? 'undo-btn' : 'complete-btn'}" onclick="toggleStatus(${index})">
        ${item.completed ? "↩️ Undo" : "✅ Complete"}
      </button>
      <button class="delete-btn" onclick="deleteTodo(${index})">🗑️ Delete</button>
    </td>
  </tr>
`;
  });
}

// Initial render on page load
renderTodoList();
