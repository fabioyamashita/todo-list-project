const form = document.querySelector('form[name="add-to-do"]');
const toDoTextEl = document.getElementById("to-do-text");
const toDoListEl = document.querySelector(".to-do-list");
const emptyListTextEl = document.querySelector(".empty-list-text");
const taskContainerEl = document.querySelector(".tasks-container");

let totalItems = 0;
let pendingItems = 0;

/////////////////////////////////////
// ADD NEW TO-DO ITEM
/////////////////////////////////////
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const toDoText = getTextFromFormInput(form);

  createItemListComponent(toDoText);
  toDoTextEl.value = "";

  toggleEmptyListText();

  addBtnDeleteEventListener();
  addBtnCheckEventListener();

  modifyUpClearAllSection();
});

/////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////
function getTextFromFormInput(formInput) {
  const fromDataEntries = new FormData(formInput).entries();
  return Array.from(fromDataEntries)[0][1];
}

function getLastElementFromNodeList(selector) {
  const elements = document.querySelectorAll(selector);
  return (lastElement = elements[elements.length - 1]);
}

function removeAllToDoItems() {
  const toDoItemEl = document.querySelectorAll(".to-do-item");
  toDoItemEl.forEach((el) => el.remove());
}

// COMPONENTS
function createItemListComponent(toDoText) {
  const HTMLContent = `
    <li class="to-do-item">
      <div class="to-do-item-box">
        <button class="btn btn-to-do btn-check">
          <i class="list-icon list-icon-check fa-solid fa-check hidden"></i>
        </button>

        <div class="to-do-text" contenteditable="true">${toDoText}</div>

        <button class="btn btn-to-do btn-delete">
          <i
            class="list-icon list-icon-delete fa-regular fa-trash-can"
          ></i>
        </button>
      </div>
    </li>`;

  toDoListEl.insertAdjacentHTML("beforeend", HTMLContent);
  preventLineBreakContentEditable();
}

function createClearAllSectionComponent() {
  const HTMLContent = `
    <div class="clear-all">
      <p class="clear-all-text">You have 1 pending task</p>
      <button class="clear-all-btn">CLEAR ALL</button>
    </div>`;

  taskContainerEl.insertAdjacentHTML("beforeend", HTMLContent);

  addBtnClearAllEventListener();
}

// EMPTY LIST TEXT
function toggleEmptyListText() {
  const toDoItemEl = document.querySelectorAll(".to-do-item");

  if (toDoItemEl.length > 0) {
    emptyListTextEl.classList.add("hidden");
  } else {
    emptyListTextEl.classList.remove("hidden");
  }
}

// BUTTONS EVENT LISTENERS
function addBtnDeleteEventListener() {
  const lastBtnDeleteEl = getLastElementFromNodeList(".btn-delete");

  lastBtnDeleteEl.addEventListener("click", (e) => {
    if (
      !e.target
        .closest(".btn-delete")
        .previousElementSibling.classList.contains("done")
    ) {
      pendingItems--;
    }

    e.target.closest(".to-do-item").remove();

    toggleEmptyListText();
    modifyDownClearAllSection();
  });
}

function addBtnCheckEventListener() {
  const lastBtnCheckEl = getLastElementFromNodeList(".btn-check");
  const lastCheckIconEl = getLastElementFromNodeList(".list-icon-check");
  const lastToDoTextEl = getLastElementFromNodeList(".to-do-text");

  lastBtnCheckEl.addEventListener("click", (e) => {
    lastCheckIconEl.classList.toggle("hidden");
    lastToDoTextEl.classList.toggle("done");

    if (lastToDoTextEl.classList.contains("done")) {
      pendingItems--;
    } else {
      pendingItems++;
    }

    updateClearAllSection(pendingItems);
  });
}

function addBtnClearAllEventListener() {
  const clearAllBtnEl = document.querySelector(".clear-all-btn");

  clearAllBtnEl.addEventListener("click", () => {
    removeAllToDoItems();
    removeClearAllSection();
    toggleEmptyListText();
  });
}

// PREVENT LINE/PARAGRAPH BREAKS IN contentEditable
function preventLineBreakContentEditable() {
  const contentEditableEl = getLastElementFromNodeList(".to-do-text");
  contentEditableEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  });
}

// CLEAR ALL SECTION (COUNT ITEMS IN TO-DO LIST)
function updateClearAllSection(count) {
  const clearAllTextEl = document.querySelector(".clear-all-text");

  switch (count) {
    case 0:
      clearAllTextEl.innerHTML = `You've completed all tasks!`;
      break;
    case 1:
      clearAllTextEl.innerHTML = `You have ${count} pending task`;
      break;
    default:
      clearAllTextEl.innerHTML = `You have ${count} pending tasks`;
      break;
  }
}

function removeClearAllSection() {
  const clearAllEl = document.querySelector(".clear-all");
  clearAllEl.remove();
  totalItems = 0;
  pendingItems = 0;
}

function modifyUpClearAllSection() {
  const toDoItemEl = document.querySelectorAll(".to-do-item");

  if (toDoItemEl.length > 0) {
    if (toDoItemEl.length === 1 && totalItems === 0) {
      createClearAllSectionComponent();
      totalItems++;
      pendingItems++;
    } else {
      totalItems++;
      pendingItems++;
      updateClearAllSection(pendingItems);
    }
  }
}

function modifyDownClearAllSection() {
  totalItems--;
  if (totalItems === 0) {
    removeClearAllSection();
  } else {
    updateClearAllSection(pendingItems);
  }
}
