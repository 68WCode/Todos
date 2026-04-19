export default class Todo {
  constructor(
    parentList,
    title = "New Todo",
    notes = "",
    complete = false,
    completionDate = null,
    id = crypto.randomUUID(),
  ) {
    this.title = title;
    this.notes = notes;
    this.complete = complete;
    this.completionDate = completionDate;
    this.id = id;
    this.parentList = parentList;
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
      parentList: this.parentList,
      id: this.id,
      title: this.title,
      notes: this.notes,
      complete: this.complete,
      completionDate: this.completionDate,
    });
  }
}
