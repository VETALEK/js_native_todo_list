'use strict'

function updateItemsLeft() {
  const total = todoList.querySelectorAll('li').length;
  const done = todoList.querySelectorAll('.completed').length;

  itemsLeftCounter.textContent = total - done;
}

function addTodo(event) {
  if (event.key === 'Enter') {
    const input = event.target;
    const todoContent = input.value;
    
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

    input.value = '';
  }
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

function lookIfAllChecked() {
  totalToggler.checked = [...todoList.querySelectorAll('.todo-item')]
    .filter(({ hidden }) => !hidden)
    .every(todo => todo.matches('.completed'));
}

function lookIfAnyCompleted() {
  buttonClearCompleted.hidden = todoList.querySelectorAll('.completed').length <= 0;
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
root.addEventListener('keypress', applyCurrentFilter);
root.addEventListener('click', updateItemsLeft);
root.addEventListener('keypress', updateItemsLeft);
root.addEventListener('click', lookIfAllChecked);
root.addEventListener('keypress', lookIfAllChecked);
root.addEventListener('click', lookIfAnyCompleted);

todoInput.addEventListener('keypress', addTodo);

todoList.addEventListener('click', toggleTodo);
todoList.addEventListener('click', removeTodo);

totalToggler.addEventListener('click', toggleAllTodos);

filtersList.addEventListener('click', markSelectedFilter);

buttonClearCompleted.addEventListener('click', clearCompletedTodos);
