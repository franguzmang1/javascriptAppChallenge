import React from "react";
import classes from "./dayInfo.module.css";

const DayInfo = (props) => (
  <div className={classes.nextDiv}>
    <h2>Expected hours: {props.expectedHours.substring(1, 2)}</h2>
    <p> Worked hours: {props.totalWorkedHours}</p>
    {props.textToDisplay}
  </div>
);

export default DayInfo;
