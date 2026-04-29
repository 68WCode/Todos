export default class StorageManager {
  constructor() {
    this.lists = localStorage.getItem("lists") || [];
    this.trash = localStorage.getItem("trash") || [];
  }

  addList(list) {
    // adds a list to localStorage as a [listId, list] pair
    let lists = this.getLists();
    lists.push([list.id, list]);
    lists = JSON.stringify(lists);
    localStorage.setItem("lists", lists);
  }

  deleteList(listId) {
    let lists = this.getLists();
    lists = lists.filter((listPair) => listPair[0] != listId);
    lists = JSON.stringify(lists);
    localStorage.setItem("lists", lists);
  }

  deleteTodo(listId, todoId) {
    let lists = this.getLists();
    let list = null;
    for (let [id, l] of lists) {
      if (id == listId) {
        list = l;
        break;
      }
    }
    let todo = list.todos.find((todo) => todo.id == todoId);
    if (todo) {
      let trash = JSON.parse(localStorage.getItem("trash") || "[]");
      trash.push(todo);
      localStorage.setItem("trash", JSON.stringify(trash));
    }

    let newTodos = list.todos.filter((todo) => todo.id != todoId);
    list.todos = newTodos;
    for (let indx in lists) {
      if (lists[indx][0] == listId) {
        lists[indx][1] = list;
        break;
      }
    }
    lists = JSON.stringify(lists);
    localStorage.setItem("lists", lists);
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

  updateList(listId, updates) {
    let lists = this.getListMap();
    let list = lists.get(listId);
    if (list) {
      if (updates.title) {
        list["title"] = updates.title;
      }
      if ("notes" in updates) {
        list["notes"] = updates.notes;
      }
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

  getTrash() {
    // returns the trash array from localStorage parsed
    return JSON.parse(localStorage.getItem("trash") || "[]");
  }

  emptyTrash() {
    // empties the trash in localStorage
    localStorage.setItem("trash", JSON.stringify([]));
  }
}
