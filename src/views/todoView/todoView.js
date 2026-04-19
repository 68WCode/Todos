import "./todoView.css";

export default class TodoView {
  constructor(todo, editMode = false) {
    this.todo = todo;
    this.editMode = editMode;
    this.viewElements = new Map();
    this.setupElements();
    this.addEventListeners();
    this.render();
  }

  addEventListeners() {
    let textContainer = this.viewElements.get("text-container");
    let completeCheck = this.viewElements.get("check");

    completeCheck.addEventListener("change", () => {
      this.todo.complete = completeCheck.checked;
      this.onToggleComplete(this.todo);
    });

    let notes = this.viewElements.get("notes");

    let title = this.viewElements.get("title");
    title.addEventListener("dblclick", () => {
      if (!this.editMode) {
        this.toggleEditMode();
      }
    });

    title.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.onUpdateTodo(this.todo, title.textContent, notes.value);
        this.toggleEditMode();
      }
    });

    document.addEventListener("click", (e) => {
      if (this.editMode && !textContainer.contains(e.target)) {
        this.onUpdateTodo(this.todo, title.textContent, notes.value);
        this.toggleEditMode();
      }
    });
  }

  setupElements() {
    const container = document.createElement("div");
    container.classList.add("todo");
    this.viewElements.set("container", container);

    const check = document.createElement("input");
    check.type = "checkbox";
    this.viewElements.set("check", check);

    const textContainer = document.createElement("div");
    textContainer.classList.add("todo-text");
    this.viewElements.set("text-container", textContainer);

    const notes = document.createElement("textarea");
    this.viewElements.set("notes", notes);

    const title = document.createElement("h1");
    this.viewElements.set("title", title);

    if (this.editMode) this.makeEditable();
    else notes.classList.add("hidden");

    container.dataset.id = this.todo.id;
  }

  render() {
    let container = this.viewElements.get("container");

    let textContainer = this.viewElements.get("text-container");
    let title = this.viewElements.get("title");
    title.textContent = this.todo.title;

    let notes = this.viewElements.get("notes");
    notes.placeholder = "Notes";
    notes.value = this.todo.notes;
    textContainer.append(title, notes);

    let check = this.viewElements.get("check");
    check.checked = this.todo.complete;

    if (this.editMode) this.makeEditable();
    container.append(check, textContainer);
  }

  getContent() {
    return this.viewElements.get("container");
  }

  makeEditable() {
    let title = this.viewElements.get("title");
    let notes = this.viewElements.get("notes");

    title.contentEditable = "true";
    title.focus();
    notes.classList.remove("hidden");
  }

  toggleEditMode() {
    let title = this.viewElements.get("title");
    let notes = this.viewElements.get("notes");
    let textContainer = this.viewElements.get("text-container");

    this.editMode = this.editMode ? false : true;
    if (this.editMode) {
      this.makeEditable();
    } else {
      title.contentEditable = false;
      notes.classList.add("hidden");
    }

    textContainer.focus();
  }

  bindOnUpdateTodo(callback) {
    this.onUpdateTodo = callback;
  }

  bindOnCompleteToggle(callback) {
    this.onToggleComplete = callback;
  }
}
