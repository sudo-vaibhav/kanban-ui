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
          tasks: {
            '0ccdcfa4-9b4b-4cfe-8439-5a02771f00ae': {
              title: 'Create Google Adwords Campaign',
              description:
                'create separate headers for new launches and popular products',
            },
            '0ccdcfa4-9b4b-4cfe-8439-5a02771f00ty': {
              title: 'Buy new furniture for office',
              description: 'Make sure to get the bean bags',
            },
            '0ccdcfa4-9b4b-4cfe-8439-5a02771f01er': {
              title: 'Finish Integrating Changes',
              description: 'This is highly crucial for shipping on time',
            },
          },
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
