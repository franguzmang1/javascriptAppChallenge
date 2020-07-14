import React from "react";
import classes from "./Toolbar.module.css";
import { Link } from "react-router-dom";

const toolbar = (props) => (
  <header className={classes.Toolbar}>
    <div className={classes.Logo}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <img src={require("../../../src/assets/homeButton.png")}/>
      </Link>
    </div>
    <nav className={classes.DesktopOnly}></nav>
  </header>
);

export default toolbar;
