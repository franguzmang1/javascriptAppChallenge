import React, { Component } from "react";
import Aux from "../../hoc/auxiliary/auxiliary";
import WeekInfo from "../../weekInfo/weekInfo";
import classes from "./Week.module.css";
import * as firebase from "firebase";
import moment from "moment";

import { Link } from "react-router-dom";

class Week extends Component {
  state = {
    //each day has its variable. created from the beginning like this, foreseeing more data could be added to each day
    monday: {
      current: false,
    },
    tuesday: {
      current: false,
    },
    wednesday: {
      current: false,
    },
    thursday: {
      current: false,
    },
    friday: {
      current: false,
    },
    expectedHours: null, //total expected hours of the week
    weekWorkedHours: null, //total worked hours in the week
  };

  componentWillMount() {
    var d = new Date();
    var n = d.getDay();

    //switch that depending on the day sets the current day to the actual current day as said in javascript
    //so that the current date is displayed differently
    switch (n) {
      case 1:
        const newMonday = {
          current: true,
        };
        this.setState({ monday: newMonday });
        break;
      case 2:
        const newTuesday = {
          current: true,
        };
        this.setState({ tuesday: newTuesday });
        break;
      case 3:
        const newWednesday = {
          current: true,
        };
        this.setState({ wednesday: newWednesday });
        break;
      case 4:
        const newThursday = {
          current: true,
        };
        this.setState({ thursday: newThursday });
        break;
      case 5: //cambiar a 5 que es verdadero valor
        const newFriday = {
          current: true,
        };
        this.setState({ friday: newFriday });
        break;
      default:
        break;
    }

    //getting data from firebase
    const rootRef = firebase.database().ref().child("week");
    rootRef.once("value", (snap) => {
      //calculate week's expected and working hours and save it to the state
      this.sumWeekWorkedHoursAndExpectedHours(snap.val());
    });
  }

  //function to calculate the week's worked and expected hours and save it to the state
  sumWeekWorkedHoursAndExpectedHours(object) {
    let deObject = object.days;
    //initializing the total time each day as durations by the library moment.js
    let durationMonday = moment.duration(deObject.monday.totalWorkedHours);
    let durationTuesday = moment.duration(deObject.tuesday.totalWorkedHours);
    let durationWednesday = moment.duration(
      deObject.wednesday.totalWorkedHours
    );
    let durationThursday = moment.duration(deObject.thursday.totalWorkedHours);
    let durationFriday = moment.duration(deObject.friday.totalWorkedHours);

    //summing the durations of each day worked hours
    let resultDuration = durationMonday.add(
      durationTuesday.add(
        durationWednesday.add(durationThursday.add(durationFriday))
      )
    );

    //summing the total hours and minutes
    let totalHours = resultDuration.days() * 24 + resultDuration.hours();
    if (totalHours < 10) {
      //if total hours is less than 0, put the 0 behind the number
      totalHours = "0" + totalHours;
    }

    let totalMinutes = resultDuration.minutes();
    if (totalMinutes < 10) {
      //if total minutes is less than 0, put the 0 behind the number
      totalMinutes = "0" + totalMinutes;
    }

    //saving it to the state
    const toSaveWeekWorkedHours = `${totalHours}:${totalMinutes}`;

    let duration = moment.duration(object.expectedHoursPerDay);

    //multiplying the expectedHoursPerday by 5
    let dur = moment.duration(duration.asMinutes() * 5, "minutes");

    let totalHours2 = dur.days() * 24 + dur.hours();
    if (totalHours2 < 10) {
      //if total hours is less than 0, put the 0 behind the number
      totalHours2 = "0" + totalHours2;
    }

    let minutes = dur.minutes();
    if (minutes < 10) {
      //if total hours is less than 0, put the 0 behind the number
      minutes = "0" + minutes;
    }

    const stringToPutExpectedHours = `${totalHours2}:${minutes}`;

    //saving the expectedHours of the week and the worked hours to the state
    this.setState({
      weekWorkedHours: toSaveWeekWorkedHours,
      expectedHours: stringToPutExpectedHours,
    });
  }

  render() {
    //calculate the styling of each day
    let mondayStyle = this.state.monday.current
      ? { "background-color": "white" }
      : null;
    let tuesdayStyle = this.state.tuesday.current
      ? { "background-color": "white" }
      : null;
    let wednesdayStyle = this.state.wednesday.current
      ? { "background-color": "white" }
      : null;
    let thursdayStyle = this.state.thursday.current
      ? { "background-color": "white" }
      : null;
    let fridayStyle = this.state.friday.current
      ? { "background-color": "white" }
      : null;

    //a text that is active if that day is the current day
    let todayTextMonday = this.state.monday.current ? <p>Today</p> : null;
    let todayTextTuesday = this.state.tuesday.current ? <p>Today</p> : null;
    let todayTextWednesday = this.state.wednesday.current ? <p>Today</p> : null;
    let todayTextThursday = this.state.thursday.current ? <p>Today</p> : null;
    let todayTextFriday = this.state.friday.current ? <p>Today</p> : null;

    console.log("weekWorkedHours: " + this.state.weekWorkedHours);
    console.log("expectedHours:" + this.state.expectedHours);
    //logic to display text about the hours requirement

    return (
      <Aux>
        <div className={classes.div1}></div>
        <h1 className={classes.textOfSelectDay}>
          Select the day you want to set the hours
        </h1>
        <div className={classes.theWeek}>
          <Link
            to={{
              pathname: "/day",
              search: "?dayOfWeek=monday",
            }}
            style={{ textDecoration: "none" }}
          >
            <div style={{ ...mondayStyle }} className={classes.dayBox}>
              <p> Monday </p> {todayTextMonday}
            </div>
          </Link>

          <Link
            to={{
              pathname: "/day",
              search: "?dayOfWeek=tuesday",
            }}
            style={{ textDecoration: "none" }}
          >
            <div style={{ ...tuesdayStyle }} className={classes.dayBox}>
              <p> Tuesday</p> {todayTextTuesday}
            </div>
          </Link>

          <Link
            to={{
              pathname: "/day",
              search: "?dayOfWeek=wednesday",
            }}
            style={{ textDecoration: "none" }}
          >
            <div style={{ ...wednesdayStyle }} className={classes.dayBox}>
              <p> Wednesday</p> {todayTextWednesday}
            </div>
          </Link>

          <Link
            to={{
              pathname: "/day",
              search: "?dayOfWeek=thursday",
            }}
            style={{ textDecoration: "none" }}
          >
            <div style={{ ...thursdayStyle }} className={classes.dayBox}>
              <p> Thursday</p> {todayTextThursday}
            </div>
          </Link>

          <Link
            to={{
              pathname: "/day",
              search: "?dayOfWeek=friday",
            }}
            style={{ textDecoration: "none" }}
          >
            <div style={{ ...fridayStyle }} className={classes.dayBox}>
              <p> Friday</p> {todayTextFriday}
            </div>
          </Link>
        </div>

        <WeekInfo
          weekWorkedHours={this.state.weekWorkedHours}
          expectedHours={this.state.expectedHours}
        />
      </Aux>
    );
  }
}

export default Week;
