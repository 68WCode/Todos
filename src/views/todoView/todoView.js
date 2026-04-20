import calendarIcon from "../../icons/calendar_month_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import "./todoView.css";

export default class TodoView {
  constructor(todo, editMode = false) {
    this.todo = todo;
    this.editMode = editMode;
    this.elements = {};
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
      this.elements.textContainer = textContainer;

      textContainer.classList.add("todo-text");

      const notes = document.createElement("textarea");
      this.elements.notes = notes;

      const title = document.createElement("h1");
      this.elements.title = title;
    }

    function optionElements() {
      // creates the elements for the todo options,
      // including a button for setting the due date
      // and a container for the options, and stores them in a map for easy access
      const optionsContainer = document.createElement("div");
      this.elements.optionsContainer = optionsContainer;
      optionsContainer.id = "todo-option-container";

      const tags = document.createElement("div");
      this.elements.tags = tags;
      tags.id = "todo-tags";

      const optionButtons = document.createElement("div");
      this.elements.optionButtons = optionButtons;
      optionButtons.id = "option-bttns";

      const todoTags = document.createElement("div");
      this.elements.todoTags = todoTags;
      todoTags.id = "todo-tags";

      const dateTag = document.createElement("p");
      this.elements.dateTag = dateTag;
      dateTag.classList.add("date-tag");

      const calendarButton = document.createElement("button");
      this.elements.calendarButton = calendarButton;
      calendarButton.id = "completion-date-bttn";

      const dateInput = document.createElement("input");
      this.elements.dateInput = dateInput;
      dateInput.type = "date";
      dateInput.classList.add("hidden");
    }

    const container = document.createElement("div");
    this.elements.container = container;
    container.classList.add("todo");

    textElements.call(this);
    optionElements.call(this);

    const check = document.createElement("input");
    check.type = "checkbox";
    this.elements.check = check;

    container.dataset.id = this.todo.id;
  }

  addEventListeners() {
    //  adds event listeners for the todo view elements, including the checkbox for marking the todo as complete and the title for editing the todo

    // event listener for the complete checkbox that calls the onToggleComplete callback with the updated todo when the checkbox is toggled
    this.elements.check.addEventListener("change", () => {
      this.onUpdateTodo({ complete: this.elements.check.checked });
    });

    // event listener for the title that makes it editable when double clicked and calls the onUpdateTodo callback with the updated todo when the user presses enter or clicks away from the title
    this.elements.title.addEventListener("dblclick", () => {
      if (!this.editMode) {
        this.toggleEditMode();
      }
    });

    // event listener for the title that calls the onUpdateTodo callback with the updated todo when the user presses enter or clicks away from the title
    this.elements.title.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.onUpdateTodo({
          title: this.elements.title.textContent,
        });
        this.toggleEditMode();
      }
    });

    // event listener for clicks outside the title and options that calls the onUpdateTodo callback with the updated todo and toggles edit mode off when the user clicks away from the title or options
    document.addEventListener("click", (e) => {
      if (this.editMode && !this.elements.container.contains(e.target)) {
        this.onUpdateTodo({
          title: title.textContent,
          notes: this.elements.notes.value,
          completionDate: this.elements.dateInput.value,
        });
        this.toggleEditMode();
      }
    });

    // event listener for the calendar button that appends the date input to the options container when clicked
    this.elements.calendarButton.addEventListener("click", () => {
      this.elements.optionsbuttons.appendChild(this.elements.dateInput);
      this.elements.dateInput.classList.remove("hidden");
    });

    this.elements.dateTag.addEventListener("click", () => {
      this.elements.dateInput.value = this.todo.completionDate;
      this.elements.optionsContainer.appendChild(dateInput);
      this.elements.dateInput.classList.remove("hidden");
      this.elements.dateTag.classList.add("hidden");
    });

    this.elements.dateInput.addEventListener("change", (e) => {
      let value = this.elements.dateInput.value;

      this.onUpdateTodo({ completionDate: value });
      this.elements.dateInput.classList.add("hidden");
      this.elements.calendarButton.classList.add("hidden");
      this.elemenets.dateTag.classList.remove("hidden");
      this.render();
    });
  }

  render() {
    this.elements.container.innerHTML = "";
    this.elements.container.append(
      this.elements.check,
      this.elements.textContainer,
    );

    this.elements.textContainer.append(
      this.elements.title,
      this.elements.notes,
      this.elements.optionContainer,
    );

    this.elements.title.textContent = this.todo.title;

    this.elements.notes.placeholder = "Notes";
    this.elements.notes.value = this.todo.notes;

    this.elements.check.checked = this.todo.complete;

    if (this.editMode) {
      this.makeEditable();
    } else {
      this.elements.notes.classList.add("hidden");
      this.elements.optionsContainer.classList.add("hidden");
    }

    if (this.todo.completionDate) {
      this.elements.dateTag.textContent = `Due: ${this.todo.completionDate}`;
      this.elements.dateTag.classList.remove("hidden");
      this.elements.calendarButton.classList.add("hidden");
      this.elements.dateInput.classList.add("hidden");
    } else {
      this.elements.dateTag.classList.add("hidden");
    }
  }

  getContent() {
    return this.elements.container;
  }

  makeEditable() {
    this.elements.container.classList.add("editable");
    this.elements.title.contentEditable = "true";
    this.elements.title.focus();
    this.elements.notes.classList.remove("hidden");
    this.elements.optionsContainer.classList.remove("hidden");
  }

  toggleEditMode() {
    this.editMode = this.editMode ? false : true;
    if (this.editMode) {
      this.makeEditable();
    } else {
      this.elements.container.classList.remove("editable");
      this.elements.title.contentEditable = false;
      this.elements.notes.classList.add("hidden");
      this.elements.optionsContainer.classList.add("hidden");
    }

    this.elements.textContainer.focus();
  }

  bindOnUpdateTodo(callback) {
    this.onUpdateTodo = callback;
  }
}
