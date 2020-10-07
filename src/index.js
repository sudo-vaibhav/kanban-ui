import './scss/style.scss';
import Sortable from 'sortablejs';
import _ from 'lodash';
import { uuid } from 'uuidv4';
// import 'materialize-css/js/buttons';
import { Modal } from 'materialize-css';

// document.addEventListener('DOMContentLoaded', function () {
//   var elems = document.querySelectorAll('.fixed-action-btn');
//   var instances = M.FloatingActionButton.init(elems, options);
// });

const populateTables = (tables) => {
  let tablesHTML = '';
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
                <span class="material-icons"> more_vert </span>
              </div>
            </div>
            <div class="row tasks-wrapper" id="${key}">
              ${Object.keys(tableData.tasks)
                .map((key) => {
                  return `<div class="col white task" id="${key}">
                <div class="row priority-wrapper">
                  <span class="white-text red badge left">Low Priority</span>
                </div>
                <p class="task-text">${tableData.tasks[key].title}</p>
                <div class="row">
                  <div class="col s12">
                    <span class="material-icons right"> delete </span>
                  </div>
                </div>
                    </div>`;
                })
                .join('')}
            </div>
            <a
              class="btn-floating btn-large waves-effect waves-light primary fixed-action-btn right"
              ><i class="material-icons">add</i></a
            >
          </div>
        `;
    });
  document.querySelector('#kanban-tables-collection').innerHTML = tablesHTML;
};

import * as firebase from 'firebase/app';
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyD6TCMmeg1OCL4J1rgyIJk54H2Hu-KHVMo',
  authDomain: 'kanban-work-manager-7ba68.firebaseapp.com',
  databaseURL: 'https://kanban-work-manager-7ba68.firebaseio.com',
  projectId: 'kanban-work-manager-7ba68',
  storageBucket: 'kanban-work-manager-7ba68.appspot.com',
  messagingSenderId: '439358102630',
  appId: '1:439358102630:web:a24bd65e63d94181fa61a7',
  measurementId: 'G-KJXQ957WKZ',
});
const db = firebase.firestore();
const projectDoc = db.collection('workspaces').doc('zPNyKXAPTou0BZCNqBaZ');

projectDoc.onSnapshot((doc) => {
  const data = doc.data();
  console.log(data);
  console.log(doc.id);

  document.querySelector('#project-heading').innerHTML = data.name;
  populateTables(data.taskTables);
  const tables = document.querySelectorAll(
    '.kanban-table-container .tasks-wrapper'
  );

  tables.forEach((table) => {
    new Sortable(table, {
      group: 'shared', // set both lists to same group
      animation: 150,
      onEnd: async function (/**Event*/ evt) {
        const from = evt.from.getAttribute('id');
        const to = evt.to.getAttribute('id');
        const taskId = evt.item.getAttribute('id');
        //   projectDoc.update({
        //     ["taskTables."+from] :
        // })

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
      },
    });
  });
  //   document.querySelector('#add-table').addEventListener('click', () => {});
  document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  });
});
