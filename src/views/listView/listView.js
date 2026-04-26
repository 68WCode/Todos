import "./listView.css";
import menuIcon from "../../icons/more_horiz_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import TodoView from "../todoView/todoView.js";

export default class ListView {
  constructor() {
    this.elements = {};
    this.setupViewElements();
    this.addEventListeners();
    this.selectedTodo = null;
  }

  setupViewElements() {
    const content = document.createElement("div");
    content.id = "list-view";
    this.elements.content = content;

    const listSection = document.createElement("div");
    listSection.id = "list-section";
    this.elements.titleSection = listSection;

    const titleSection = document.createElement("div");
    titleSection.id = "title-section";

    const title = document.createElement("h1");
    title.id = "title";
    this.elements.title = title;

    const listOptionsMenu = document.createElement("div");
    this.elements.optionsMenu = listOptionsMenu;
    listOptionsMenu.id = "options-menu";

    const listOptionsToggle = document.createElement("button");
    listOptionsToggle.innerHTML = menuIcon;
    this.elements.listOptionsToggle = listOptionsToggle;
    listOptionsToggle.id = "options-toggle";

    const listOptionsPanel = document.createElement("div");
    this.elements.optionsPanel = listOptionsPanel;
    this.elements.listOptionsPanel = listOptionsPanel;
    listOptionsPanel.id = "options-panel";

    const completeList = document.createElement("button");
    completeList.textContent = "Complete";
    this.elements.completeList = completeList;

    const setDate = document.createElement("button");
    setDate.textContent = "When";

    const duplicate = document.createElement("button");
    duplicate.textContent = "Duplicate";

    const deleteList = document.createElement("button");
    this.elements.deleteList = deleteList;
    deleteList.textContent = "Delete";

    listOptionsPanel.append(completeList, setDate, duplicate, deleteList);
    listOptionsPanel.classList.add("hidden");

    listOptionsMenu.append(listOptionsToggle, listOptionsPanel);

    const notes = document.createElement("textarea");
    notes.id = "notes";
    notes.placeholder = "Notes";
    this.elements.notes = notes;

    const listProgress = document.createElement("input");
    listProgress.id = "list-progress";
    listProgress.type = "checkbox";
    this.elements.listProgress = listProgress;

    listSection.append(listProgress, titleSection, notes);
    titleSection.append(title, listOptionsMenu);

    const todosSection = document.createElement("div");
    todosSection.id = "todos-section";
    this.elements.todosSection = todosSection;

    this.elements.todosViews = new Map();
    this.elements.todosToRender = new Map();

    content.append(listSection, todosSection);
  }

  bindOnSetTitle(callback) {
    this.onSetTitle = callback;
  }

  bindOnNotesUpdate(callback) {
    this.onNotesUpdate = callback;
  }

  bindRequestTodoView(callback) {
    this.requestTodoView = callback;
  }

  bindOnDeleteList(callback) {
    this.deleteList = callback;
  }

  addEventListeners() {
    // event listener for the title that makes it editable when clicked
    // and calls the onSetTitle callback with the new title when the user presses enter or clicks away from the title
    const title = this.elements.title;
    title.addEventListener("click", () => {
      title.contentEditable = "true";
      title.focus();
    });

    title.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        let newTitle = title.textContent;
        title.blur();
      }
    });

    title.addEventListener("blur", (e) => {
      this.onSetTitle(this.currentList.id, title.textContent);
      title.contentEditable = "false";
    });

    this.elements.notes.addEventListener("change", (e) => {
      this.onNotesUpdate(this.currentList.id, this.elements.notes.value);
    });

    // document.addEventListener("click", (e) => {
    //   const menuPanel = this.elements.listOptionsPanel;
    //   if (
    //     e.target != this.elements.listOptionsToggle &&
    //     this.elements.listOptionsToggle.classList.contains("active") &&
    //     !menuPanel.contains(e.target)
    //   ) {
    //     this.elements.listOptionsToggle.classList.toggle("active");
    //     menuPanel.classList.toggle("hidden");
    //   }
    // });

    this.elements.listOptionsToggle.addEventListener("click", (e) => {
      this.elements.listOptionsPanel.classList.toggle("hidden");
      this.elements.listOptionsToggle.classList.toggle("active");
    });

    this.elements.deleteList.addEventListener("click", () => {
      this.deleteList(this.currentList.id);
    });
  }

  render(listChange = false) {
    const title = this.elements.title;
    title.textContent = this.currentList?.title;

    const notes = this.elements.notes;
    notes.value = this.currentList?.notes;

    const listProgress = this.elements.listProgress;

    this.renderTodos(listChange);
  }

  getContent() {
    return this.elements.content;
  }

  setCurrentList(list) {
    this.currentList = list;
  }

  getCurrentList() {
    return this.currentList;
  }

  renderTodos(listChange = false) {
    // renders the todos for the current list in the todos section of the view,
    // if listChange is true it clears the previously rendered todos and renders all the todos for the current list,
    // if listChange is false it only renders the new todos that have been added to the current list since the last render
    console.log(this.currentList);
    let todosContainer = this.elements.todosSection;
    let todosViews = this.elements.todosViews;
    let todosToRender = this.elements.todosToRender;

    let todos = this.currentList?.todos;
    if (listChange) {
      todosViews.clear();
      todosContainer.innerHTML = "";
    }

    if (todos) {
      todos.forEach((todo) => {
        if (!todosViews.has(todo.id)) {
          let todoView = this.requestTodoView(todo);
          todosViews.set(todo.id, todoView);
          todosContainer.appendChild(todoView.getContent());
        } else if (todosToRender.has(todo.id)) {
          let todoView = todosViews.get(todo.id);
          todosContainer.appendChild(todoView.getContent());
          todosToRender.delete(todo.id);
        }
      });
    }
  }

  addTodoView(todoId, todoView) {
    // adds a todo view to the todosToRender map with the todoId as key and the todoView as value,
    // so that it can be rendered in the next render call
    this.elements.todosToRender.set(todoId, todoView);
  }
}
