import "./todoView.css";

export default class TodoView {
  constructor(todo, editMode = false) {
    this.todo = todo;
    this.editMode = editMode;
    this.viewElements = new Map();
    this.setupElements();
    this.addEventListeners();
    this.render();
  }

  setupElements() {
    function textElements() {
      // creates the elements for the todo view,
      // including title,
      // notes,
      // and a container for the text elements, and stores them in a map for easy access
      const textContainer = document.createElement("div");
      textContainer.classList.add("todo-text");
      this.viewElements.set("text-container", textContainer);

      const notes = document.createElement("textarea");
      this.viewElements.set("notes", notes);

      const title = document.createElement("h1");
      this.viewElements.set("title", title);

      if (!this.editMode) {
        notes.classList.add("hidden");
      }
    }

    function optionElements() {
      // creates the elements for the todo options,
      // including a button for setting the due date
      // and a container for the options, and stores them in a map for easy access
      const optionContainer = document.createElement("div");
      optionContainer.classList.add("option-container");

      const dateTag = document.createElement("p");
      dateTag.classList.add("date-tag");
      this.viewElements.set("dateTag", dateTag);

      const calendarBttn = document.createElement("button");
      calendarBttn.textContent = "Set Due Date";

      const dateInput = document.createElement("input");
      dateInput.type = "date";
      this.viewElements.set("dateInput", dateInput);

      optionContainer.append(dateTag, calendarBttn);

      this.viewElements.set("option-container", optionContainer);
      this.viewElements.set("calendarBttn", calendarBttn);
    }

    const container = document.createElement("div");
    container.classList.add("todo");
    this.viewElements.set("container", container);

    textElements.call(this);
    optionElements.call(this);

    const check = document.createElement("input");
    check.type = "checkbox";
    this.viewElements.set("check", check);

    container.dataset.id = this.todo.id;
  }

  addEventListeners() {
    //  adds event listeners for the todo view elements, including the checkbox for marking the todo as complete and the title for editing the todo
    let completeCheck = this.viewElements.get("check");

    let textContainer = this.viewElements.get("text-container");
    let title = this.viewElements.get("title");
    let notes = this.viewElements.get("notes");

    let options = this.viewElements.get("option-container");
    let calendarBttn = this.viewElements.get("calendarBttn");
    let dateInput = this.viewElements.get("dateInput");
    let dateTag = this.viewElements.get("dateTag");

    // event listener for the complete checkbox that calls the onToggleComplete callback with the updated todo when the checkbox is toggled
    completeCheck.addEventListener("change", () => {
      this.todo.complete = completeCheck.checked;
      this.onToggleComplete(this.todo);
    });

    // event listener for the title that makes it editable when double clicked and calls the onUpdateTodo callback with the updated todo when the user presses enter or clicks away from the title
    title.addEventListener("dblclick", () => {
      if (!this.editMode) {
        this.toggleEditMode();
      }
    });

    // event listener for the title that calls the onUpdateTodo callback with the updated todo when the user presses enter or clicks away from the title
    title.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.onUpdateTodo(
          this.todo,
          title.textContent,
          notes.value,
          dateInput.value || null,
        );
        this.toggleEditMode();
      }
    });

    // event listener for clicks outside the title and options that calls the onUpdateTodo callback with the updated todo and toggles edit mode off when the user clicks away from the title or options
    document.addEventListener("click", (e) => {
      if (
        this.editMode &&
        (!textContainer.contains(e.target) || !options.contains(e.target))
      ) {
        this.onUpdateTodo(
          this.todo,
          title.textContent,
          notes.value,
          dateInput.value,
        );
        this.toggleEditMode();
      }
    });

    // event listener for the calendar button that appends the date input to the options container when clicked
    calendarBttn.addEventListener("click", () => {
      let dateInput = this.viewElements.get("dateInput");
      options.appendChild(dateInput);
      dateInput.classList.remove("hidden");
    });

    dateTag.addEventListener("click", () => {
      dateInput.value = this.todo.duedate;
      options.appendChild(dateInput);
      dateInput.classList.remove("hidden");
      dateTag.classList.add("hidden");
    });
  }

  render() {
    let container = this.viewElements.get("container");

    let textContainer = this.viewElements.get("text-container");
    let title = this.viewElements.get("title");
    title.textContent = this.todo.title;

    let notes = this.viewElements.get("notes");
    notes.placeholder = "Notes";
    notes.value = this.todo.notes;

    let optionContainer = this.viewElements.get("option-container");
    let dateInput = this.viewElements.get("dateInput");
    let dateTag = this.viewElements.get("dateTag");

    textContainer.append(title, notes, optionContainer);

    let check = this.viewElements.get("check");
    check.checked = this.todo.complete;

    if (this.editMode) {
      this.makeEditable();
    } else {
      notes.classList.add("hidden");
      this.viewElements.get("option-container").classList.add("hidden");
    }

    if (this.todo.duedate) {
      dateTag.textContent = `Due: ${this.todo.duedate}`;
      dateTag.classList.remove("hidden");
      let dateBttn = this.viewElements.get("calendarBttn");
      dateBttn.classList.add("hidden");
      dateInput.classList.add("hidden");
    } else {
      this.viewElements
        .get("option-container")
        .querySelector(".date-tag")
        .classList.add("hidden");
    }

    container.append(check, textContainer);
  }

  getContent() {
    return this.viewElements.get("container");
  }

  makeEditable() {
    let title = this.viewElements.get("title");
    let notes = this.viewElements.get("notes");
    let options = this.viewElements.get("option-container");

    title.contentEditable = "true";
    title.focus();
    notes.classList.remove("hidden");
    options.classList.remove("hidden");
  }

  toggleEditMode() {
    let title = this.viewElements.get("title");
    let notes = this.viewElements.get("notes");
    let textContainer = this.viewElements.get("text-container");

    this.editMode = this.editMode ? false : true;
    if (this.editMode) {
      this.makeEditable();
    } else {
      title.contentEditable = false;
      notes.classList.add("hidden");
      this.viewElements.get("option-container").classList.add("hidden");
    }

    textContainer.focus();
  }

  bindOnUpdateTodo(callback) {
    this.onUpdateTodo = callback;
  }

  bindOnCompleteToggle(callback) {
    this.onToggleComplete = callback;
  }
}
