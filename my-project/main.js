import './style.css';
import { debounce } from 'lodash/functions.js';
const modalBox = document.getElementById('modal-box');
const tbody = document.getElementById('tbody');
const form = document.getElementById('form');
const nav = document.getElementById('nav');
const aside = document.getElementById('aside');
const paginate = document.getElementById('paginate');
const search = document.getElementById('search');

let active;
let isEdit = false;
const BASE_URL = 'http://localhost:3002';
let database = getData(BASE_URL, 'users');

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
    database.then((response) => {
      console.log(response);
      response.push(obj);
      renderData(response);
      return response;
    });
    console.log(database);
    post(BASE_URL, 'users', obj);
  } else if (isEdit === true) {
    database = getData(BASE_URL, 'users');
    database = database.then((response) => {
      response.forEach((item) => {
        if (item.id === active) {
          item.taskInput = task.value;
          item.priorityInput = priority.value;
          item.statusInput = status.value;
          item.deadlineInput = deadline.value;
          item.desc = desc.value;
          Update(BASE_URL, 'users', item);
        }
      });
      renderData(response);
      form.reset();
      return response;
    });
    isEdit = false;
  }
}
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (e.submitter.dataset.id === 'cancel') {
    closeModal(modalBox);
    form.reset();
  } else if (e.submitter.dataset.id === 'save') {
    addToData(e);
    closeModal(modalBox);
  }
});
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

database.then((response) => renderData(response));

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
  const targetID = +target.dataset.id;
  deleteData(BASE_URL, 'users', targetID);
  database = getData(BASE_URL, 'users');
  database = database
    .then((resolve) => {
      return resolve.filter((item) => item.id !== targetID);
    })
    .then((response) => {
      renderData(response);
      return response;
    });

  // database = database.then((response) => {
  //   return response.filter((item) => item.id !== targetID);
  // });
  // database.then((response) => renderData(response));
}
function edit(target) {
  active = +target.dataset.id;
  openModal(modalBox);
  handleEdit();
}
function handleEdit() {
  database
    .then((response) => {
      return response.find((item) => {
        if (item.id === active) {
          return item;
        }
      });
    })
    .then((response) => {
      form.querySelector('#task-name').value = response.taskInput;
      form.querySelector('#priority').value = response.priorityInput;
      form.querySelector('#status').value = response.statusInput;
      form.querySelector('#deadline').value = response.deadlineInput;
      form.querySelector('#textarea').value = response.desc;
    });

  isEdit = true;
}

// API

async function post(URL, endpoint, item) {
  try {
    await fetch(`${URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
  } catch (error) {
    console.log(error);
  }
}

async function getData(url, endpoint) {
  try {
    let data = await fetch(`${url}/${endpoint}`);
    return await data.json();
  } catch (error) {
    console.log(error);
  }
}

async function Update(URL, endpoint, item) {
  try {
    await fetch(`${URL}/${endpoint}/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
  } catch (error) {
    console.log(error);
  }
}
async function deleteData(URL, endpoint, id) {
  try {
    await fetch(`${URL}/${endpoint}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error);
  }
}

//Paginate
// paginate.addEventListener('click', paginateBtn);
// function paginateBtn(target) {
//   const target = e.target;
//   console.log((target));
// }
// GET /posts?_page=7
// GET /posts?_page=7&_limit=20
