export class List {
  constructor(title = "New List", description = "", id = crypto.randomUUID()) {
    this.title = title;
    this.description = description;
    this.id = id;
  }

  setTitle(title) {
    this.title = title;
  }

  getTitle() {
    return this.title;
  }

  setDescription(desc) {
    this.description = desc;
  }

  getDescription() {
    return this.description;
  }

  getId() {
    return this.id;
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      description: this.description,
    });
  }

  static fromJSON(json) {
    let list = JSON.parse(json);
    return new List(list.title, list.description, list.id);
  }
}
