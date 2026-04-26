import "./reset.css";
import "./style.css";
import { List } from "./model/list/list.js";
import StorageManager from "./storage.js";
import ListView from "./views/listView/listView.js";
import HomeView from "./views/homeView/homeView.js";
import TodoView from "./views/todoView/todoView.js";
import Todo from "./model/todo/todo.js";
import { TodayView } from "./views/todayView/todayView.js";

class App {
  constructor() {
    // window.localStorage.clear();
    this.storage = new StorageManager();
    this.root = document.querySelector("body");
    this.lists = this.storage.getListMap();
    this.updateLists();
    console.log(this.lists);
    this.lists.forEach((list, listId) => {
      this.lists.set(
        listId,
        new List(list.title, list.notes, list.id, list.todos),
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
            new List(list.title, list.notes, list.id, list.todos),
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

    const onDisplayTodoView = () => {
      this.homeView.setCurrentViewDisplayed(this.todayView);
      this.updateViews();
    };
    this.homeView.bindDisplayTodayView(onDisplayTodoView);

    const handleNewList = () => {
      let list = new List();
      this.storage.addList(list);

      this.updateLists();

      this.listView.setCurrentList(list);
      this.homeView.setCurrentViewDisplayed(this.listView);
      this.updateViews();
    };
    this.homeView?.bindOnNewList(handleNewList);

    // callback for when a list button is selected in the home view that sets the current list in the list view and renders it
    const onListBttnSelected = (listId) => {
      let list = this.lists.get(listId);

      if (list) {
        this.listView.setCurrentList(list);
        this.homeView.setCurrentViewDisplayed(this.listView);
        this.updateViews();
      }
    };
    this.homeView?.bindOnListBttnSelected(onListBttnSelected);

    // callback for when the title of a list is changed in the list view that:
    // updates the title of the list in localStorage,
    // and updates the text content of the corresponding list button in the home view
    const onSetTitle = (listId, newTitle) => {
      this.storage.updateList(listId, { title: newTitle });
      this.updateLists();
      this.updateViews();
    };

    const onListNotesUpdate = (listId, newNotes) => {
      this.storage.updateList(listId, { notes: newNotes });
      this.updateLists();
      this.updateViews();
    };
    this.listView.bindOnSetTitle(onSetTitle);
    this.listView.bindOnNotesUpdate(onListNotesUpdate);

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
      this.updateViews();
    };
    this.homeView?.bindOnCreateTodo(onCreateTodo);

    const deleteList = (listId) => {
      this.storage.deleteList(listId);
      this.updateLists();
      this.homeView.setCurrentViewDisplayed(this.todayView);
      this.updateViews();
    };
    this.listView.bindOnDeleteList(deleteList);
  }

  createTodoView(todo, editable = false) {
    const onTodoUpdate = (updates) => {
      todo = { ...todo, ...updates };

      this.storage.updateTodo(todo.parentList, todo.id, todo);
      this.updateLists();

      todoView.todo = todo;
      todoView.render();
      this.updateViews();
    };

    const onDeleteTodo = (listId, todoId) => {
      this.storage.deleteTodo(listId, todoId);
      this.updateLists();
      this.updateViews();
    };

    let todoView = new TodoView(todo, editable);
    todoView.bindOnUpdateTodo(onTodoUpdate);
    todoView.bindOnDelete(onDeleteTodo);

    return todoView;
  }

  setupViews() {
    // initializes the homeView and listView and renders the homeView with the lists from localStorage

    const onRequestTodoView = (todo) => {
      return this.createTodoView(todo);
    };

    let lists = [...this.lists.values()];
    this.homeView = new HomeView(this.root, lists);
    this.listView = new ListView();
    this.todayView = new TodayView(this.getTodosToday());
    this.todayView.bindRequestTodoView(onRequestTodoView);
    this.todayView.render();
  }

  getTodosToday() {
    const dueToday = {};
    const rightNow = new Date();
    const today = new Date(
      rightNow.getFullYear(),
      rightNow.getMonth(),
      rightNow.getDate(),
    );

    let lists = this.lists;
    for (const [id, list] of lists) {
      let todos = list.todos;
      let todosToday = [];
      for (let todo of todos) {
        if (todo.completionDate) {
          let [year, month, day] = todo.completionDate.split("-");
          let completionDate = new Date(year, String(month - 1), day);
          if (completionDate.getTime() == today.getTime())
            todosToday.push(todo);
        }
      }
      if (todosToday.length > 0) {
        dueToday[list.title] = todosToday;
      }
    }
    return dueToday;
  }

  render() {
    this.listView?.render();

    this.homeView.setCurrentViewDisplayed(this.todayView);
    this.homeView.displayCurrentViewBttn(document.getElementById("today-bttn"));
    this.homeView.render();
  }

  updateViews() {
    const todayView = () => {
      let data = this.getTodosToday();
      this.todayView.todos = data;
      this.todayView.render();
    };

    const listView = () => {
      let currentList = this.listView.getCurrentList();
      if (currentList) {
        currentList = this.lists.get(currentList.id);
        this.listView.setCurrentList(currentList);
        this.listView.render(true);
      }
    };

    const homeView = () => {
      let lists = [...this.lists.values()];
      this.homeView.currentLists = lists;
      this.homeView.render();
      if (this.homeView.currentViewDisplayed == this.todayView)
        this.homeView.displayCurrentViewBttn(
          document.getElementById("today-bttn"),
        );
      else if (this.homeView.currentViewDisplayed == this.listView)
        this.homeView.selectListBttn(this.listView.currentList.id);
    };
    todayView();
    listView();
    homeView();
  }
}

new App();
