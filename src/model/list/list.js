import Todo from "../todo/todo.js";
export class List {
  constructor(
    title = "New List",
    notes = "",
    id = crypto.randomUUID(),
    todos = [],
  ) {
    this.title = title;
    this.id = id;
    this.notes = notes;
    this.todos = todos;
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
    return {
      id: this.id,
      title: this.title,
      notes: this.notes,
      todos: this.todos,
    };
  }
}
