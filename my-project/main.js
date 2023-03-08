import './style.css';

const modalBox = document.getElementById('modal-box');
const datePicker = document.getElementById('date-picker');
const tbody = document.getElementById('tbody');
const task = document.getElementById('task-name');
const priority = document.getElementById('priority');
const status = document.getElementById('status');
const deadline = document.getElementById('deadline');
const form = document.getElementById('form');
const nav = document.getElementById('nav');
const aside = document.getElementById('aside');
getItem() 
let database = [];
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.submitter.dataset.id === 'cancel') {
    closeModal(modalBox);
  } else if (e.submitter.dataset.id === 'save') {
    addToData();
    renderData(database);
    closeModal(modalBox);
  }
  form.reset();
});

// localStorage.setItem("state", JSON.stringify(database));
let count = 0;
function addToData() {
  count++;
  const obj = {
    id: count,
    taskInput: task.value,
    priorityInput: priority.value,
    statusInput: status.value,
    deadlineInput: deadline.value,
  };
  // JSON.parse(localStorage.getItem("state"))
  database.push(obj);
  setItem(database)
//   localStorage.setItem('state', JSON.stringify(database));
  // console.log(localStorage.getItem("state"));
  // console.log(database);
}

function renderData(item) {
  tbody.innerHTML = '';
  //   JSON.parse(localStorage.getItem("state")).map((element) => {
  //   });
  item.map((element) => {
    tbody.insertAdjacentHTML(
      'beforeend',
      `<tr id=${element.id} class="text-center">
              <td class="py-4border-l-2 border-b-2 py-4">${element.taskInput}</td>
              <td class="border-l-2 border-b-2">
              <span
              class="bg-gray-200 w-max rounded-xl px-2 py-1 items-center"
              >
              ${element.priorityInput}
        </span>
      </td>
      <td class="border-l-2 border-b-2">
      <span
      class="bg-red-600 text-white w-max rounded-xl px-2 py-1 items-center"
      >
      ${element.statusInput}
      </span>
      </td>
      <td class="border-l-2 border-b-2">${element.deadlineInput}</td>
      <td class="border-l-2 border-b-2">
      <button class="bg-red-600 px-1 py-0 rounded">
      <ion-icon
      class="text-white text-center"
      data-id='${element.id}'
      data-name='delete'
      name="trash"
      ></ion-icon>
      </button>
        <button class="bg-blue-600 px-1 py-0 rounded">
        <ion-icon
        class="text-white text-center"
        data-id="${element.id}"
        data-name="edit"
        name="pencil"
        ></ion-icon>
        </button>
        <button class="bg-gray-500 px-1 py-0 rounded">
        <ion-icon
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

///editing
// function editBtn(target) {
//   let trId = +target.dataset.id;
//   // console.log(trId);
//   JSON.parse(localStorage.getItem('state')).map((item) => {
//     if (item.id === trId) {
//       // task.value = item.taskInput;
//       // priority.value = item.priorityInput;
//       // status.value = item.statusInput;
//       // deadline.value = item.deadlineInput;

//       let editfunc = editModal(
//         item.taskInput,
//         item.priorityInput,
//         item.statusInput,
//         item.deadlineInput,
//         item.id
//       );
//       // console.log(editfunc);
//       document.body.append(editfunc);
//       editfunc.addEventListener('click', (e) => {
//         e.stopPropagation();
//         e.preventDefault();
//         if (e.target.dataset.action === 'edit') {
//           console.log('edit');
//           let idEdit = +e.target.closest('form').getAttribute('id');
//           // console.log(JSON.parse(localStorage.getItem("state")));
//           console.log(idEdit);
//           let newData = JSON.parse(localStorage.getItem('state')).map(
//             (item) => {
//               if (idEdit == item.id) {
//                 item.taskInput = editTask.value;
//                 console.log(item.taskInput);
//                 console.log(typeof item.id);
//                 item.taskInput = editTask.value;
//                 item.priorityInput = editPriority.value;
//                 item.statusInput = editStatus.value;
//                 item.deadlineInput = editDeadline.value;
//                 item.id = idEdit;
//                 return item;
//                 console.log(item);
//               } else {
//                 return item;
//               }
//             }
//           );
//           console.log(newData);
//           localStorage.setItem('state', JSON.stringify(newData));
//           renderData(database);
//           console.log(e.target.closest('form').getAttribute('id'));
//         } else if (e.target.dataset.action === 'cancel') {
//           e.preventDefault();
//           e.stopPropagation();
//           editModalbtn.classList.add('invisible');
//         }
//         console.log(e.target.dataset);
//       });
//       // const editButton = document.getElementById("edit");
//       // const editCancel = document.getElementById("edit-cancel");
//       const editModalbtn = document.getElementById('edit-modal');
//       // editCancel.addEventListener("click", (e) => {
//       //   e.preventDefault();
//       //   e.stopPropagation();
//       //   editModalbtn.classList.add("invisible");
//       // });
//       // console.log(editButton);
//       const editTask = document.getElementById('edit-task');
//       const editPriority = document.getElementById('edit-priority');
//       const editStatus = document.getElementById('edit-status');
//       const editDeadline = document.getElementById('edit-deadline');
//       console.log(editDeadline);
//       // editButton.addEventListener("click", (e) => {
//       //   e.stopPropagation();
//       //   e.preventDefault();
//       //   let idEdit = e.target.closest("form").getAttribute("id");
//       //   // console.log(JSON.parse(localStorage.getItem("state")));
//       //   console.log(idEdit);
//       //   let newData = JSON.parse(localStorage.getItem("state")).map((item) => {
//       //     if (idEdit == item.id) {
//       //       item.taskInput = editTask.value;
//       // console.log(item.taskInput);
//       // console.log(typeof item.id);

//       // item.taskInput = editTask.value;
//       // item.priorityInput = editPriority.value;
//       // item.statusInput = editStatus.value;
//       // item.deadlineInput = editDeadline.value;
//       // item.id = idEdit;
//       // return item;
//       // console.log(item);
//       //   } else {
//       //     return;
//       //   }
//       // });
//       // console.log(newData);
//       // localStorage.setItem("state", JSON.stringify(newData));
//       // renderData();
//       // console.log(e.target.closest("form").getAttribute("id"));
//       // });
//     }
//   });

//   // active = trId;
//   // isEdit = true; //چون میخواهیم ادد نکنه به جدول
// }
// function handleEdit() {
//   JSON.parse(localStorage.getItem("state")).map((item) => {
//     if (item.id === active) {
//       item.taskInput = task.value;
//       item.priorityInput = priority.value;
//       item.statusInput = status.value;
//       item.deadlineInput = deadline.value;
//     }
//   });
//   isEdit = false;
//   renderData();
// }

//delete & edit

tbody.addEventListener('click', (e) => {
  console.log(e.target);
  let trId = +e.target.closest('tr').id;
  if (e.target.dataset.name === 'delete') {
    console.log('del');
    // let del = JSON.parse(localStorage.getItem('state')).filter((item) => {
    //   return item.id !== trId;
    // });
    // localStorage.setItem('state', JSON.stringify(del));
    return renderData(database);
  } else if (e.target.dataset.name === 'edit') {
    editBtn(e.target);
    // console.log("test");
  }
});
function setItem(item) {
    localStorage.setItem("items", JSON.stringify(item));
  }
  function getItem() {
    const firstItem = localStorage.getItem("items");
    if (firstItem) {
      const parssedItems = JSON.parse(firstItem);
      console.log(parssedItems);
      renderData(parssedItems);
      database = parssedItems;
    }
  }

// function editModal(item1, item2, item3, item4, id) {
//   let div = document.createElement('div');
//   div.innerHTML = `<div id="edit-modal"

//   class="absolute inset-0 bg-gray-500 bg-opacity-80 flex items-center justify-center z-10"
// >
//   <div class="flex flex-col w-6/12 bg-white relative">
//     <form id=${id}>
//     <h1 class="font-bold p-4">New Task</h1>
//     <hr />
//     <div class="">
//       <label>
//         Task Name
//         <input
//         value=${item1}
//           id="edit-task"
//           class="rounded border border-3 m-3 p-3"
//           type="text"
//         />
//       </label>
//     </div>
//     <div class="flex justify-between gap-6">
//       <select id="edit-priority" class="p-3 border border-2 w-64">
//         <option value="Low">Low</option>
//         <option value="Medium">Medium</option>
//         <option value="priority">Priority</option>
//         <option value="High">High</option>
//       </select>
//       <select id="edit-status" class="border border-2 w-64">
//         <option value="Status">Status</option>
//         <option value="Todo">Todo</option>
//         <option value="Doing">Doing</option>
//         <option value="Done">Done</option>
//       </select>
//       <div

//         class="text-center pt-2 date-picker border border-2 w-64"
//       >
//         <input
//         id="edit-deadline"
//           type="date"
//           name="trip-start"
//           value="2023-03-06"
//           min="2018-01-01"
//           max="2024-03-06"
//         />
//       </div>
//     </div>
//     <textarea
//       class="border border-2 rounded m-3"
//       placeholder="Details (Optional)"
//     ></textarea>
//     <div class="flex justify-between">
//     <button data-action="cancel" class="border border-2 rounded p-1">
//     CANCEL
//     </button>
//       <button data-action="edit" type="submit" class="border border-2 rounded p-1">EDIT</button>
//     </div>
//   </div>
// </form>
// </div>
// </div>`;
//   return div;
// }

// function editHandle(e) {
//   e.stopPropagation();
//   e.preventDefault();
//   e.target.closest("form").getAttribute("id");
//   console.log(e.target.closest("form").getAttribute("id"));
// }
