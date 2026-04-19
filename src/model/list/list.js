import Todo from "../todo/todo.js";
export class List {
  constructor(
    title = "New List",
    description = "",
    id = crypto.randomUUID(),
    todos = [],
  ) {
    this.title = title;
    this.description = description;
    this.id = id;
    this.todos = todos;
  }

  setTitle(title) {
    this.title = title;
  }

  setDescription(desc) {
    this.description = desc;
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  updateTodo(todoId, updatedTodo) {
    // updates a todo in the list given the todoId and updatedTodo object
    let index = this.todos.findIndex((todo) => todo.id === todoId);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
    }
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      description: this.description,
      todos: this.todos,
    });
  }
}
