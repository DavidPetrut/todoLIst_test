const formList = document.querySelector("[data-new-list-form]");
const inputList = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const taskDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const taskTitle = document.querySelector("[data-list-title]");
const taskCounter = document.querySelector("[data-list-count]");
const taskContainer = document.querySelector("[data-tasks]");
const templateTask = document.querySelector("#task-template");
const formTasks = document.querySelector("[data-new-task-form]");
const inputTasks = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

let listsContainer = document.querySelector("[data-lists]");

const LOCAL_STORAGE_LIST_KEY = "list.key";
const LOCAL_STORAGE_LIST_KEY_ID = "list.key.listId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedList = localStorage.getItem(LOCAL_STORAGE_LIST_KEY_ID);

deleteListButton.addEventListener("click", () => {
  lists = lists.filter((e) => e.id !== selectedList);
  selectedList = null;
  saveRender();
});

clearCompleteTasksButton.addEventListener("click", (e) => {
  const ourSelectedList = lists.find((e) => e.id === selectedList);
  ourSelectedList.tasks = ourSelectedList.tasks.filter((e) => !e.complete);
  saveRender();
});

taskContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const ourSelectedList = lists.find((e) => e.id === selectedList);
    const selectedTasks = ourSelectedList.tasks.find(
      (x) => x.id === e.target.id
    );
    selectedTasks.complete = e.target.checked;
    renderTaskCount(ourSelectedList);
    saveLocal();
  }
});

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedList = e.target.dataset.listId;
    saveRender();
  }
});

formTasks.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = inputTasks.value;
  if (task === null || task === "") return;
  const newTask = createTask(task);
  inputTasks.value = null;
  const selectedListId = lists.find((e) => e.id === selectedList);
  selectedListId.tasks.push(newTask);
  saveRender();
});

formList.addEventListener("submit", (e) => {
  e.preventDefault();
  const list = inputList.value;
  if (list === null || list === "") return;
  const newList = createList(list);
  lists.push(newList);
  inputList.value = null;
  saveRender();
});

function createList(name) {
  return {
    id: Date().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date().toString(),
    name: name,
    complete: false,
  };
}

function saveRender() {
  render();
  saveLocal();
}

function saveLocal() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY_ID, selectedList);
}

function render() {
  clearElements(listsContainer);
  renderLists();

  const ourSelectedList = lists.find((e) => e.id === selectedList);

  if (!selectedList) {
    taskDisplayContainer.style.display = "none";
  } else {
    taskDisplayContainer.style.display = "";
    taskTitle.innerText = ourSelectedList.name;
    renderTaskCount(ourSelectedList);
    clearElements(taskContainer);
    renderTasks(ourSelectedList);
  }
}

function renderTasks(ourList) {
  ourList.tasks.forEach((task) => {
    const taskElement = document.importNode(templateTask.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    taskContainer.appendChild(taskElement);
  });
}

function renderTaskCount(list) {
  const incompleteTasks = list.tasks.filter((e) => !e.complete).length;
  const pluralCheck = incompleteTasks === 1 ? "task" : "tasks";
  taskCounter.innerText = `${incompleteTasks} ${pluralCheck} remaining`;
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    listElement.dataset.listId = list.id;
    if (list.id === selectedList) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}

function clearElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
