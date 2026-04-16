import "./listView.css";
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

    content.append(titleSection);
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
        this.onSetTitle?.(newTitle);
        title.blur();
      }
    });
  }

  render(list) {
    const content = this.viewElements.get("root");
    const title = this.viewElements.get("title");
    const listProgress = this.viewElements.get("listProgress");

    title.textContent = list.title;
  }

  getContent() {
    return this.viewElements.get("root");
  }
}
