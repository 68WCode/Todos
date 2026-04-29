import "./trashView.css";

export default class TrashView {
  constructor(trash) {
    this.trash = trash;
    this.elements = {};
    this.setupViewElements();
    this.addEventListeners();
  }

  addEventListeners() {
    this.elements.emptyTrashBttn.addEventListener("click", () => {
      this.emptyTrash();
    });
  }

  bindEmptyTrash(callback) {
    this.emptyTrash = callback;
  }

  setupViewElements() {
    this.elements.container = document.createElement("div");
    this.elements.container.classList.add("trash-view");
    this.elements.title = document.createElement("h1");
    this.elements.title.textContent = "Trash";
    this.elements.container.appendChild(this.elements.title);
    this.elements.emptyTrashBttn = document.createElement("button");
    this.elements.emptyTrashBttn.textContent = "Empty Trash";
    this.elements.emptyTrashBttn.id = "empty-trash-bttn";
    this.elements.container.appendChild(this.elements.emptyTrashBttn);
    this.elements.trashContainer = document.createElement("div");
    this.elements.trashContainer.classList.add("trash-container");
    this.elements.container.appendChild(this.elements.trashContainer);
  }

  bindOnRequestTodoView(onRequestTodoView) {
    this.requestTodoView = onRequestTodoView;
  }

  render() {
    this.elements.trashContainer.innerHTML = "";
    for (let todo of this.trash) {
      let todoView = this.requestTodoView(todo);
      this.elements.trashContainer.appendChild(todoView.getContent());
    }
  }

  getContent() {
    return this.elements.container;
  }
}
