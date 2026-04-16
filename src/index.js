import "./reset.css";
import "./style.css";
import { List } from "./list/list.js";
import Storage from "./storage.js";
import { listView } from "./listView/listView.js";
import { newListView } from "./newList/newList.js";
import { todayView } from "./today/today.js";

const storage = new Storage();

const content = document.getElementById("content");

const lists = document.getElementById("lists");

let newListBttn = document.getElementById("new-list-bttn");
newListBttn.onclick = () => newList();

let createTodoButton = document.getElementById("create-todo-bttn");
createTodoButton.onclick = () => createTodo();

let displayedTodoList;

refreshLists();

displayView(todayView());
document.getElementById("today-bttn").classList.add("current-view");

function getLists() {
  return storage.getLists();
}

function displayView(view) {
  content.innerHTML = "";
  content.appendChild(view);
}

function newList() {
  let list = new List();

  storage.addList(list);
  refreshLists();
  selectCurrentView(document.getElementById(`${list.id}-list-bttn`));
  displayView(listView(list, { onSaveTitle }));
  displayedTodoList = list.id;
}

function selectCurrentView(current) {
  let currentlySelected = document.querySelector(".current-view");
  if (currentlySelected) currentlySelected.classList.toggle("current-view");

  current.classList.toggle("current-view");
}

function refreshLists() {
  const storedLists = storage.getLists();
  lists.innerHTML = "";
  if (storedLists) {
    storedLists.forEach((list) => {
      list = List.fromJSON(list);
      let listBttn = document.createElement("button");
      listBttn.textContent = list.getTitle();
      listBttn.id = `${list.getId()}-list-bttn`;
      listBttn.onclick = () => {
        selectCurrentView(listBttn);
        displayView(
          listView(list, {
            onSaveTitle,
          }),
        );
        displayedTodoList = list.id;
      };

      lists.appendChild(listBttn);
    });
  }
}

function listTitleUpdated(title, listBttn) {
  listBttn.textContent = title;
}

function onSaveTitle(id, newTitle) {
  storage.updateTitle(id, newTitle);
  let listBttn = document.getElementById(`${id}-list-bttn`);
  listTitleUpdated(newTitle, listBttn);
}

function createTodo() {
  let newTodoView = document.createElement("div");

  newTodoView.classList.add("editable-todo");

  let completeCheckBox = document.createElement("input");
  completeCheckBox.type = "checkbox";

  let title = document.createElement("input");
  title.placeholder = "New Todo";
  let notes = document.createElement("textarea");
  notes.placeholder = "Notes";

  newTodoView.append(completeCheckBox, title, notes);

  let todosSection = document.getElementById("todos-section");
  todosSection.appendChild(newTodoView);
}
