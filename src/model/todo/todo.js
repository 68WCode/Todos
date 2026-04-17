export default class Todo {
  constructor(title = "New Todo", notes = "", id = crypto.randomUUID()) {
    this.title = title;
    this.notes = notes;
    this.id = id;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  getNotes() {
    return this.notes;
  }

  setNotes(notes) {
    this.notes = notes;
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      notes: this.notes,
    });
  }
}
