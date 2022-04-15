'use strict'

function runOnEnter(event, func) {
  if (event.key === 'Enter') {
    func(event);
  }
}

function updateItemsLeft() {
  const total = todoList.querySelectorAll('li').length;
  const done = todoList.querySelectorAll('.completed').length;

  itemsLeftCounter.textContent = total - done;
}

function addTodo() {
  const todoContent = todoInput.value;
  
  if (todoContent.length <= 0) {
    return;
  }

  const todoId = todoList.childElementCount + 1;
  const newTodo = `
    <li class="todo-item">
      <input type="checkbox" id="todo-${todoId}" class="toggle">
      <label for="todo-${todoId}">${todoContent}</label>
      <button class="destroy"></button>
    </li>
  `;

  todoList.insertAdjacentHTML('beforeend', newTodo);

  todoInput.value = '';
}

function removeTodo(event) {
  if (!event.target.classList.contains('destroy')) {
    return;
  }

  const todo = event.target.closest('.todo-item');

  todo.remove();
}

function markDoneAs(isDone, todoItem) {
  if (todoItem.matches('.completed') !== isDone) {
    todoItem.classList.toggle('completed');
  }

  todoItem.querySelector('input').checked = isDone;
}

function toggleTodo(event) {
  const todo = event.target.closest('.todo-item');
  const checkbox = todo.querySelector('.toggle');

  markDoneAs(checkbox.checked, todo);
}

function toggleAllTodos() {
  const isAllDone = totalToggler.checked;
  
  for (const todoItem of todoList.querySelectorAll('.todo-item')) {
    markDoneAs(isAllDone, todoItem);
  }
}

function updateTotalToggler() {
  const todos = todoList.querySelectorAll('.todo-item');
  const totalTogglerLabel = root.querySelector('.toggle-all-label');

  totalTogglerLabel.hidden = todos.length <= 0;

  totalToggler.checked = ![...todos]
    .every(todo => !todo.matches('.completed'));
}

function lookIfAnyCompleted() {
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
  todoList.querySelectorAll('.completed')
    .forEach(todo => todo.remove());
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

root.addEventListener('click', applyCurrentFilter);
root.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      applyCurrentFilter();
    }
  });

root.addEventListener('click', updateItemsLeft);
root.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    updateItemsLeft();
  }
});

root.addEventListener('click', updateTotalToggler);
root.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    updateTotalToggler();
  }
});

root.addEventListener('click', lookIfAnyCompleted);

root.addEventListener('click', updateFooter);
root.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    updateFooter();
  }
});

todoInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

todoList.addEventListener('click', toggleTodo);
todoList.addEventListener('click', removeTodo);

totalToggler.addEventListener('click', toggleAllTodos);

filtersList.addEventListener('click', markSelectedFilter);

buttonClearCompleted.addEventListener('click', clearCompletedTodos);
