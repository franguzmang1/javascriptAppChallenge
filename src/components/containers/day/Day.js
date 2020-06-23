import React, { Component } from 'react';
import classes from './Day.module.css';
//import TimeField from 'react-simple-timefield';
import TimeField from 'react-simple-timefield';
import Aux from '../../hoc/auxiliary/auxiliary';
import * as firebase from 'firebase';

var moment = require('moment');

class Day extends Component {
    state = {
        arrivalTime: '08:00',
        leavingTime: '17:00',
        timeWorking: '00:00',
        validationText1: '',//text to display the validation of the first 2 inputs
        startOfLunch: '12:00',
        endOfLunch: '13:00',
        timeInLunch: '00:00',
        validationText2: '',//text to display the validation of the second two inputs
        expectedHours: '08:00',
        hoursBelow: 0, //hours below the expected hours
        hoursAbove: 0,//hours above the expected hours
        totalWorkedHours: '00:00'
    };

    //function to get the string of the day ('monday', 'tuesday', etc)
    getStringOfDay(){
        let stringDay;
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries())
        {
            if(param[0]==='dayOfWeek'){
                stringDay = param[1];
            }
        }
        return stringDay;
    }

    componentDidMount(){

        let stringDay = this.getStringOfDay();

        const rootRef = firebase.database().ref().child('week').child('days');
        
        const daReference = rootRef.child(stringDay);

        //getting the data from firebase depending on the day
        daReference.once('value', snap =>{
            //saving the data retrieved from the day to the state
            this.setState({arrivalTime: snap.val().arrivalTime,
                endOfLunch: snap.val().endOfLunch, leavingTime: snap.val().leavingTime,
                startOfLunch: snap.val().startOfLunch
            }, () =>{//setState callback function

        var date1 = new Date();
        var date2 = new Date();

        date2.setHours(this.state.leavingTime.substring(0,2), 
        this.state.leavingTime.substring(3,5),0);

        date1.setHours(this.state.arrivalTime.substring(0,2), 
        this.state.arrivalTime.substring(3,5),0);

        //calculate the time between arriving and leaving
        let end = moment(date2);
        let start = moment(date1);
        let diff = end.diff(start);
        let f = moment.utc(diff).format("HH:mm");
        if(diff<0){//if time is negative set it to 0
            diff=0;
            f = '00:00';
        }


        var date11 = new Date();
        var date22 = new Date();

        date22.setHours(this.state.endOfLunch.substring(0,2), 
        this.state.endOfLunch.substring(3,5),0);

        date11.setHours(this.state.startOfLunch.substring(0,2), 
        this.state.startOfLunch.substring(3,5),0);

        /*let result = date2-date1;
        console.log(result);
        */

        //calculate the time between start of lunch and end of lunch
        let end2 = moment(date22);
        let start2 = moment(date11);
        let diff2 = end2.diff(start2);
        let f2 = moment.utc(diff2).format("HH:mm");
        if(diff2<0){//if time is negative set it to 0
            diff2=0;
            f2='00:00';
        }

        //saving to the state both times
        this.setState({timeWorking: f,
        timeInLunch: f2});


        //calculate the actual worked hours
        let result = diff-diff2;
        
        if(result<0){
            //if the substraction of total time in work and time in lunch is less than 0 set it to 0 in the state
            this.setState({totalWorkedHours: '00:00'});
        } else {
            //save the actual time spent working to the state in 'totalWorkedHours'
        let fg = moment.utc(result).format("HH:mm");
        this.setState({totalWorkedHours: fg});
        }
            });
        });
    }

    //function to calculate the amount of worked Hours as the user inputs numbers
    calculateHours(arrivalTime1, leavingTime1, workingHoursIsValid, startLunch1, 
        endLunch1, lunchHoursIsValid){
        var date1 = new Date();
        var date2 = new Date();

        date2.setHours(leavingTime1.substring(0,2), 
        leavingTime1.substring(3,5),0);

        date1.setHours(arrivalTime1.substring(0,2), 
        arrivalTime1.substring(3,5),0);


        //calculate time between arriving time and leaving time at work
        let end = moment(date2);
        let start = moment(date1);
        let diff = end.diff(start);
        let f = moment.utc(diff).format("HH:mm");

        if (!workingHoursIsValid){//if there's nothing in validation text 1, set the value in the state normally
            this.setState({timeWorking: f});
        } else {//if there's something in validation text set the variables to null and set 'timeWorking' to '00:00'
            f=null;
            diff=null;
            this.setState({timeWorking: '00:00'});
        }

        //calculate time between start of lunch and end of lunch
        var date2Lunch = new Date();
        var date1Lunch = new Date();

        date2Lunch.setHours(endLunch1.substring(0,2), 
        endLunch1.substring(3,5),0);
        
        date1Lunch.setHours(startLunch1.substring(0,2), 
        startLunch1.substring(3,5),0);

        let end2 = moment(date2Lunch);
        let start2 = moment(date1Lunch);

        let diff2 = end2.diff(start2);
        let f2 = moment.utc(diff2).format("HH:mm");

        if (!lunchHoursIsValid){//if there's nothing in validation text 1, set the value in the state normally
            this.setState({timeInLunch: f2});
        } else {//if there's something in validation text set the variables to unll and set 'timeInLunch' to '00:00'
            f2= null;
            diff2= null;
            this.setState({timeInLunch: '00:00'});
        }

        //function to to the final saving to the state in the actual working hours
        this.totalWorkedHours(diff,diff2);
    }

    //function that complements calculateHours(), saving to the state the actual working hours.
    totalWorkedHours(diff, diff2){
        //the time between arriving and leaving, and time in lunch is received.
        if(diff==null || diff2==null ){
            //nothing can be calculated
            this.setState({totalWorkedHours: '00:00'});
            return;
        } else if (diff-diff2<0){//la resta de negativo
            this.setState({totalWorkedHours: '00:00'});
            return;
        } 
        
        //subtracting time between arrivign and leaving minus time in lunch (the actual worked hours)
        let laDiferencia = diff-diff2;
        let fg = moment.utc(laDiferencia).format("HH:mm");
    
        //saving to the state
        this.setState({totalWorkedHours: fg});
    }


    //handler when the arrival time changes
    arrivalTimeChanged(event){
            let textInValidation1;
            //checking if it is greater or less than leaving time
            if(event.target.value<=this.state.leavingTime){
                textInValidation1 = '';
                this.setState({arrivalTime: event.target.value, 
                    validationText1: textInValidation1});

            } else {//start time is greater than leaving time
                textInValidation1 = 'Start time is greater than leaving time';
                //setting in the state validation text and setting the arrival
                this.setState({arrivalTime: event.target.value,
                     validationText1: textInValidation1}); 
            }

            //function to calculate the worked hours
            this.calculateHours(event.target.value, this.state.leavingTime,
                textInValidation1,
                this.state.startOfLunch, this.state.endOfLunch, this.state.validationText2);
    }

    //handler when the leaving time changes
    leavingTimeChanged(event){
        let textInValidation1;
        //checking if it is less or greater than arrival time
        if(event.target.value>=this.state.arrivalTime){
            textInValidation1 = '';//validation text is nothing
            this.setState({leavingTime: event.target.value, 
                validationText1: textInValidation1});
        } else {//leaving time is less than arrival time
            textInValidation1 = 'Start time is greater than leaving time';
            //saving to the state validation and value of leaving time
            this.setState({leavingTime: event.target.value, 
                validationText1: textInValidation1})
        }

        //function to calculate the worked hours
        this.calculateHours(this.state.arrivalTime, event.target.value,
            textInValidation1,
            this.state.startOfLunch, this.state.endOfLunch, this.state.validationText2);
    }

    //handler when the start lunch changes
    startLunchChanged(event){
        let textInValidation2;
        //checking if start lunch time is greater or less than end of lunch
        if(event.target.value<=this.state.endOfLunch){
            textInValidation2 = '';
            this.setState({startOfLunch: event.target.value, 
                validationText2:textInValidation2});
        } else {
            textInValidation2 = 'Start time is greater than end of time';
            //setting to the state the validation text and time
            this.setState({startOfLunch: event.target.value,
            validationText2: textInValidation2});
        }

        //function to calculate the worked hours
        this.calculateHours(this.state.arrivalTime, this.state.leavingTime,
            this.state.validationText1,
            event.target.value, this.state.endOfLunch, textInValidation2);
    }

    //handler when the end of lunch changes
    endLunchChanged(event){
        let textInValidation2;
        //checking if end of lunch is less or greater than start of lunch
        if(event.target.value>=this.state.startOfLunch){
            textInValidation2 = '';
            this.setState({endOfLunch: event.target.value,
            validationText2: textInValidation2});
        } else {
            textInValidation2 = 'Start time is greater than end of time';
            //settint the validation text and value of the time in the state
            this.setState({endOfLunch: event.target.value,
            validationText2: textInValidation2});
        }
        //function to calculate the worked hours
        this.calculateHours(this.state.arrivalTime, this.state.leavingTime,
            this.state.validationText1,
            this.state.startOfLunch, event.target.value, textInValidation2);
    }

    //when clicking the submit button
    clickedButton = () => {
        const stringDay = this.getStringOfDay();
        //saving to firebase in the corresponding day
        firebase.database().ref('week/days/'+stringDay).set({
            arrivalTime: this.state.arrivalTime,
            leavingTime: this.state.leavingTime,
            startOfLunch: this.state.startOfLunch,
            endOfLunch: this.state.endOfLunch,
            totalWorkedHours: this.state.totalWorkedHours
        });
    }

    render(){
        const savedString = this.getStringOfDay();
        let stringDay=savedString.charAt(0).toUpperCase()+savedString.slice(1);

        //validation text before the first 2 inputs
        let validationP1= this.state.validationText1 ? 
        <p className={classes.validationText}> {this.state.validationText1}</p> : 
        <p className={classes.informationText}>Time is inputted in 24-hour format </p>;

        //validation text before the second 2 inputs
        let validationP2 = this.state.validationText2 ? 
        <p className={classes.validationText}> {this.state.validationText2}</p> :
        null;

        //text displaying whether or not the hour requirement is met for the day
        let textToDisplay;
        if(this.state.totalWorkedHours === this.state.expectedHours){//the expected hours and the worked hours are equal
            textToDisplay = <p> You meet today's hours requirement! </p>;
        } else if (this.state.totalWorkedHours > this.state.expectedHours){//the worked hours are greater than the expected hours
            
        //calculating the difference between worked hours and expected hours
        var date1 = new Date();
        var date2 = new Date();

        date2.setHours(this.state.totalWorkedHours.substring(0,2), 
        this.state.totalWorkedHours.substring(3,5),0);

        date1.setHours(this.state.expectedHours.substring(0,2), 
        this.state.expectedHours.substring(3,5),0);

        //calculate difference of working hours
        let end = moment(date2);
        let start = moment(date1);
        let diff = end.diff(start);
        let f = moment.utc(diff).format("HH:mm");

        textToDisplay = <p>You surpassed today's hours requirement by {f} hours!! </p>;
        }else {//the hours requirement was not met

        var date1 = new Date();
        var date2 = new Date();

        date2.setHours(this.state.totalWorkedHours.substring(0,2), 
        this.state.totalWorkedHours.substring(3,5),0);

        date1.setHours(this.state.expectedHours.substring(0,2), 
        this.state.expectedHours.substring(3,5),0);

        //calculate difference of working hours
        let end = moment(date2);
        let start = moment(date1);
        let diff = start.diff(end);
        let f = moment.utc(diff).format("HH:mm");

        textToDisplay = <p>You did not meet today's hours requirement, there 
        are {f} hours left to complete on this day</p>;
        }

        //disabling the button if there's validation text in one of the 2 groups of inputs
        let buttonIsDisabled;
        if (this.state.validationText1 || this.state.validationText2){
            buttonIsDisabled = true;
        }

      return (
        <Aux>
            <div className={classes.div1}>
            </div>
            
            <h2>Day of the week selected: {stringDay}</h2>
            
            <div className={classes.divOfTimes}>
                {validationP1}
                <div className={classes.divInput}>
                    <p>Time of arrival</p>
                
                    <TimeField ref={this.laReference} class={classes.timeFieldStyle} value={this.state.arrivalTime} onChange={(value) => this.arrivalTimeChanged(value)}/>
                </div>

                <div className={classes.divInput}>
                    <p>Time of leaving</p>

                    <TimeField class={classes.timeFieldStyle} value={this.state.leavingTime} onChange={(value) => this.leavingTimeChanged(value)}/>
                </div>
            </div>

            <div className={classes.divOfTimes}>
            {validationP2}
                <div className={classes.divInput}>
                    <p>Start of lunch</p>

                    <div >
                    <TimeField class={classes.timeFieldStyle} value={this.state.startOfLunch} onChange={(value) => this.startLunchChanged(value)}/>
                    </div>
                </div>

                <div className={classes.divInput}>
                    <p>End of lunch</p>

                    <div >
                    <TimeField class={classes.timeFieldStyle} value={this.state.endOfLunch} onChange={(value) => this.endLunchChanged(value)}/>
                    </div>
                </div>
            </div>

            <button disabled={buttonIsDisabled} onClick={this.clickedButton} class={classes.submitButton}>SUBMIT</button>

            <div className={classes.nextDiv}>
                <h2>Expected hours: {this.state.expectedHours.substring(1,2)}</h2>
                <p> Worked hours: {this.state.totalWorkedHours}</p>
                {textToDisplay}
            </div>
        </Aux>
      );
    }
  }
  
  export default Day;