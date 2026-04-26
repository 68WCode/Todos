export default class HomeView {
  constructor(container, currentLists = []) {
    this.viewElements = new Map();
    this.container = container;
    this.currentLists = currentLists;
    this.setupViewElements();
    this.addEventListeners();
  }

  setupViewElements() {
    // initializes the view elements and stores them in a map for easy access
    const content = document.getElementById("content");
    const sidebar = document.getElementById("sidebar");
    const lists = document.getElementById("lists");
    const newListBttn = document.getElementById("new-list-bttn");
    const createTodoButton = document.getElementById("create-todo-bttn");
    const todayButton = document.getElementById("today-bttn");

    this.viewElements.set("content", content);
    this.viewElements.set("sidebar", sidebar);
    this.viewElements.set("lists", lists);
    this.viewElements.set("list-bttns", new Map());
    this.viewElements.set("newListBttn", newListBttn);
    this.viewElements.set("createTodoBttn", createTodoButton);
    this.viewElements.set("todayBttn", todayButton);

    this.updateListBttns();
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

  bindDisplayTodayView(callback) {
    this.displayTodayView = callback;
    this.viewElements.get("todayBttn").classList.add();
  }

  setCurrentViewDisplayed(view) {
    this.currentViewDisplayed = view;
  }

  addEventListeners() {
    // event listener for the new list button that calls the onNewList callback when clicked
    const newListBttn = this.viewElements.get("newListBttn");
    newListBttn.addEventListener("click", () => {
      this.onNewList?.();
    });

    // event listener for the list buttons that calls the onListBttnSelected callback with the listId when a list button is clicked
    const listBttns = this.viewElements.get("lists");
    listBttns.addEventListener("click", (e) => {
      let bttn = e.target.closest(".list-bttn");
      if (!bttn) return;
      let listId = bttn.dataset.listId;
      this.onListBttnSelected(listId);
      this.selectListBttn(listId);
    });

    const createButton = this.viewElements.get("createTodoBttn");
    // event listener for the create todo button that calls the onCreateTodo callback when clicked
    createButton.addEventListener("click", () => this.onCreateTodo());

    this.viewElements.get("todayBttn").addEventListener("click", () => {
      this.displayTodayView();
      this.displayCurrentViewBttn(this.viewElements.get("todayBttn"));
    });
  }

  displayCurrentViewBttn(bttn) {
    let currentlySelected = document.querySelector(".current-view");
    if (currentlySelected) currentlySelected.classList.toggle("current-view");
    bttn.classList.add("current-view");
  }

  selectListBttn(listId) {
    // toggles the "current-view" class on the selected list button and removes it from any previously selected button
    let currentlySelected = document.querySelector(".current-view");
    if (currentlySelected) currentlySelected.classList.toggle("current-view");
    let listBttn = this.viewElements.get("list-bttns").get(listId);
    listBttn?.classList.add("current-view");
  }

  updateListBttn(listId, textContent) {
    // updates the text content of a list button given the listId and new textContent
    let listBttn = this.viewElements.get("list-bttns").get(listId);
    listBttn.textContent = textContent;
  }

  updateListBttns() {
    let listBttns = this.viewElements.get("lists");
    listBttns.innerHTML = "";
    for (let list of this.currentLists) {
      this.newListBttn(list);
    }
  }

  newListBttn(list) {
    // creates a new list button for a given list object and adds it to the lists element
    let listBttn = document.createElement("button");
    listBttn.textContent = list.title.trim() || "Untitled List";
    listBttn.id = `${list.id}-list-bttn`;
    listBttn.classList.add("list-bttn");
    listBttn.dataset.listId = list.id;
    this.viewElements.get("lists").appendChild(listBttn);
    this.viewElements.get("list-bttns").set(list.id, listBttn);
  }

  render() {
    // renders the given view in the content area of the home view
    this.viewElements.get("content").innerHTML = "";
    this.viewElements
      .get("content")
      .appendChild(this.currentViewDisplayed.getContent());

    this.updateListBttns();
  }

  displayView(view) {
    const content = this.viewElements.get("content");
    content.innerHTML = "";
    content.appendChild(view);
  }

  getContent() {
    // returns the content element of the home view
    return this.viewElements.get("content");
  }
}
