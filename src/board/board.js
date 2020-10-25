import './board.scss';
import Sortable from 'sortablejs';
import _ from 'lodash';
import { uuid } from 'uuidv4';
import '../assets/kanban-logo.svg';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import '../assets/deleted.mp3';
import '../assets/added.mp3';
import { db } from '../main';
import { decode, encode } from 'emoji-uuid';
const populateTables = (tables) => {
  let tablesHTML = '';
  let modalsHTML = '';
  Object.keys(tables)
    .sort()
    .forEach((key) => {
      const tableData = tables[key];

      tablesHTML += `
        <div class="col s12 m6 l3 z-depth-3 kanban-table-container" >
            <div class="row valign-wrapper">
                <div class="col s10">
                    <h5>${key}</h5>
                </div>
                <div class="col s2">
                    <a class='dropdown-trigger' href='#' data-target='dropdown-${key.replace(
                      ' ',
                      '-'
                    )}'  style="display:flex; justify-content:center;align-items:center;">
                        <span class="material-icons black-text"> more_vert </span>
                    </a>
                    <ul id='dropdown-${key.replace(
                      ' ',
                      '-'
                    )}' class='dropdown-content'>
                        <li><a href="#!" data-delete="${key}" class="black-text delete-table-option" >Delete</a></li>
                    </ul>
                </div>
            </div>
            <div class="row tasks-wrapper" id="${key}">
              ${Object.keys(tableData.tasks)
                .sort()
                .map((taskKey) => {
                  return `
                <div class="col white task" id="${taskKey}" style="padding-top:1rem;padding-bottom:1rem">
                    <h6 class="task-text">${tableData.tasks[taskKey].title}</h6>
                    <p class="task-description">${
                      tableData.tasks[taskKey].description || ''
                    }</p>
                </div>`;
                })
                .join('')}
            </div>
            <a class="btn btn-floating btn-large waves-effect waves-light primary fixed-action-btn right modal-trigger" href="#add-task-modal-${key}">
                <i class="material-icons">add</i>
            </a>
        </div>
        `;
      modalsHTML += `
                <form class="add-task-form" id="add-task-${key}">
                    <div id="add-task-modal-${key}" class="modal">
                        <div class="modal-content">
                            <h4>Add a Task to "${key}"</h4>
                            <div class="row">
                                <div class="input-field col s12 primary">
                                    <input
                                        placeholder="Ex. Buy Groceries"
                                        id="task-name-input-${key}"
                                        type="text"
                                        class="task-name-input"
                                    />
                                    <label for="task-name-input-${key}" class="active">New Task Name</label>
                                </div>
                            </div>
                             <div class="row">
                                <div class="input-field col s12 primary">
                                    <input
                                        placeholder="Ex. Don't forget apples for the pie"
                                        id="task-description-input-${key}"
                                        class="task-description-input"
                                        type="text"
                                    />
                                    <label for="task-description-input-${key}" class="active">New Task Description</label>
                                </div>
                            </div>
                        </div>
                        <input class="table-id-text-input" value="${key}">
                        <div class="modal-footer">
                            <div class="modal-footer">
                                <button class="btn waves-effect primary waves-light">Add</button>
                            </div>
                        </div>
                    </div>
                </form>
        `;
    });
  document.querySelector('#kanban-tables-collection').innerHTML = tablesHTML;
  document.querySelector('#add-table-modals-container').innerHTML = modalsHTML;
};

let modalRendered = false;

const urlParams = new URLSearchParams(window.location.search);
const boardId = urlParams.get('id');

