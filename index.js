const InputBox = document.querySelector("#note");
const submit = document.querySelector(".inputContainer");
const ClearItems = document.querySelector(".clearItems");
const PushDiv = document.querySelector(".outputContainer");
const saveBtn = document.querySelector(".save");

let editMode = false;
let editId = "";
let editElement;

// Add Items //

submit.addEventListener("submit", addItems);
window.addEventListener("DOMContentLoaded", startup);

function addItems(e) {
  e.preventDefault();

  let value = InputBox.value;
  let id = new Date().getTime().toString();

  if (value && !editMode) {
    createItem(value, id);
    addToLocalStorage(value, id);
    backToDefault();
  } else if (value && editMode) {
    editElement.innerHTML = value;
    editLocalStorage(editId, value);
    backToDefault();
  } else {
    console.log("nothing");
  }
}

// Create New Item //

function createItem(value, id) {
  let element = document.createElement("article");
  element.classList.add("todolist");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="value">${value}</p>
  <button class="edit">edit</button>
  <button class="delete">delete</button>`;

  const editBtn = element.querySelector(".edit");
  const deleteBtn = element.querySelector(".delete");

  editBtn.addEventListener("click", editItem);
  deleteBtn.addEventListener("click", deleteItem);

  PushDiv.appendChild(element);
}

// Edit Items //

function editItem(e) {
  const element = e.currentTarget.parentElement;
  editElement = e.currentTarget.previousElementSibling;
  InputBox.value = editElement.innerHTML;
  editId = element.dataset.id;
  editMode = true;
  saveBtn.textContent = "edit";
}

// Edit Items To localStorage //

function editLocalStorage(id, value) {
  const items = getDataFromLocalStorage();
  items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("PushDiv", JSON.stringify(items));
}

// Delete Item //

function deleteItem(e) {
  const element = e.currentTarget.parentElement;
  PushDiv.removeChild(element);
  let id = element.dataset.id;
  backToDefault();
  deleteFromLocalStorage(id);
}

// Delete From localStorage //

function deleteFromLocalStorage(id) {
  let items = getDataFromLocalStorage();
  items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.removeItem("PushDiv", JSON.stringify(items));
}

// BacK to Default //

function backToDefault() {
  InputBox.value = "";
  id = "";
  editMode = false;
  saveBtn.innerHTML = "save";
}

// Add To The localStorage //

function addToLocalStorage(value, id) {
  const Input = { value, id };
  const items = getDataFromLocalStorage();
  items.push(Input);
  localStorage.setItem("PushDiv", JSON.stringify(items));
}

// Get Data From localStorage //

function getDataFromLocalStorage() {
  return localStorage.getItem("PushDiv")
    ? JSON.parse(localStorage.getItem("PushDiv"))
    : [];
}

console.log(localStorage.getItem("PushDiv"));

// On Loaded //

function startup() {
  let items = getDataFromLocalStorage();
  console.log(items.length);
  if (items.length > 0) {
    items.forEach(function (item) {
      createItem(item.value, item.id);
    });
  }
}
