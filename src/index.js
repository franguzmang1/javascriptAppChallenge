import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyDn1O7dRyZGECXGB2rQlcquD2ZYdEfiOiw",
  authDomain: "challengue-49ddb.firebaseapp.com",
  databaseURL: "https://challengue-49ddb.firebaseio.com",
  projectId: "challengue-49ddb",
  storageBucket: "challengue-49ddb.appspot.com",
  messagingSenderId: "721432718437",
  appId: "1:721432718437:web:e4593543bf9a85d7e66a8c",
  measurementId: "G-PHQKK2FLRH"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
