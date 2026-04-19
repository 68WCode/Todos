export default class StorageManager {
  constructor() {
    this.lists = localStorage.getItem("lists") || [];
  }

  addList(list) {
    // adds a list to localStorage as a [listId, list] pair
    let lists = this.getLists();
    lists.push([list.id, list]);
    lists = JSON.stringify(lists);
    localStorage.setItem("lists", lists);
  }

  getLists() {
    // returns all lists in localStorage parsed
    let lists = JSON.parse(localStorage.getItem("lists")) || [];
    return lists.map(([listId, list]) => [listId, list]);
  }

  getLists() {
    // returns all lists in localStorage parsed
    let lists = JSON.parse(localStorage.getItem("lists") || "[]");

    return lists.map(([listId, list]) => {
      if (typeof list === "string") {
        try {
          list = JSON.parse(list);
        } catch {
          // leave it as-is if parsing fails
        }
      }

      if (Array.isArray(list.todos)) {
        list.todos = list.todos.map((todo) => {
          if (typeof todo === "string") {
            try {
              return JSON.parse(todo);
            } catch {
              return todo;
            }
          }
          return todo;
        });
      }

      return [listId, list];
    });
  }

  formatListsToMap() {
    // returns a map of lists with listId as key and list object as value
    let lists = this.getLists();
    let listsMap = new Map();
    for (let [listId, list] of lists) {
      listsMap.set(listId, list);
    }
    return listsMap;
  }

  getListMap() {
    // returns a map of lists with listId as key and list object as value
    return this.formatListsToMap();
  }

  updateListTitle(listId, newTitle) {
    // updates the title of a list in localStorage given the listId and newTitle
    let lists = this.getListMap();
    let list = lists.get(listId);
    if (list) {
      list["title"] = newTitle;
      lists.set(listId, list);
      localStorage.setItem("lists", JSON.stringify([...lists]));
    }
  }

  updateTodoTitle(listId, todoId, newTitle) {
    // updates the title of a todo in localStorage given the listId, todoId and newTitle
    let lists = this.getListMap();
    let list = lists.get(listId);
    if (list) {
      let todo = list.todos.find((todo) => todo.id === todoId);
      if (todo) {
        todo.title = newTitle;
        lists.set(listId, list);
        localStorage.setItem("lists", JSON.stringify([...lists]));
      }
    }
  }

  updateTodo(listId, todoId, updatedTodo) {
    // updates a todo in localStorage given the listId, todoId and updatedTodo object
    let lists = this.getListMap();
    let list = lists.get(listId);
    if (list) {
      let index = list.todos.findIndex((todo) => todo.id === todoId);
      if (index !== -1) {
        list.todos[index] = updatedTodo;
        lists.set(listId, list);
        localStorage.setItem("lists", JSON.stringify([...lists]));
      }
    }
  }

  addTodo(listId, todo) {
    // adds a todo to a list in localStorage given the listId and todo object
    let lists = this.getListMap();
    let list = lists.get(listId);
    if (list) {
      list.todos.push(todo);
      lists.set(listId, list);
      localStorage.setItem("lists", JSON.stringify([...lists]));
    }
  }
}
