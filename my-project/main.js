import './style.css';

const modalBox = document.getElementById('modal-box');
const tbody = document.getElementById('tbody');
const form = document.getElementById('form');
const nav = document.getElementById('nav');
const aside = document.getElementById('aside');

let database = [];
let active;
let isEdit = false;
const Base_Url = 'http://localhost/3000'


nav.addEventListener('click', (e) => navBtn(e));
function navBtn(e) {
  let target = e.target;
  if (target.dataset.id === 'filter') {
    openModal(aside);
  } else if (target.dataset.id === 'add') {
    openModal(modalBox);
  }
}
function closeModal(item) {
  item.classList.add('invisible');
}
function openModal(item) {
  item.classList.remove('invisible');
}

function addToData(e) {
  const target = e.target;
  const [task, priority, status, deadline, desc] = Array.from(target.elements);
  if (isEdit === false) {
    const obj = {
      id: Date.now(),
      taskInput: task.value,
      priorityInput: priority.value,
      statusInput: status.value,
      deadlineInput: deadline.value,
      desc: desc.value,
    };
    database.push(obj);
  } else if (isEdit === true) {
    database.forEach((item) => {
      if (item.id === active) {
        item.taskInput = task.value;
        item.priorityInput = priority.value;
        item.statusInput = status.value;
        item.deadlineInput = deadline.value;
        item.desc = desc.value;
      }
    });
    isEdit = false;
    renderData(database);
    active = '';
  }
}

function renderData(item) {
  tbody.innerHTML = '';

  item.map((element) => {
    tbody.insertAdjacentHTML(
      'beforeend',
      `<tr id=${element.id} class="text-center border">
              <td class="border-l-2 border-b-2 py-4">${element.taskInput}</td>
              <td class="border-l-2 border-b-2">
              <span
              class="
              ${handlePriority(element.priorityInput)}
            rounded-xl px-2 py-1 items-center"
              >
              ${element.priorityInput}
        </span>
      </td>
      <td class="border-l-2 border-b-2">
      <span
      class=" 
      ${handleStatus(element.statusInput)}
       text-white w-max rounded-xl px-2 py-1 items-center"
      >
      ${element.statusInput}
      </span>
      </td>
      <td class="border-l-2 border-b-2 ">${element.deadlineInput}</td>
      <td class="border  ">

      <button class="bg-red-600 px-1 rounded" 
      data-name='delete'
       data-id="${element.id}">
      <ion-icon
      class="text-white text-center"
      data-id='${element.id}'
      data-name='delete'
      name="trash"
      ></ion-icon>
      </button>
        <button class="bg-blue-600 px-1 rounded" 
        data-name="edit" 
        data-id="${element.id}">
        <ion-icon
        class="text-white text-center"
        data-id="${element.id}"
        data-name="edit"
        name="pencil"
        ></ion-icon>
        </button>
        <button class="bg-gray-500 px-1 rounded" data-name="eye">
        <ion-icon
        data-id="${element.id}"
        data-name="eye"
        class="text-white text-center"
        name="eye"
        ></ion-icon>
        </button>
        </td>
        </tr>
        `
    );
  });
}

function handlePriority(item) {
  return item === 'High'
    ? 'bg-red-500 text-white'
    : item === 'Medium'
    ? 'bg-yellow-500 '
    : 'bg-gray-500';
}
function handleStatus(item) {
  return item === 'Todo'
    ? 'bg-red-500 '
    : item === 'Doing'
    ? 'bg-yellow-500 text-black '
    : 'bg-green-500';
}
tbody.addEventListener('click', (e) => {
  let target = e.target;
  target.dataset.name === 'delete'
    ? handleDelete(target)
    : e.target.dataset.name === 'edit'
    ? edit(target)
    : target.dataset.name === 'eye'
    ? console.log('eye')
    : null;
});
function handleDelete(target) {
  database = database.filter((item) => item.id !== +target.dataset.id);
  renderData(database);
}
function edit(target) {
  active = +target.dataset.id;

  openModal(modalBox);
  handleEdit();
}
function handleEdit() {
  let selectId = database.find((item) => {
    if (item.id === active) {
      return item;
    }
  });
  form.querySelector('#task-name').value = selectId.taskInput;
  form.querySelector('#priority').value = selectId.priorityInput;
  form.querySelector('#status').value = selectId.statusInput;
  form.querySelector('#deadline').value = selectId.deadlineInput;
  form.querySelector('#textarea').value = selectId.desc;
  isEdit = true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (e.submitter.dataset.id === 'cancel') {
    closeModal(modalBox);
  } else if (e.submitter.dataset.id === 'save') {
    addToData(e);
    renderData(database);
    closeModal(modalBox);
  }
  form.reset();
});

// API
async function sendData(){

}


// function setItem(item) {
//   localStorage.setItem('items', JSON.stringify(item));
// }
// function getItem() {
//   const firstItem = localStorage.getItem('items');
//   if (firstItem) {
//     const parssedItems = JSON.parse(firstItem);
//     renderData(parssedItems);
//     database = parssedItems;
//   }
// }
