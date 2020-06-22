import React, { Component } from 'react';
import Aux from '../hoc/auxiliary/auxiliary';
import classes from './Week.module.css';
import * as firebase from 'firebase';


import { Link } from 'react-router-dom';

var moment = require('moment');


class Week extends Component {
    state = {
        monday: {
            current: false
        },
        tuesday: {
            current: false
        },
        wednesday: {
            current: false
        },
        thursday: {
            current: false
        },
        friday: {
            current: false
        },
        expectedHours: null,
        weekWorkedHours: null
    };
 
    componentDidMount(){
        var d = new Date();
        var n = d.getDay();
        switch(n){
            case 1:
                 const newMonday = {
                    current: true
                }
                this.setState({monday: newMonday});
                break;
            case 2:
                const newTuesday = {
                    current: true
                }
                this.setState({tuesday: newTuesday});
                break;
            case 3:
                const newWednesday ={
                    current: true
                }
                this.setState({wednesday: newWednesday});
                break;
            case 4:
                const newThursday = {
                    current: true
                }
                this.setState({thursday: newThursday});
                break;
            case 5://cambiar a 5 que es verdadero valor
                const newFriday = {
                    current: true
                }
                this.setState({friday: newFriday});
                break;
        }

        const rootRef = firebase.database().ref().child('week');
        rootRef.once('value', snap =>{
            //calculate the total amount of hours worked in the week
            //display the expected worked hours

            

            this.sumWeekWorkedHours(snap.val().days);
            this.sumWeekExpectedHours(snap.val().expectedHoursPerDay);
            console.log(snap.val());

        });

    }

    sumWeekExpectedHours(expectedHoursPerDay){


        let duration = moment.duration(expectedHoursPerDay);
        
        var dur = moment.duration(duration.asMinutes()*5, 'minutes');

        const totalHours = dur.days()*24+dur.hours();
        let minutes = dur.minutes();
        if(minutes<10){
            minutes = '0'+minutes;
        }

        const stringToPut = `${totalHours}:${minutes}`;
        this.setState({expectedHours: stringToPut});
    }

    sumWeekWorkedHours(daysObject){
        var dateMonday = new Date();
        var dateTuesday = new Date();
        var dateWednesday = new Date();
        var dateThursday = new Date();
        var dateFriday = new Date();

        let durationMonday = moment.duration(daysObject.monday.totalWorkedHours);
        let durationTuesday = moment.duration(daysObject.tuesday.totalWorkedHours);
        let durationWednesday = moment.duration(daysObject.wednesday.totalWorkedHours);
        let durationThursday = moment.duration(daysObject.thursday.totalWorkedHours);
        let durationFriday = moment.duration(daysObject.friday.totalWorkedHours);
        

        var resultDuration = durationMonday.add(durationTuesday.add(durationWednesday.add(durationThursday.add(durationFriday))));


        const totalHours = resultDuration.days()*24 + resultDuration.hours();
        let totalMinutes = resultDuration.minutes();
        if(totalMinutes<10){
            totalMinutes = '0'+totalMinutes;
        }

        const toSave = `${totalHours}:${totalMinutes}`;
        this.setState({weekWorkedHours: toSave});
        
    }

    render(){

        let mondayStyle = this.state.monday.current ? {"background-color": "white"} : null;
        let tuesdayStyle = this.state.tuesday.current ? {"background-color": "white"} : null;
        let wednesdayStyle = this.state.wednesday.current ? {"background-color": "white"} : null;
        let thursdayStyle = this.state.thursday.current ? {"background-color": "white"} : null;
        let fridayStyle = this.state.friday.current ? {"background-color": "white"} : null;

        let todayTextMonday = this.state.monday.current ? <p>Today</p> : null;
        let todayTextTuesday = this.state.tuesday.current ? <p>Today</p> : null;
        let todayTextWednesday = this.state.wednesday.current ? <p>Today</p> : null;
        let todayTextThursday = this.state.thursday.current ? <p>Today</p> : null;
        let todayTextFriday = this.state.friday.current ? <p>Today</p> : null;

        let textOfHours = null;
        if(this.state.weekWorkedHours===this.state.expectedHours){
            textOfHours = <p> You have met the hours requirement of the week!</p>;
        } else if (this.state.weekWorkedHours<this.state.expectedHours){
            let dur1 = moment.duration(this.state.weekWorkedHours);
            let dur2 = moment.duration(this.state.expectedHours);

            dur2.subtract(dur1);
            console.log(dur2);

            const totalHours = dur2.days()*24 + dur2.hours();
            let totalMinutes = dur2.minutes();
            if(totalMinutes<10){
                totalMinutes = '0'+totalMinutes;
            }
            const stringToDisplay = `${totalHours}:${totalMinutes}`;


            textOfHours = <p> You have not met the hours requirement of the week
                by {stringToDisplay} hours
            </p>
        }else {
            let dur1 = moment.duration(this.state.weekWorkedHours);
            let dur2 = moment.duration(this.state.expectedHours);

            dur1.subtract(dur2);

            const totalHours = dur1.days()*24 + dur1.hours();
            let totalMinutes = dur1.minutes();
            if(totalMinutes<10){
                totalMinutes = '0'+totalMinutes;
            }
            const stringToDisplay = `${totalHours}:${totalMinutes}`;

            textOfHours = <p> You have surpassed the hours requirement of the week
                by {stringToDisplay} !
            </p>
        }

      return (
        <Aux>
                <div className={classes.div1}>
                </div>
                <h1 className={classes.textOfSelectDay}>Select the day you want to set the hours</h1>
                <div className={classes.theWeek}>
                    <Link to={{
                        pathname: '/day',
                        search: '?dayOfWeek=monday'
                    }} style={{textDecoration: 'none'}}>
                        <div style={{...mondayStyle}} className={classes.dayBox}>
                        <p> Monday </p> {todayTextMonday}
                        </div>
                    </Link>

                    <Link to={{
                        pathname: '/day',
                        search: '?dayOfWeek=tuesday'
                    }} style={{textDecoration: 'none'}}>
                        <div style={{...tuesdayStyle}} className={classes.dayBox}>
                            <p> Tuesday</p> {todayTextTuesday}
                        </div>
                    </Link>

                    <Link to={{
                        pathname: '/day',
                        search: '?dayOfWeek=wednesday'
                    }} style={{textDecoration: 'none'}}>
                        <div style={{...wednesdayStyle}} className={classes.dayBox}>
                        <p> Wednesday</p> {todayTextWednesday}
                        </div>
                    </Link>

                    <Link to={{
                        pathname: '/day',
                        search: '?dayOfWeek=thursday'
                    }} style={{textDecoration: 'none'}}>
                        <div style={{...thursdayStyle}} className={classes.dayBox}>
                        <p> Thursday</p> {todayTextThursday}
                        </div>
                    </Link>

                    <Link to={{
                        pathname: '/day',
                        search: '?dayOfWeek=friday'
                    }} style={{textDecoration: 'none'}}>
                        <div style={{...fridayStyle}} className={classes.dayBox}>
                        <p> Friday</p> {todayTextFriday}
                        </div>
                    </Link>
                </div>
                <div>
                <p> You have this amount of hours in total this week {this.state.weekWorkedHours}</p>
                <p> Amount expected hours this week: {this.state.expectedHours}</p>
                {textOfHours}
                
                </div>


        </Aux>
      );
    }
  }
  
  export default Week;