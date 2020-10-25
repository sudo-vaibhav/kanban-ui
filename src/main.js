import './scss/main.scss';
import './assets/favicon.svg';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Modal } from 'materialize-css';

firebase.initializeApp({
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
export { db };
