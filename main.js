const input = document.getElementById("inputBox");
const sumbitBtn = document.getElementById("inputBtn");
const wrapper = document.querySelector(".wrapper");
const todoFilterSelect = document.querySelector(".status__do");
const modalContainer = document.querySelector(".modalContainer");
const todoList = document.querySelector(".todo-list");

sumbitBtn.addEventListener("click", createTodo);
todoFilterSelect.addEventListener("change", changeFilterType);
input.addEventListener("keydown", handleKeyPress);

let todoArray = [];

let filterType = "All";

renderStorageValues();

function handleKeyPress(e) {
  if (e.keyCode === 13) {
    createTodo();
  }
}

function changeFilterType(e) {
  const value = e.target.value;
  filterType = value;
  renderTodos();
}

function getFilteredTodos() {
  switch (filterType) {
    case "All":
      return todoArray;
    case "Done":
      return todoArray.filter((item) => item.buttonCheck);
    case "Undone":
      return todoArray.filter((item) => !item.buttonCheck);
    default:
      break;
  }
}

function renderStorageValues() {
  let arr = localStorage.getItem("values");
  if (!arr) {
    saveToLocalStorage();
  } else {
    let getValues = JSON.parse(arr);
    todoArray = getValues;
    renderTodos();
  }
}

function createTodo() {
  if (input.value.trim() === "") {
    return;
  } else {
    let objectDo = {
      id: Math.random().toString().substring(2, 8),
      words: input.value,
      buttonCheck: false,
    };
    todoArray.push(objectDo);
    saveToLocalStorage();
    renderTodos();
  }
}

function renderTodos() {
  todoList.innerHTML = "";
  const filteredToDos = getFilteredTodos();

  filteredToDos.forEach((todoitem) => {
    let todoListItem = document.createElement("li");
    todoListItem.className = "enviroment";
    todoListItem.id = todoitem.id;

    let todoTitle = document.createElement("div");
    todoTitle.className = "Values_words";
    todoTitle.innerHTML = todoitem.words;
    todoListItem.appendChild(todoTitle);

    let btnsContainer = document.createElement("div");
    btnsContainer.className = "btnsContainer";

    let checkbox = document.createElement("input");
    checkbox.className = "inputCheck";
    checkbox.setAttribute("type", "checkbox");

    checkbox.onclick = () => checkTodo(todoListItem.id);
    btnsContainer.appendChild(checkbox);

    let imgEdit = document.createElement("img");
    imgEdit.className = "icon__edit";
    imgEdit.src = "/ToDo/IMG/imgEdit3.webp";
    imgEdit.onclick = () => createModalWindow(todoListItem.id);
    btnsContainer.appendChild(imgEdit);

    if (todoitem.buttonCheck === true) {
      todoTitle.className = "itemWords";
      checkbox.setAttribute("checked", "");
    }
    let deleteButton = document.createElement("button");
    deleteButton.className = "inputBoxDelete";
    deleteButton.innerHTML = "X";
    deleteButton.onclick = () => deleteTodo(todoListItem.id);
    btnsContainer.appendChild(deleteButton);

    todoListItem.appendChild(btnsContainer);
    todoList.appendChild(todoListItem);
  });

  input.value = "";
}

function deleteTodo(id) {
  let updatedTodoArray = todoArray.filter((element) => element.id !== id);
  todoArray = updatedTodoArray;

  saveToLocalStorage();
  renderTodos();
}

function checkTodo(id) {
  let updatedTodoArray = todoArray.map((item) =>
    item.id === id ? { ...item, buttonCheck: !item.buttonCheck } : { ...item }
  );
  todoArray = updatedTodoArray;

  saveToLocalStorage();
  renderTodos();
}

function saveToLocalStorage() {
  localStorage.setItem("values", JSON.stringify(todoArray));
}

function createModalWindow(id) {
  modalContainer.innerHTML = "";
  todoArray.forEach((item) => {
    if (item.id === id) {
      const darkLayerWindow = document.createElement("div");
      darkLayerWindow.className = "darkLayerWindow";

      const modalWindow = document.createElement("div");
      modalWindow.className = "modalWindow";

      const innerDivModal = document.createElement("div");
      innerDivModal.className = "innerDivModal";

      let inputWindowModal = document.createElement("input");
      inputWindowModal.className = "inputWindowModal";
      inputWindowModal.value = item.words;

      const btnContainer = document.createElement("div");
      btnContainer.className = "btnContainer";

      const innerBtnOk = document.createElement("button");
      innerBtnOk.innerHTML = "Ok";
      innerBtnOk.className = "innerBtnOk";
      innerBtnOk.onclick = () => acceptEdit(id);

      const innerBtnCancel = document.createElement("button");
      innerBtnCancel.innerHTML = "Cancel";
      innerBtnCancel.className = "innerBtnCancel";
      innerBtnCancel.onclick = () => (modalContainer.innerHTML = "");

      modalContainer.appendChild(darkLayerWindow);
      modalContainer.appendChild(modalWindow);
      modalWindow.appendChild(innerDivModal);
      innerDivModal.appendChild(inputWindowModal);
      innerDivModal.appendChild(btnContainer);
      btnContainer.appendChild(innerBtnOk);
      btnContainer.appendChild(innerBtnCancel);
    }
  });
}

function acceptEdit(id) {
  todoArray.forEach((item) => {
    if (item.id === id) {
      let inputWindowModal = document.querySelector(".inputWindowModal");
      if (inputWindowModal.value.trim() === "") return;
      item.words = inputWindowModal.value;
      item.buttonCheck = false;
    }
  });

  saveToLocalStorage();
  modalContainer.innerHTML = "";
  renderTodos();
}
