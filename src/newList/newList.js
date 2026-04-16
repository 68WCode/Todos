import "./newList.css";

export function newListView() {
  const content = document.createElement("div");
  content.id = "new-list-content";

  const listTitle = document.createElement("input");
  listTitle.id = "list-title";
  listTitle.placeholder = "Title";

  const listDescription = document.createElement("textarea");
  listDescription.id = "list-description";
  listDescription.placeholder = "Description";

  const createButton = document.createElement("button");
  createButton.type = "button";
  createButton.id = "create-bttn";
  createButton.textContent = "Create";

  content.append(listTitle, listDescription, createButton);

  return content;
}
