import "./listView.css";
import TodoView from "../todoView/todoView.js";

export default class ListView {
  constructor(container) {
    this.container = container;
    this.viewElements = new Map();

    this.setupViewElements();
    this.addEventListeners();
  }

  setupViewElements() {
    const content = document.createElement("div");
    content.id = "list-view";

    const titleSection = document.createElement("div");
    titleSection.id = "title-section";

    const title = document.createElement("h1");
    title.id = "title";

    const notes = document.createElement("textarea");
    notes.id = "notes";
    notes.placeholder = "Notes";

    const listProgress = document.createElement("input");
    listProgress.id = "list-progress";
    listProgress.type = "checkbox";

    titleSection.append(listProgress, title, notes);

    const todosSection = document.createElement("div");
    todosSection.id = "todos-section";

    this.viewElements.set("root", content);
    this.viewElements.set("title", title);
    this.viewElements.set("listProgress", listProgress);
    this.viewElements.set("notes", notes);
    this.viewElements.set("todosSection", todosSection);
    this.viewElements.set("todosViews", new Map());
    this.viewElements.set("todosToRender", new Map());

    content.append(titleSection, todosSection);
  }

  bindOnSetTitle(callback) {
    this.onSetTitle = callback;
  }

  bindRequestTodoView(callback) {
    this.requestTodoView = callback;
  }

  addEventListeners() {
    // event listener for the title that makes it editable when clicked
    // and calls the onSetTitle callback with the new title when the user presses enter or clicks away from the title
    const title = this.viewElements.get("title");
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
  }

  render(listChange = false) {
    const content = this.viewElements.get("root");

    const title = this.viewElements.get("title");
    title.textContent = this.currentList?.title;

    const listProgress = this.viewElements.get("listProgress");

    this.renderTodos(listChange);
  }

  getContent() {
    return this.viewElements.get("root");
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
    let todosContainer = this.viewElements.get("todosSection");
    let todosViews = this.viewElements.get("todosViews");
    let todosToRender = this.viewElements.get("todosToRender");

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
    this.viewElements.get("todosToRender").set(todoId, todoView);
  }
}
