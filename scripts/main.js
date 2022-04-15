'use strict'

const todoObjects = [
  {
    id: 1,
    name: 'Create todo list',
    isCompleted: true,
  },
  {
    id: 2,
    name: 'Start adding tasks',
    isCompleted: false,
  },
];

todoObjects.getIndexById = function getIndexById(id) {
  return this.indexOf(this
    .find(({ id: currentId }) => currentId === +id));
};

function renderTodoApp() {
  const activeTodos = todoObjects
    .filter(({ isCompleted }) => !isCompleted).length;

  const header = `
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autofocus=""
        onkeydown="tryAddTodo(event)"
      >
    </header>
  `;
  const main = `
    <section class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        ${activeTodos <= 0 ? 'checked' : ''}
        onchange="setAllCompletedTo(event.target.checked)"
      >
      <label
        for="toggle-all"
        class="toggle-all-label"
      >
        Mark all as complete
      </label>

      <ul class="todo-list">

      ${
        todoObjects.map(obj => {
          if (filter === 'completed' && obj.isCompleted
            || filter === 'active' && !obj.isCompleted
            || filter === 'all') {
            return `
              <li
                class="todo-item ${obj.isCompleted ? 'completed' : ''}"
                data-id="${obj.id}"
              >
                <input
                  type="checkbox"
                  id="todo-${obj.id}"
                  class="toggle"
                  ${obj.isCompleted ? 'checked' : ''}
                  onclick="toggleTodo(${obj.id})"
                >
                <label
                  for="todo-${obj.id}"
                  onclick="toggleTodo(${obj.id})"
                >
                  ${obj.name}
                </label>
                <button
                  class="destroy"
                  onclick="removeTodo(${obj.id})"
                ></button>
              </li>
            `;
          }
        }).join('')
      }

      </ul>
    </section>
  `;
  const footer = `
    <footer class="footer">
      <span class="todo-count">
        ${activeTodos} items left
      </span>

      <ul
        class="filters"
        onClick="applyFilter(event.target.dataset.filter)"
      >
        <li>
          <a
            href="#/"
            data-filter="all"
            ${filter === 'all'? 'class="selected"' : ''}"
          >All</a>
        </li>
        <li>
          <a
            href="#/active"
            data-filter="active"
            ${filter === 'active'? 'class="selected"' : ''}"
          >Active</a>
        </li>
        <li>
          <a
            href="#/completed"
            data-filter="completed"
            ${filter === 'completed'? 'class="selected"' : ''}"
          >Completed</a>
        </li>
      </ul>

      ${
        todoObjects.length !== activeTodos 
          ? `
            <button
              class="clear-completed"
              onClick="clearCompletedTodos()"
            >
              Clear completed
            </button>
          `
          : ''
      }
    </footer>
  `;

  root.innerHTML = `
    ${header}

    ${
      todoObjects.length <= 0
        ? ''
        : `
          ${main}
          ${footer}
          `
    }
  `;
}

function tryAddTodo(event) {
  if (event.key !== 'Enter') {
    return;
  }

  const inputText = event.target.value.trim();
  
  if (inputText.length <= 0) {
    return;
  }

  todoObjects.push({
    id: Number(new Date()) % 100_000,
    name: inputText,
    isCompleted: false,
  });

  renderTodoApp();
}

function removeTodo(todoId) {
  const todoIndex = todoObjects.getIndexById(todoId);

  todoObjects.splice(todoIndex, 1);

  renderTodoApp();
}

function toggleTodo(todoId) {
  const todoIndex = todoObjects.getIndexById(todoId);
  const todoObj = todoObjects[todoIndex];

  todoObj.isCompleted = !todoObj.isCompleted;

  renderTodoApp();
}

function setAllCompletedTo(value) {
  todoObjects.forEach(obj => obj.isCompleted = value);

  renderTodoApp();
}

function clearCompletedTodos() {
  for (let i = 0; i < todoObjects.length; i++) {
    if (todoObjects[i].isCompleted) {
      todoObjects.splice(i, 1);
      i--;
    }
  }

  renderTodoApp();
}

function applyFilter(newFilter) {
  filter = newFilter;

  renderTodoApp();
}

const root = document.querySelector('.todoapp');

let filter = 'all';

renderTodoApp();