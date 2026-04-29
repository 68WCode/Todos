import "./reset.css";
import "./style.css";
import { List } from "./model/list/list.js";
import StorageManager from "./storage.js";
import ListView from "./views/listView/listView.js";
import HomeView from "./views/homeView/homeView.js";
import TodoView from "./views/todoView/todoView.js";
import Todo from "./model/todo/todo.js";
import { TodayView } from "./views/todayView/todayView.js";
import UpcomingView from "./views/upcomingView/upcomingView.js";
import TrashView from "./views/trashView/trashView.js";

class App {
  constructor() {
    // window.localStorage.clear();
    this.storage = new StorageManager();
    this.root = document.querySelector("body");
    this.lists = this.storage.getListMap();
    this.trash = this.storage.getTrash();
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

    const onDisplayTodayView = () => {
      this.homeView.setCurrentViewDisplayed(this.todayView);
      this.updateViews();
    };
    this.homeView.bindDisplayTodayView(onDisplayTodayView);

    const onDisplayUpcomingView = () => {
      this.homeView.setCurrentViewDisplayed(this.upcomingView);
      this.updateViews();
    };
    this.homeView.bindDisplayUpcomingView(onDisplayUpcomingView);

    const onDisplayTrashView = () => {
      this.homeView.setCurrentViewDisplayed(this.trashView);
      this.updateViews();
    };
    this.homeView.bindDisplayTrashView(onDisplayTrashView);

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

    this.upcomingView = new UpcomingView(this.getUpcomingTodos());
    this.upcomingView.bindRequestTodoView(onRequestTodoView);

    this.trashView = new TrashView(this.trash);
    this.trashView.bindOnRequestTodoView(onRequestTodoView);
    this.trashView.bindEmptyTrash(() => {
      this.storage.emptyTrash();
      this.updateViews();
    });
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
    this.homeView.setCurrentViewDisplayed(this.todayView);
    this.updateViews();
  }

  updateViews() {
    const todayView = () => {
      let data = this.getTodosToday();
      this.todayView.todos = data;
      if (this.homeView.currentViewDisplayed == this.todayView)
        this.todayView.render();
    };

    const listView = () => {
      let currentList = this.listView.getCurrentList();
      if (currentList) {
        currentList = this.lists.get(currentList.id);
        this.listView.setCurrentList(currentList);
        if (this.homeView.currentViewDisplayed == this.listView)
          this.listView.render(true);
      }
    };

    const homeView = () => {
      let lists = [...this.lists.values()];
      this.homeView.currentLists = lists;
      this.homeView.render();
      if (this.homeView.currentViewDisplayed == this.todayView) {
        this.homeView.displayCurrentViewBttn(
          document.getElementById("today-bttn"),
        );
        this.homeView.disableCreateTodoButton();
      } else if (this.homeView.currentViewDisplayed == this.listView) {
        this.homeView.selectListBttn(this.listView.currentList.id);
        this.homeView.enableCreateTodoButton();
      } else if (this.homeView.currentViewDisplayed == this.upcomingView) {
        this.homeView.displayCurrentViewBttn(
          document.getElementById("upcoming-bttn"),
        );
        this.homeView.disableCreateTodoButton();
      } else if (this.homeView.currentViewDisplayed == this.trashView) {
        this.homeView.displayCurrentViewBttn(
          document.getElementById("trash-bttn"),
        );
        this.homeView.disableCreateTodoButton();
      }
    };

    const upcomingView = () => {
      let upcomingTodos = this.getUpcomingTodos();
      this.upcomingView.setTodos(upcomingTodos);
      this.upcomingView.render();
    };

    const trashView = () => {
      let trash = this.storage.getTrash();
      this.trashView.trash = trash;
      this.trashView.render();
    };

    todayView();
    listView();
    upcomingView();
    homeView();
    trashView();
  }

  getUpcomingTodos() {
    const todos = [];
    for (let [listId, list] of this.lists) {
      for (let todo of list.todos) {
        if (todo.completionDate) todos.push(todo);
      }
    }
    return todos;
  }
}

new App();
