import "./listView.css";
let workingList;
const content = document.createElement("div");

const titleSection = document.createElement("div");
const title = document.createElement("h1");
const listProgress = document.createElement("input");
listProgress.id = "list-progress";
listProgress.type = "checkbox";
title.id = "title";

const todosSection = document.createElement("div");
todosSection.id = "todos-section";

export function listView(list, { onSaveTitle }) {
  workingList = list;
  content.id = "list-view";
  titleSection.id = "title-section";

  title.textContent = list.title;
  title.addEventListener("click", () => {
    title.contentEditable = "true";
    title.focus();
  });

  title.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      let newTitle = title.textContent;
      workingList.title = newTitle;
      onSaveTitle(workingList.id, workingList.title);
      title.blur();
    }
  });

  titleSection.append(listProgress, title);
  content.append(titleSection, todosSection);

  return content;
}
