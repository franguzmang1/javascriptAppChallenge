import React, { Component } from "react";
import moment from "moment";

class WeekInfo extends Component {
  render() {
    let textOfHours = null;
    if (this.props.weekWorkedHours === this.props.expectedHours) {
      //the hour requirement is met perfectly
      textOfHours = <p> You have met the hours requirement of the week!</p>;
    } else if (this.props.weekWorkedHours < this.props.expectedHours) {
      //the hours requirement is not met
      let dur1 = moment.duration(this.props.weekWorkedHours);
      let dur2 = moment.duration(this.props.expectedHours);

      dur2.subtract(dur1);
      console.log(dur2);

      const totalHours = dur2.days() * 24 + dur2.hours();
      let totalMinutes = dur2.minutes();
      if (totalMinutes < 10) {
        totalMinutes = "0" + totalMinutes;
      }
      const stringToDisplay = `${totalHours}:${totalMinutes}`;

      textOfHours = (
        <p>
          {" "}
          You have not met the hours requirement of the week by{" "}
          {stringToDisplay} hours
        </p>
      );
    } else {
      //the hour requirement is surpassed
      let dur1 = moment.duration(this.props.weekWorkedHours);
      let dur2 = moment.duration(this.props.expectedHours);

      dur1.subtract(dur2);

      const totalHours = dur1.days() * 24 + dur1.hours();
      let totalMinutes = dur1.minutes();
      if (totalMinutes < 10) {
        totalMinutes = "0" + totalMinutes;
      }
      const stringToDisplay = `${totalHours}:${totalMinutes}`;

      textOfHours = (
        <p>
          {" "}
          You have surpassed the hours requirement of the week by{" "}
          {stringToDisplay} !
        </p>
      );
    }

    return (
      <div>
        <p>
          {" "}
          You have this amount of hours in total this week{" "}
          {this.props.weekWorkedHours}
        </p>
        <p> Amount expected hours this week: {this.props.expectedHours}</p>
        {textOfHours}
      </div>
    );
  }
}

export default WeekInfo;
