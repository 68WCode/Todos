import "./reset.css";
import "./style.css";
import { List } from "./model/list/list.js";
import StorageManager from "./storage.js";
import ListView from "./views/listView/listView.js";
import HomeView from "./views/homeView/homeView.js";
import Todo from "./model/todo/todo.js";

class App {
  constructor() {
    this.storage = new StorageManager();
    this.root = document.querySelector("body");

    this.updateLists();
    this.setupViews();
    this.bindEventListeners();
    this.render();
  }

  bindEventListeners() {
    const handleNewList = () => {
      let list = new List();
      this.storage.addList(list);
      this.updateLists();
      this.homeView?.renderLists(this.lists);
      this.homeView.selectListBttn(list.id);
      this.listView?.setCurrentList(list);
      this.listView?.render();
    };
    this.homeView?.bindOnNewList(handleNewList);

    const onSetTitle = (listId, newTitle) => {
      this.storage.updateTitle(listId, newTitle);
      this.updateLists();
      this.homeView.updateListBttn(listId, newTitle);
    };
    this.listView.bindOnSetTitle(onSetTitle);

    const onListBttnSelected = (listId) => {
      for (let list of this.lists) {
        if (listId == list.id) {
          this.listView.setCurrentList(list);
          this.listView.render();
        }
      }
    };
    this.homeView?.bindOnListBttnSelected(onListBttnSelected);

    const onCreateTodo = () => {
      const todo = new Todo();
      const currentList = this.listView.getCurrentList();
      this.storage.addTodo(currentList.id, todo);
      currentList.addTodo(todo);
      this.updateLists();
      this.listView.render();
    };
    this.homeView?.bindOnCreateTodo(onCreateTodo);
  }

  updateLists() {
    let parseLists = () => {
      this.lists = this.lists.map((list) => List.fromJSON(list));
    };

    this.lists = this.storage.getLists();
    parseLists();
  }

  setupViews() {
    this.homeView = new HomeView(this.root);
    this.homeView.renderLists(this.lists);
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
