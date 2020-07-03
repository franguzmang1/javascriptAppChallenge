import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import * as firebase from "firebase";

var path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

console.log(process.env.REACT_APP_DATABASE_URL);

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "challengue-49ddb.firebaseapp.com",
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: "challengue-49ddb",
  storageBucket: "challengue-49ddb.appspot.com",
  messagingSenderId: "721432718437",
  appId: "1:721432718437:web:e4593543bf9a85d7e66a8c",
  measurementId: process.env.REACT_APP_appId,
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);


serviceWorker.unregister();
