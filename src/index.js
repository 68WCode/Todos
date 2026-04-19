import "./reset.css";
import "./style.css";
import { List } from "./model/list/list.js";
import StorageManager from "./storage.js";
import ListView from "./views/listView/listView.js";
import HomeView from "./views/homeView/homeView.js";
import TodoView from "./views/todoView/todoView.js";
import Todo from "./model/todo/todo.js";

class App {
  constructor() {
    this.storage = new StorageManager();
    this.root = document.querySelector("body");
    this.lists = this.storage.getListMap();
    this.updateLists();
    this.lists.forEach((list, listId) => {
      this.lists.set(
        listId,
        new List(list.title, list.description, list.id, list.todos),
      );
    });
    this.setupViews();
    this.bindEventListeners();
    this.render();
  }

  updateLists() {
    // formats the lists in localStorage to be instances of the List class instead of plain objects
    this.lists = this.storage.getListMap();
    this.lists.forEach((list, listId) => {
      if (!(list instanceof List)) {
        try {
          this.lists.set(
            listId,
            new List(list.title, list.description, list.id, list.todos),
          );
        } catch (e) {
          console.error(`Error parsing list with id ${listId}:`, e);
          // if parsing fails, leave the list as-is (it will be ignored in the app since it's not an instance of List)
        }
      }
    });
  }

  bindEventListeners() {
    // callback for when the new list button is clicked in the home view that:
    // creates a new list,
    // adds it to localStorage,
    // adds a new list button to the home view
    // sets the current list in the list view to the new list
    // and renders the new list in the list view
    const handleNewList = () => {
      let list = new List();
      this.storage.addList(list);
      this.homeView.newListBttn(list);
      this.homeView.selectListBttn(list.id);
      this.listView?.setCurrentList(list);
      this.listView?.render(true);
      this.updateLists();
    };
    this.homeView?.bindOnNewList(handleNewList);

    // callback for when the title of a list is changed in the list view that:
    // updates the title of the list in localStorage,
    // and updates the text content of the corresponding list button in the home view
    const onSetTitle = (listId, newTitle) => {
      this.storage.updateListTitle(listId, newTitle);
      this.homeView.updateListBttn(listId, newTitle);
    };
    this.listView.bindOnSetTitle(onSetTitle);

    // callback for when a list button is selected in the home view that sets the current list in the list view and renders it
    const onListBttnSelected = (listId) => {
      let list = this.lists.get(listId);

      if (list) {
        this.listView.setCurrentList(list);
        this.listView.render(true);
      }
    };
    this.homeView?.bindOnListBttnSelected(onListBttnSelected);

    // callback for when a todo view is requested in the list view that creates a new todo view for the requested todo and returns it
    const onTodoViewRequested = (todo) => {
      return this.createTodoView(todo);
    };
    this.listView?.bindRequestTodoView(onTodoViewRequested);

    // callback for when the create todo button is clicked in the home view that:
    // creates a new todo,
    // adds it to the current list in the list view,
    // adds it to localStorage,
    // creates a new todo view for the new todo,
    // and renders the new todo view in the list view
    const onCreateTodo = () => {
      const currentList = this.listView.getCurrentList();
      const todo = new Todo(currentList.id);
      const todoView = this.createTodoView(todo, true);
      currentList.addTodo(todo);
      this.storage.addTodo(currentList.id, todo);

      this.updateLists();

      this.listView.addTodoView(todo.id, todoView);
      this.listView.render();
    };
    this.homeView?.bindOnCreateTodo(onCreateTodo);
  }

  createTodoView(todo, editable = false) {
    const onTodoUpdate = (todo, newTitle, notes) => {
      todo.title = newTitle;
      todo.notes = notes;
      todo.parentList = todo.parentList || this.listView.getCurrentList().id;
      let list = this.lists.get(todo.parentList);
      list.updateTodo(todo.id, todo);

      this.storage.updateTodo(todo.parentList, todo.id, todo);
      this.updateLists();
      this.listView.setCurrentList(list);
      this.listView.render();
    };

    const onToggleComplete = (todo) => {
      let list = this.lists.get(todo.parentList);
      list.updateTodo(todo.id, todo);

      this.storage.updateTodo(todo.parentList, todo.id, todo);
      this.updateLists();
      this.listView.setCurrentList(list);
      this.listView.render();
    };

    let todoView = new TodoView(todo, editable);
    todoView.bindOnUpdateTodo(onTodoUpdate);
    todoView.bindOnCompleteToggle(onToggleComplete);

    return todoView;
  }

  setupViews() {
    // initializes the homeView and listView and renders the homeView with the lists from localStorage

    let lists = [...this.lists.values()];
    this.homeView = new HomeView(this.root, lists);
    this.listView = new ListView(this.homeView.getContent());
  }

  render() {
    let todayList = new List("Today");
    this.listView?.setCurrentList(todayList);
    this.listView?.render();

    this.homeView?.render(this.listView);
  }
}

new App();
