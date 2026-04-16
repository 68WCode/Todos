export default class StorageManager {
  constructor() {
    let lists = localStorage.getItem("lists") || "[]";
    this.lists = JSON.parse(lists);
  }

  addList(list) {
    this.lists.push(list);
    localStorage.setItem("lists", JSON.stringify(this.lists));
    let lists = localStorage.getItem("lists");
    this.lists = JSON.parse(lists);
  }

  getLists() {
    return this.lists;
  }

  updateTitle(listId, newTitle) {
    let updatedLists = [];
    for (let list of this.lists) {
      list = JSON.parse(list);
      if (list.id == listId) {
        list.title = newTitle;
      }
      updatedLists.push(JSON.stringify(list));
    }
    this.lists = updatedLists;
    this.updateLists();
  }

  updateLists() {
    localStorage.setItem("lists", JSON.stringify(this.lists));
    let lists = localStorage.getItem("lists") || "[]";
    this.lists = JSON.parse(lists);
  }

  getList(listId) {
    for (let list of this.lists) {
      if (JSON.parse(list).id == listId) return list;
    }
  }
}
