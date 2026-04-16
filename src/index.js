import "./reset.css";
import "./style.css";
import { List } from "./model/list/list.js";
import StorageManager from "./storage.js";
import ListView from "./views/listView/listView.js";
import HomeView from "./views/homeView/homeView.js";

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

      this.listView?.render(list);
    };

    this.homeView?.bindOnNewList(handleNewList);
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
    this.listView?.render(todayList);

    this.homeView?.render(this.listView);
  }
}

new App();