if (boardId === null) {
  window.addEventListener('DOMContentLoaded', () => {
    const enterCodeForm = document.querySelector('#enter-code-form');
    enterCodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emojiCode = enterCodeForm['emoji-code-input'].value;
      const id = decode(emojiCode);
      window.location.href = `/board?id=${id}`;
    });
  });
  const enterCodeModal = M.Modal.init(
    document.querySelector('#enter-code-modal')
  );
  enterCodeModal.open();
} else {
  window.addEventListener('DOMContentLoaded', () => {
    const copyCodeButton = document.querySelector('#copy-code-button');
    document.querySelector('#emoji-id-container').innerHTML = encode(boardId);
    copyCodeButton.addEventListener('click', async () => {
      await window.navigator.clipboard.writeText(encode(boardId));
      alert('Copied code to clipboard!');
    });
  });
  const projectDoc = db.collection('workspaces').doc(boardId);

  projectDoc.onSnapshot((doc) => {
    const data = doc.data();
    document.querySelector('#project-heading').innerHTML = data.name;
    populateTables(data.taskTables);
    const tables = document.querySelectorAll(
      '.kanban-table-container .tasks-wrapper'
    );

    tables.forEach((table) => {
      new Sortable(table, {
        group: 'shared', // set both lists to same group
        onStart: async function () {
          document.querySelector('#task-delete-section').style.opacity = '1';
        },
        onEnd: async function (/**Event*/ evt) {
          document.querySelector('#task-delete-section').style.opacity = '0';
          const from = evt.from.getAttribute('id');
          const to = evt.to.getAttribute('id');
          const taskId = evt.item.getAttribute('id');

          if (to == 'task-delete-section') {
            console.log('deleting');
            await projectDoc.update({
              ['taskTables.' + from + '.tasks']: _.omit(
                data.taskTables[from].tasks,
                taskId
              ),
            });
            document
              .querySelectorAll('#task-delete-section .task')
              .forEach((e) => e.parentNode.removeChild(e));
            new Audio('../assets/deleted.mp3').play();
            Toastify({
              text: 'Task deleted!',
              gravity: 'bottom',
            }).showToast();
          } else {
            if (from != to) {
              await projectDoc.update({
                ['taskTables.' + to + '.tasks']: {
                  ...data.taskTables[to].tasks,
                  [uuid()]: data.taskTables[from].tasks[taskId],
                },

                ['taskTables.' + from + '.tasks']: _.omit(
                  data.taskTables[from].tasks,
                  taskId
                ),
              });
            }
          }
        },
      });
    });

    new Sortable(document.querySelector('#task-delete-section'), {
      group: 'shared',
    });

    const addTaskForms = document.querySelectorAll('.add-task-form');
    addTaskForms.forEach((addTaskForm) => {
      addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskTableId = addTaskForm.querySelector('.table-id-text-input')
          .value;
        await projectDoc.update({
          ['taskTables.' + taskTableId + '.tasks']: {
            ...data.taskTables[taskTableId].tasks,
            [uuid()]: {
              title: addTaskForm.querySelector('.task-name-input').value,
              description: addTaskForm.querySelector('.task-description-input')
                .value,
            },
          },
        });

        Toastify({
          text: 'Task added!',
          gravity: 'bottom',
        }).showToast();
        new Audio('../assets/added.mp3').play();
      });
    });
    const addTableForm = document.querySelector('#add-table-form');
    addTableForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newTableName = addTableForm['table-name-input'].value;
      console.log(newTableName);

      await projectDoc.update({
        taskTables: {
          ...data.taskTables,
          [newTableName]: {
            tasks: {},
          },
        },
      });
    });
    document
      .querySelectorAll('.delete-table-option')
      .forEach((deleteOption) => {
        deleteOption.addEventListener('click', async () => {
          await projectDoc.update({
            taskTables: _.omit(data.taskTables, deleteOption.dataset.delete),
          });
        });
      });

    document
      .querySelectorAll('.task-delete-section')
      .forEach((deleteButton) => {
        deleteButton.addEventListener('click', async () => {
          const tableId = deleteButton.dataset.table;
          const taskId = deleteButton.dataset.task;
          console.log(tableId, taskId);
          await projectDoc.update({
            ['taskTables.' + tableId + '.tasks']: _.omit(
              data.taskTables.tableId.tasks,
              taskId
            ),
          });
        });
      });
    M.AutoInit();
    if (!modalRendered) {
      const inviteModal = M.Modal.init(
        document.querySelector('#invite-people-modal')
      );
      modalRendered = true;
      inviteModal.open();
    }
  });
}
