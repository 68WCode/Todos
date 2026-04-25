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
      const notes = document.createElement("textarea");
      this.elements.notes = notes;
      notes.classList.add("todo-notes");

      const title = document.createElement("h1");
      this.elements.title = title;
    }

    function optionElements() {
      // creates the elements for the todo options,
      // including a button for setting the due date
      // and a container for the options, and stores them in a map for easy access
      const optionsContainer = document.createElement("div");
      this.elements.optionsContainer = optionsContainer;
      optionsContainer.classList.add("todo-option-container");

      const tags = document.createElement("div");
      this.elements.tags = tags;
      tags.classList.add("todo-tags");

      const optionButtons = document.createElement("div");
      this.elements.optionButtons = optionButtons;
      optionButtons.classList.add("option-bttns");

      const dateTag = document.createElement("p");
      this.elements.dateTag = dateTag;
      dateTag.classList.add("date-tag");
      const iconWrapper = document.createElement("span");
      iconWrapper.innerHTML = calendarIcon;
      const textWrapper = document.createElement("span");
      this.elements.dateText = textWrapper;
      const removeDate = document.createElement("button");
      removeDate.textContent = "X";
      removeDate.classList.add("remove-date-tag");
      this.elements.removeDate = removeDate;
      dateTag.append(iconWrapper, textWrapper, removeDate);

      const calendarButton = document.createElement("button");
      this.elements.calendarButton = calendarButton;
      calendarButton.classList.add("completion-date-bttn");

      const dateInput = document.createElement("input");
      this.elements.dateInput = dateInput;
      dateInput.type = "date";
      dateInput.classList.add("hidden");
      dateInput.value = this.todo.completionDate;
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

    // helper function that runs the onUpdateTodo callback with the updated todo when the user presses enter or clicks away from the title
    const runTodoUpdate = () => {
      const updates = {};
      if (this.elements.title.textContent !== this.todo.title) {
        updates.title = this.elements.title.textContent;
      }
      if (this.elements.notes.value !== this.todo.notes) {
        updates.notes = this.elements.notes.value;
      }
      if (this.elements.dateInput.value !== this.todo.completionDate) {
        updates.completionDate = this.elements.dateInput.value;
      }
      this.onUpdateTodo(updates);
    };

    // event listener for the complete checkbox that calls the onToggleComplete callback with the updated todo when the checkbox is toggled
    this.elements.check.addEventListener("change", () => {
      this.onUpdateTodo({ complete: this.elements.check.checked });
    });

    // event listener for the title that makes it editable when double clicked and calls the onUpdateTodo callback with the updated todo when the user presses enter or clicks away from the title
    this.elements.title.addEventListener("dblclick", () => {
      if (!this.editMode) {
        this.toggleEditMode();
      }
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
    });

    // event listener for the title that calls the onUpdateTodo callback with the updated todo when the user presses enter or clicks away from the title
    this.elements.title.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        runTodoUpdate();
        this.toggleEditMode();
      }
    });

    // event listener for clicks outside the title and options that calls the onUpdateTodo callback with the updated todo and toggles edit mode off when the user clicks away from the title or options
    document.addEventListener("click", (e) => {
      if (this.editMode && !this.elements.container.contains(e.target)) {
        runTodoUpdate();
        this.toggleEditMode();
      }
    });

    // event listener for the calendar button that appends the date input to the options container when clicked
    this.elements.calendarButton.addEventListener("click", () => {
      this.elements.dateInput.classList.remove("hidden");
    });

    this.elements.dateTag.addEventListener("click", (e) => {
      if (e.target == this.elements.removeDate) {
        this.onUpdateTodo({ completionDate: null });
      } else {
        this.elements.dateInput.value = this.todo.completionDate;
        this.elements.optionsContainer.appendChild(this.elements.dateInput);
        this.elements.dateInput.classList.remove("hidden");
        this.elements.dateTag.classList.add("hidden");
      }
    });

    this.elements.removeDate.addEventListener("hover", (e) => {
      this.elements.removeDate.style.color = "black";
    });

    this.elements.dateInput.addEventListener("blur", (e) => {
      runTodoUpdate();
    });
  }

  render() {
    this.elements.container.innerHTML = "";
    this.elements.container.append(
      this.elements.check,
      this.elements.title,
      this.elements.notes,
      this.elements.optionsContainer,
    );

    this.elements.optionsContainer.append(
      this.elements.tags,
      this.elements.optionButtons,
    );

    this.elements.tags.appendChild(this.elements.dateTag);
    this.elements.optionButtons.append(
      this.elements.calendarButton,
      this.elements.dateInput,
    );

    this.elements.title.textContent = this.todo.title;
    this.elements.notes.placeholder = "Notes";
    this.elements.notes.value = this.todo.notes;
    this.elements.check.checked = this.todo.complete;

    this.elements.calendarButton.innerHTML = calendarIcon;

    if (this.editMode) {
      this.makeEditable();
    } else {
      this.elements.notes.classList.add("hidden");
      this.elements.optionsContainer.classList.add("hidden");
    }

    if (this.todo.completionDate) {
      this.displayDateTag();
    } else {
      this.elements.dateInput.classList.add("hidden");
      this.elements.dateInput.value = null;
      this.elements.dateTag.classList.add("hidden");
      this.elements.calendarButton.classList.remove("hidden");
    }
  }

  displayDateTag() {
    const hideDateOptions = () => {
      this.elements.dateInput.classList.add("hidden");
      this.elements.calendarButton.classList.add("hidden");
    };
    this.elements.dateTag.classList.remove("hidden");
    this.elements.dateText.textContent = this.todo.completionDate;
    hideDateOptions();
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
    this.elements.optionButtons.classList.remove("hidden");
    this.elements.tags.classList.remove("hidden");
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
  }

  bindOnUpdateTodo(callback) {
    this.onUpdateTodo = callback;
  }
}
