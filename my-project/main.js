import './style.css';
import { debounce } from 'lodash/function.js';
import { data } from 'autoprefixer';
const modalBox = document.getElementById('modal-box');
const tbody = document.getElementById('tbody');
const form = document.getElementById('form');
const nav = document.getElementById('nav');
const paginate = document.getElementById('paginate');
const search = document.getElementById('search');
const loading = document.getElementById('loading');
const filter = document.getElementById('filter');

let active;
let isEdit = false;
const BASE_URL = 'http://localhost:3002';
let page = 1;
let database = getData(BASE_URL, `users`);

nav.addEventListener('click', (e) => navBtn(e));
function navBtn(e) {
  let target = e.target;
  if (target.dataset.id === 'filter') {
    openModal(filter);
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
  console.log(Array.from(target.elements));
  if (isEdit === false) {
    const obj = {
      id: Date.now(),
      taskInput: task.value,
      priorityInput: priority.value,
      statusInput: status.value,
      deadlineInput: deadline.value,
      desc: desc.value,
    };
    // database.then((response) => {
    //     response.push(obj);
    //     renderData(response);
    //   })
    post(BASE_URL, 'users', obj).then(() => pagination());
  } else if (isEdit === true) {
    database = getData(BASE_URL, `users?_page=${page}&_limit=5`);
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
modalBox.addEventListener('click', (e) => {
  e.target.dataset.close ? closeModal(modalBox) : null;
});
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
      `<tr id=${element.id} class="text-center border h-full w-full ">
              <td class="border-l-2 border-b-2 py-4">${element.taskInput}</td>
              <td class="border-l-2 border-b-2">
              <span
              class="
              ${handlePriority(element.priorityInput)}
            rounded-2xl px-3 py-1 items-center"
              >
              ${element.priorityInput}
        </span>
      </td>
      <td class="border-l-2 border-b-2">
      <span
      class=" 
      ${handleStatus(element.statusInput)}
       text-white w-max rounded-2xl px-3 py-1 items-center"
      >
      ${element.statusInput}
      </span>
      </td>
      <td class=" border">${element.deadlineInput}</td>
      <td class=" border  ">
      <div class="flex flex-col md:block items-center justify-center p-2 gap-1">
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
        </div>
        </tr>
        `
    );
  });
}
//first time
pagination();

function handlePriority(item) {
  return item === 'High'
    ? 'bg-red-500 text-white'
    : item === 'Medium'
    ? 'bg-yellow-300 '
    : 'bg-gray-300';
}
function handleStatus(item) {
  return item === 'Todo'
    ? 'bg-red-500 '
    : item === 'Doing'
    ? 'bg-yellow-300 text-black'
    : 'bg-green-400';
}
tbody.addEventListener('click', (e) => {
  let target = e.target;
  target.dataset.name === 'delete'
    ? handleDelete(target)
    : e.target.dataset.name === 'edit'
    ? edit(target)
    : target.dataset.name === 'eye'
    ? disableForm(target)
    : null;
});
function handleDelete(target) {
  const targetID = +target.dataset.id;
  deleteData(BASE_URL, 'users', targetID);
  database = getData(BASE_URL, `users?_page=${page}&_limit=5`);
  pagination();
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

function disableForm(target) {
  active = +target.dataset.id;
  openModal(modalBox);
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
}
// API
async function post(URL, endpoint, item) {
  try {
    let data = await fetch(`${URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getData(url, endpoint) {
  try {
    let data = await fetch(`${url}/${endpoint}`);
    // console.log(data.headers.get('link').split(',')[1].split(';')[0].split('/')[3]);
    // console.log(data.headers('X-Total-Count'));
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

//search
function searchInput(e) {
  let value = e.target.value;
  console.log(value);
  if (value != '') {
    database = getData(BASE_URL, `users?q=${value}`).then((response) => {
      renderData(response);
      return response;
    });
  } else pagination();
}
search.addEventListener('keyup', debounce(searchInput, 1000));

//Paginate
paginate.addEventListener('click', (e) => {
  const targetp = e.target;
  targetp.dataset.name === 'next'
    ? nextPage()
    : targetp.dataset.name === 'previous'
    ? previousPage()
    : null;
});

function nextPage() {
  page = ++page;
  openModal(loading);
  database = getData(BASE_URL, `users?_page=${page}&_limit=5`);
  database.then((response) => {
    renderData(response);
    closeModal(loading);
    return response;
  });
}
function previousPage() {
  page > 1 ? (page = --page) : page;
  openModal(loading);
  database = getData(BASE_URL, `users?_page=${page}&_limit=5`);
  database.then((response) => {
    renderData(response);
    closeModal(loading);
    return response;
  });
}
function pagination() {
  openModal(loading);
  database = getData(BASE_URL, `users?_page=${page}&_limit=5`);
  database.then((response) => {
    renderData(response);
    closeModal(loading);
    return response;
  });
}

//filter
function handleFilter(e) {
  const targetf = e.target;
  targetf.dataset.close ? closeModal(filter) : filterData(e);
}
function filterData() {
  const [priority, status, deadline] = Array.from(
    filter.querySelectorAll('[data-value]')
  );
  let Url = '';
  priority.value !== 'All'
    ? (Url += `&priorityInput=${priority.value}`)
    : status.value !== 'All'
    ? (Url += `&statusInput=${status.value}`)
    : deadline.value !== ''
    ? (Url += `&deadlineInput=${deadline.value}`)
    : null;
  getData(BASE_URL, `users?${Url}`).then((response) => {
    renderData(response);
  });
}
filter.addEventListener('click', handleFilter);
