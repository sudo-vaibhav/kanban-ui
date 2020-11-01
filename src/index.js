import './home.scss';
import './assets/kanban-hero.svg';
import './assets/kanban-logo.svg';
import './assets/ishita.png';
import './assets/deepesh.jpeg';
import './assets/aditya.jpeg';
import './assets/vaibhav.jpg';
import './assets/image_add_task.png';
import './assets/image_board.png';
import './assets/image_invite.png';
import { db } from './main';
import AOS from 'aos';
import 'aos/src/sass/aos.scss';

AOS.init();
window.addEventListener('DOMContentLoaded', () => {
  M.AutoInit();
  const startBoardForm = document.querySelector('#start-board-form');

  startBoardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = startBoardForm['board-name-input'].value;
    const docRef = await db.collection('workspaces').add({
      name,
      taskTables: {
        'About To Do': {
          tasks: {},
        },
        Doing: {
          tasks: {},
        },
        Done: {
          tasks: {},
        },
      },
    });
    window.location.href = `/board?id=${docRef.id}`;
  });
});
