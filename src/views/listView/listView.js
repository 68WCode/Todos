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

    const listProgress = document.createElement("input");
    listProgress.id = "list-progress";
    listProgress.type = "checkbox";

    titleSection.append(listProgress, title);

    const todosSection = document.createElement("div");
    todosSection.id = "todos-section";

    this.viewElements.set("root", content);
    this.viewElements.set("title", title);
    this.viewElements.set("listProgress", listProgress);
    this.viewElements.set("todosSection", todosSection);
    this.viewElements.set("todosViews", new Map());

    content.append(titleSection, todosSection);
  }

  bindOnSetTitle(callback) {
    this.onSetTitle = callback;
  }

  addEventListeners() {
    const title = this.viewElements.get("title");
    title.addEventListener("click", () => {
      title.contentEditable = "true";
      title.focus();
    });

    title.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        let newTitle = title.textContent;
        title.blur();
        this.onSetTitle(this.currentList.id, newTitle);
      }
    });
  }

  render() {
    const content = this.viewElements.get("root");

    const title = this.viewElements.get("title");
    title.textContent = this.currentList?.title;

    const listProgress = this.viewElements.get("listProgress");

    const todosSection = this.viewElements.get("todosSection");
    const todos = this.currentList.getTodos();
    const todosViews = this.viewElements.get("todosViews");
    for (let todo of todos) {
      let todoView = todosViews.get(todo.id);
      if (!todoView) {
        let todoView = new TodoView(todo);
        todosViews.set(todo.id, todoView);
        todosSection.appendChild(todoView);
      }
    }
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

  renderTodos() {
    let todosContainer = this.viewElements.get("todosSection");
    let todosViews = this.viewElements.get("todosViews");
    todosViews.clear();
    let todos = this.currentList?.getTodos();
    if (todos) {
      for (let todo of todos) {
        if (!todosViews.get(todo.id)) {
          todosContainer.append(todoView.getContent());
        }
      }
    }
  }
}
