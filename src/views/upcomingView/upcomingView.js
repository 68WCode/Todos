import "./upcomingView.css";
export default class UpcomingView {
  constructor(lists) {
    this.lists = lists;
    this.elements = {};
    this.elements.todoViews = {};
    this.elements.todoContainers = {};
    this.todos = [];
    this.setupViewElements();
  }

  setupViewElements() {
    const week = () => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let date = new Date();
      let [year, month, day] = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ];
      for (let i = 1; i < 8; i++) {
        let upcomingDate = new Date(year, month, day + i);

        let dateLabel = document.createElement("p");
        dateLabel.textContent =
          i == 1 ? "Tomorrow" : days[upcomingDate.getDay()];

        let upcomingDayContainer = document.createElement("div");
        upcomingDayContainer.classList.add("date-container");

        let dateLabelContainer = document.createElement("div");
        dateLabelContainer.classList.add("date-label");

        let date = document.createElement("h1");
        date.textContent = upcomingDate.getDate();
        dateLabelContainer.append(date, dateLabel);

        let todos = document.createElement("div");
        todos.classList.add("todo-container");
        todos.dataset.date = `${upcomingDate.getMonth() + 1}-${upcomingDate.getDate()}-${upcomingDate.getFullYear()}`;
        this.elements.todoContainers[todos.dataset.date] = todos;

        upcomingDayContainer.append(dateLabelContainer, todos);

        this.elements.content.appendChild(upcomingDayContainer);
      }
    };

    this.elements.content = document.createElement("div");
    this.elements.content.id = "upcoming-container";
    this.elements.viewTitle = document.createElement("h1");
    this.elements.viewTitle.textContent = "Upcoming";

    this.elements.content.appendChild(this.elements.viewTitle);
    week();
  }

  setTodos(todos) {
    this.todos = todos;
  }

  getTodoViews() {
    for (let todo of this.todos) {
      let todoDate = todo.completionDate;
      let [year, month, day] = todoDate.split("-");
      let upcomingDate = new Date(year, String(month - 1), day);
      let dateString = `${upcomingDate.getMonth() + 1}-${upcomingDate.getDate()}-${upcomingDate.getFullYear()}`;
      let todoView = this.requestTodoView(todo);
      let storage = this.elements.todoViews[dateString];
      if (storage) {
        storage.push(todoView);
      } else {
        this.elements.todoViews[dateString] = [todoView];
      }
    }
  }

  render() {
    this.elements.todoViews = {};
    this.getTodoViews();
    for (let container of Object.values(this.elements.todoContainers)) {
      container.innerHTML = "";
    }
    for (let [date, todos] of Object.entries(this.elements.todoViews)) {
      let todoContainer = this.elements.todoContainers[`${date}`];
      if (todoContainer) {
        for (let todoView of todos)
          todoContainer.appendChild(todoView.getContent());
      }
    }
  }

  bindRequestTodoView(callback) {
    this.requestTodoView = callback;
  }

  getContent() {
    return this.elements.content;
  }
}
