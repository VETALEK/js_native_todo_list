'use strict'

function renderTodoList() {
  todoList.innerHTML = todoObjects.map(obj => `
    <li
      class="todo-item ${obj.isCompleted ? 'completed' : ''}"
      data-id="${obj.id}"
    >
      <input
        type="checkbox"
        id="todo-${obj.id}"
        class="toggle"
        ${obj.isCompleted ? 'checked' : ''}
      >
      <label for="todo-${obj.id}">${obj.name}</label>
      <button class="destroy"></button>
    </li>
  `).join('');

  updateTotalToggler();
  updateClearCompleted();
  updateItemsLeft();
  updateFooter();
}

function updateItemsLeft() {
  const total = todoList.querySelectorAll('li').length;
  const done = todoList.querySelectorAll('.completed').length;

  itemsLeftCounter.textContent = total - done;
}

function addInputedTodo() {
  const inputText = todoInput.value.trim();
  
  if (inputText.length <= 0) {
    return;
  }

  todoObjects.push({
    id: Number(new Date()) % 100_000,
    name: inputText,
    isCompleted: false,
  });

  todoInput.value = '';

  renderTodoList();
}

function removeTodo(event) {
  if (!event.target.classList.contains('destroy')) {
    return;
  }

  const todo = event.target.closest('.todo-item');
  const todoIndex = todoObjects.getIndexById(todo.dataset.id);

  todoObjects.splice(todoIndex, 1);

  renderTodoList();
}

function toggleTodo(event) {
  const todoEl = event.target.closest('.todo-item');
  const todoIndex = todoObjects.getIndexById(todoEl.dataset.id);
  const todoObj = todoObjects[todoIndex];

  todoObj.isCompleted = !todoObj.isCompleted;

  renderTodoList();
}

function toggleAllTodos() {
  const isAllCompleted = totalToggler.checked;
  
  todoObjects.forEach(obj => obj.isCompleted = isAllCompleted);

  renderTodoList();
}

function updateTotalToggler() {
  const todos = todoList.querySelectorAll('.todo-item');
  const totalTogglerLabel = root.querySelector('.toggle-all-label');

  totalTogglerLabel.hidden = todos.length <= 0;

  totalToggler.checked = [...todos]
    .every(todo => todo.matches('.completed'));
}

function updateClearCompleted() {
  buttonClearCompleted.hidden = todoList.querySelectorAll('.completed').length <= 0;
}

function updateFooter() {
  root.querySelector('.footer').hidden = todoList
    .querySelectorAll('.todo-item').length <= 0;
}

function showAllTodos() {
  todoList.querySelectorAll('.todo-item')
    .forEach(todo => {
        todo.hidden = false;
    });
}

function showActiveTodos() {
  todoList.querySelectorAll('.todo-item')
    .forEach(todo => {
      todo.hidden = todo.matches('.completed');
    });
}

function showCompletedTodos() {
  todoList.querySelectorAll('.todo-item')
    .forEach(todo => {
      todo.hidden = !todo.matches('.completed');
    });
}

function clearCompletedTodos() {
  for (let i = 0; i < todoObjects.length; i++) {
    const currentObj = todoObjects[i];
    
    if (currentObj.isCompleted) {
      todoObjects.splice(i, 1);
      i--;
    }
  }

  renderTodoList();
}

function markSelectedFilter(event) {
  filtersList.querySelectorAll('.show-filter')
    .forEach(filter => filter.classList.remove('selected'));
  
  event.target.classList.add('selected');
}

function applyCurrentFilter() {
  const filterMode = filtersList.querySelector('.selected');

  switch (filterMode.dataset.filter) {
    case 'all': {
      showAllTodos();
      break;
    }

    case 'active': {
      showActiveTodos();
      break;
    }

    case 'completed': {
      showCompletedTodos();
      break;
    }

    default: {
      return;
    }
  }
}

const root = document.querySelector('.todoapp');
const todoInput = root.querySelector('.new-todo');
const todoList = root.querySelector('.todo-list');
const itemsLeftCounter = root.querySelector('.todo-count')
  .querySelector('strong');
const totalToggler = root.querySelector('.toggle-all');
const filtersList = root.querySelector('.filters');
const buttonClearCompleted = root.querySelector('.clear-completed');

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

renderTodoList();

root.addEventListener('click', applyCurrentFilter);
root.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      applyCurrentFilter();
    }
  });

todoInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addInputedTodo();
  }
});

todoList.addEventListener('click', toggleTodo);
todoList.addEventListener('click', removeTodo);

totalToggler.addEventListener('click', toggleAllTodos);

filtersList.addEventListener('click', markSelectedFilter);

buttonClearCompleted.addEventListener('click', clearCompletedTodos);
