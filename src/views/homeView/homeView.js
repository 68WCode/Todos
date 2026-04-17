export default class HomeView {
  constructor(container) {
    this.viewElements = new Map();
    this.container = container;
    this.setupViewElements();
    this.addEventListeners();
  }

  setupViewElements() {
    const content = document.getElementById("content");
    const sidebar = document.getElementById("sidebar");
    const lists = document.getElementById("lists");
    const newListBttn = document.getElementById("new-list-bttn");
    const createTodoButton = document.getElementById("create-todo-bttn");

    this.viewElements.set("content", content);
    this.viewElements.set("sidebar", sidebar);
    this.viewElements.set("lists", lists);
    this.viewElements.set("list-bttns", new Map());
    this.viewElements.set("newListBttn", newListBttn);
    this.viewElements.set("createTodoBttn", createTodoButton);
  }

  bindOnListBttnSelected(callback) {
    this.onListBttnSelected = callback;
  }

  bindOnNewList(callback) {
    this.onNewList = callback;
  }

  bindOnCreateTodo(callback) {
    this.onCreateTodo = callback;
  }

  addEventListeners() {
    const newListBttn = this.viewElements.get("newListBttn");
    newListBttn.addEventListener("click", () => {
      this.onNewList?.();
    });

    const listBttns = this.viewElements.get("lists");
    listBttns.addEventListener("click", (e) => {
      let bttn = e.target.closest(".list-bttn");
      if (!bttn) return;
      let listId = bttn.dataset.listId;
      this.selectListBttn(listId);
      this.onListBttnSelected(listId);
    });

    const createButton = this.viewElements.get("createTodoBttn");
    createButton.addEventListener("click", () => this.onCreateTodo());
  }

  selectListBttn(listId) {
    let currentlySelected = document.querySelector(".current-view");
    if (currentlySelected) currentlySelected.classList.toggle("current-view");
    let listBttn = this.viewElements.get("list-bttns").get(listId);
    listBttn?.classList.add("current-view");
  }

  updateListBttn(listId, textContent) {
    let listBttn = this.viewElements.get("list-bttns").get(listId);
    listBttn.textContent = textContent;
  }

  renderLists(lists) {
    const listsDisplay = this.viewElements.get("lists");

    if (lists) {
      for (let list of lists) {
        let listId = list.getId();
        let listBttn = this.viewElements.get("list-bttns").get(listId);
        if (!listBttn) {
          listBttn = document.createElement("button");
          listBttn.textContent = list.getTitle();
          listBttn.id = `${list.getId()}-list-bttn`;
          listBttn.classList.add("list-bttn");
          listBttn.dataset.listId = list.getId();
          listsDisplay.appendChild(listBttn);
          this.viewElements.get("list-bttns").set(list.getId(), listBttn);
        }
      }
    }
  }

  render(view) {
    this.viewElements.get("content").appendChild(view.getContent());
  }

  displayView(view) {
    const content = this.viewElements.get("content");
    content.innerHTML = "";
    content.appendChild(view);
  }

  getContent() {
    return this.viewElements.get("content");
  }
}
