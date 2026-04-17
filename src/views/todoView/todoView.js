export default class TodoView {
  constructor(todo) {
    this.todo = todo;
    this.container = document.createElement("div");
    this.container.dataset.id = todo.id;
    this.render();
  }

  render() {
    const title = document.createElement("h1");
    title.textContent = this.todo.title;
    const notes = document.createElement("div");
    notes.textContent = this.todo.notes;
    this.container.append(title, notes);
  }

  getContent() {
    return this.container;
  }
}
