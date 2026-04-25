import "./today.css";
export class TodayView {
  constructor(todosToday) {
    this.todos = todosToday;
    this.elements = {};
    this.setupViewElements();
  }

  bindRequestTodoView(callback) {
    this.requestTodoView = callback;
  }

  setupViewElements() {
    let container = document.createElement("div");
    this.elements.container = container;
    container.id = "today-view";

    let title = document.createElement("h1");
    title.textContent = "Today";
    this.elements.title = title;

    let todosSection = document.createElement("div");
    this.elements.todosSection = todosSection;
    todosSection.id = "today-todos-section";

    container.append(title, todosSection);
  }

  getContent() {
    return this.elements.container;
  }

  render() {
    this.renderTodos();
  }

  renderTodos() {
    for (let [list, todos] of Object.entries(this.todos)) {
      let listTitle = document.createElement("h3");
      listTitle.textContent = list;
      this.elements.todosSection.append(listTitle);
      for (let todo of todos) {
        let todoView = this.requestTodoView(todo);
        this.elements.todosSection.appendChild(todoView.getContent());
      }
    }
  }
}
