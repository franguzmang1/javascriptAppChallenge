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
        validationText1: '',
        startOfLunch: '12:00',
        endOfLunch: '13:00',
        timeInLunch: '00:00',
        validationText2: '',
        expectedHours: '08:00',
        hoursBelow: 0,
        hoursAbove: 0,
        totalWorkedHours: '00:00'
    };

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

        daReference.once('value', snap =>{
            console.log(snap.val().arrivalTime);
            this.setState({arrivalTime: snap.val().arrivalTime,
                endOfLunch: snap.val().endOfLunch, leavingTime: snap.val().leavingTime,
                startOfLunch: snap.val().startOfLunch
            }, () =>{

        var date1 = new Date();
        var date2 = new Date();

        date2.setHours(this.state.leavingTime.substring(0,2), 
        this.state.leavingTime.substring(3,5),0);

        date1.setHours(this.state.arrivalTime.substring(0,2), 
        this.state.arrivalTime.substring(3,5),0);

        /*let result = date2-date1;
        console.log(result);
        */

        //calculate difference of working hours
        let end = moment(date2);
        let start = moment(date1);
        let diff = end.diff(start);
        let f = moment.utc(diff).format("HH:mm");
        if(diff<0){
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

        //calculate difference of working hours
        let end2 = moment(date22);
        let start2 = moment(date11);
        let diff2 = end2.diff(start2);
        let f2 = moment.utc(diff2).format("HH:mm");
        if(diff2<0){
            diff2=0;
            f2='00:00';
        }

        this.setState({timeWorking: f,
        timeInLunch: f2});


        //calculo de las horas trabajadas
        let result = diff-diff2;
        
        if(result<0){
            //if the substraction of total time in work and time in lunch is less than 0
            this.setState({totalWorkedHours: '00:00'});
        } else {
        let fg = moment.utc(result).format("HH:mm");
        this.setState({totalWorkedHours: fg});
        }
            });
        });
        
    }

    getHour(time){
        console.log(time.substring(0,1));
        return time.substring(0,1);
    }

    calculateHours(arrivalTime1, leavingTime1, workingHoursIsValid, startLunch1, 
        endLunch1, lunchHoursIsValid){
        var date1 = new Date();
        var date2 = new Date();

        date2.setHours(leavingTime1.substring(0,2), 
        leavingTime1.substring(3,5),0);

        date1.setHours(arrivalTime1.substring(0,2), 
        arrivalTime1.substring(3,5),0);

        /*let result = date2-date1;
        console.log(result);
        */

        //calculate difference of working hours
        let end = moment(date2);
        let start = moment(date1);
        let diff = end.diff(start);
        let f = moment.utc(diff).format("HH:mm");

        if (!workingHoursIsValid){//if there's nothing in validation text 1
            this.setState({timeWorking: f});
        } else {
            f=null;
            diff=null;
            this.setState({timeWorking: '00:00'});
        }

        //calculate difference of lunch hours
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

        if (!lunchHoursIsValid){//if there's nothing in validation text 1
            this.setState({timeInLunch: f2});
        } else {
            f2= null;
            this.setState({timeInLunch: '00:00'});
            diff2= null;
        }

        //console.log(`diff: ${diff} diff2: ${diff2}`);
        this.totalWorkedHours(diff,diff2);


    }

    totalWorkedHours(diff, diff2){
        //the time between start and end time and time in lunch is received.
        if(diff==null || diff2==null ){
            //nothing can be calculated
            this.setState({totalWorkedHours: '00:00'});
            return;
        } else if (diff-diff2<0){//la resta de negativo
            this.setState({totalWorkedHours: '00:00'});
            return;
        } 
        //let difference = workingHours.diff(timeInLunch);
        


        let laDiferencia = diff-diff2;
        let fg = moment.utc(laDiferencia).format("HH:mm");
    
        this.setState({totalWorkedHours: fg});

        /*
        console.log('m'+workingHours2)

        let difference = workingHours2.diff(timeInLunch2);
        let g2 = moment.utc(difference).format("HH:mm");
        console.log('the difference: '+g2);

        */
        //console.log('the diffenrece: '+difference);
    }


    arrivalTimeChanged(event){
            let textInValidation1;
            if(event.target.value<=this.state.leavingTime){
                textInValidation1 = '';
                this.setState({arrivalTime: event.target.value, 
                    validationText1: textInValidation1});

            } else {//start time is equal or greater than leaving time
                textInValidation1 = 'Start time is greater than leaving time'
                this.setState({arrivalTime: event.target.value,
                     validationText1: textInValidation1}); 
               // this.setState({validationText1: 'Start time is greater than leaving time'});
            }

            this.calculateHours(event.target.value, this.state.leavingTime,
                textInValidation1,
                this.state.startOfLunch, this.state.endOfLunch, this.state.validationText2);
    }

    leavingTimeChanged(event){
        let textInValidation1;
        this.setState({leavingTime: event.target.value});
        if(event.target.value>=this.state.arrivalTime){
            textInValidation1 = '';
            this.setState({leavingTime: event.target.value, 
                validationText1: textInValidation1});
        } else {
            textInValidation1 = 'Start time is greater than leaving time';
            this.setState({leavingTime: event.target.value, 
                validationText1: textInValidation1})
        }

        this.calculateHours(this.state.arrivalTime, event.target.value,
            textInValidation1,
            this.state.startOfLunch, this.state.endOfLunch, this.state.validationText2);
    }

    startLunchChanged(event){
        let textInValidation2;
        this.setState({startOfLunch: event.target.value});
        if(event.target.value<=this.state.endOfLunch){
            textInValidation2 = '';
            this.setState({startOfLunch: event.target.value, 
                validationText2:textInValidation2});
        } else {
            textInValidation2 = 'Start time is greater than end of time';
            this.setState({startOfLunch: event.target.value,
            validationText2: textInValidation2});
        }

        this.calculateHours(this.state.arrivalTime, this.state.leavingTime,
            this.state.validationText1,
            event.target.value, this.state.endOfLunch, textInValidation2);
    }

    endLunchChanged(event){
        let textInValidation2;
        this.setState({endOfLunch: event.target.value});
        if(event.target.value>=this.state.startOfLunch){
            textInValidation2 = '';
            this.setState({endOfLunch: event.target.value,
            validationText2: textInValidation2});
        } else {
            textInValidation2 = 'Start time is greater than end of time';
            this.setState({endOfLunch: event.target.value,
            validationText2: textInValidation2});
        }
        this.calculateHours(this.state.arrivalTime, this.state.leavingTime,
            this.state.validationText1,
            this.state.startOfLunch, event.target.value, textInValidation2);
    }

    //when clicking the submit button
    clickedButton = () => {
        const stringDay = this.getStringOfDay();
        firebase.database().ref('week/days/'+stringDay).set({
            arrivalTime: this.state.arrivalTime,
            leavingTime: this.state.leavingTime,
            startOfLunch: this.state.startOfLunch,
            endOfLunch: this.state.endOfLunch,
            totalWorkedHours: this.state.totalWorkedHours
        });
    }

    render(){
        //recomendation to read only from props and state in render
        const savedString = this.getStringOfDay();
        let stringDay=savedString.charAt(0).toUpperCase()+savedString.slice(1);

        //validation texts
        let validationP1= this.state.validationText1 ? 
        <p className={classes.validationText}> {this.state.validationText1}</p> : 
        <p className={classes.informationText}>Time is inputted in 24-hour format </p>;

        
        let validationP2 = this.state.validationText2 ? 
        <p className={classes.validationText}> {this.state.validationText2}</p> :
        null;

        let textToDisplay;
        if(this.state.totalWorkedHours === this.state.expectedHours){
            textToDisplay = <p> You meet the hours requirement! </p>;
        } else if (this.state.totalWorkedHours > this.state.expectedHours){
            //restar y ver cuanto tiempo sobra 

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

        textToDisplay = <p>You surpassed the hours requirement by {f} hours!! </p>;
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

        textToDisplay = <p>You did not meet the hours requirement, there 
        are {f} hours left to complete on this day</p>;
        }
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