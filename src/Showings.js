import React from 'react';
import ReactDOM from 'react-dom';
import './Showings.css';
import moment from 'moment';
import Films from './Films';
import Seats from './Seats'
import { API_URL, request, headers } from './apiconnection.js';

class Showings extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.selectedSeatsHandler = this.selectedSeatsHandler.bind(this);
        this.state = { selectedShowing: '', selectedSeats: [], readyShowings: '' };

    }


    componentDidMount() {
        console.log(this.props.selectedDay);

    }


    dateParser(stringdate, format) { //redundant?
        return moment(stringdate).format(format);
    }
    sortShowings(sList) {
        sList = sList.sort((a, b) => {
            return moment(a.date, "HH:mm") - moment(b.date, "HH:mm");
        });
    }
    groupShowings(sList) {
        const groupedByTitle = [];
        const titleList = [];

        for (const showing of sList) { //putting showings by the titles' names
            if (groupedByTitle[showing['title']] === undefined) groupedByTitle[showing['title']] = [];
            groupedByTitle[showing['title']].push(showing);
        }

        for (let key in groupedByTitle) { //making list of film titles
            titleList.push(key);
        }

        return {
            'filmTitles': titleList, //REDUNDANT??
            'showingsGrouped': groupedByTitle
        }; //ready list of titles and showings grouped by titles
    }
    showingsOfTheDay(pickedDate, sList) {
        const parsedPickedDate = this.dateParser(pickedDate, 'YYYY-MM-DD');
        const result = [];

        for (const showingElem of sList) { //selecting showings from picked date and adding to array
            if (showingElem.date.includes(parsedPickedDate)) {
                let showcopy = JSON.parse(JSON.stringify(showingElem));
                showcopy.date = this.dateParser(showcopy.date, 'HH:mm');
                result.push(showcopy);
            }
        }
        return result;
    }


    handleSelectedShowing(showing) {
        fetch(request(`${API_URL}seatstaken/${showing.id}`, 'GET'))
            .then(res => res.json()).
            then(result => this.setState({ selectedShowing: showing, selectedSeats: [], seatsTaken: result })); //gotta reset Seats when showing is selected );

    }

    selectedSeatsHandler(selectedSeats) {
        let seatsList = [];
        for (const obj of selectedSeats) {
            seatsList.push(obj.number);
        }
        this.setState({ seatsArray: seatsList });
        this.props.handleSummary(this.state);

    }


    render() {  //sprawdzic dlaczego seats nie resetuje sie po kliknieciu na godzine seansu
        const showingsOfTheDay = this.showingsOfTheDay(this.props.selectedDay, this.props.showings); //taking showings from selected day => array
        this.sortShowings(showingsOfTheDay); //sorting them
        const readyShowings = this.groupShowings(showingsOfTheDay); //groupping them and returning object to work with
        console.log(this.state);
        return (
            <div>
                {readyShowings !== '' ? <Films readyShowings={readyShowings} handleSelectedShowing={this.handleSelectedShowing} /> : ''}
                {this.state.selectedShowing !== '' ? //dodatkowy warunek
                    <Seats showing={this.state.selectedShowing} selectedSeatsHandler={this.selectedSeatsHandler} seatsState={this.state.selectedSeats} seatsTaken={this.state.seatsTaken} /> : ''}
            </div>

        );

    }
}

export default Showings;