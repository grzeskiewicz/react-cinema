import React from 'react';
import './Showings.css';
import moment from 'moment';
import Films from './Films';

import { API_URL, request } from './apiconnection.js';

class Showings extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.state = { selectedShowing: '', readyShowings: '' };
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


    handleSelectedShowing(showing) { //gets seats which are taken already
        console.log(showing.title);
        this.setState({selectedShowing: showing});
        fetch(request(`${API_URL}seatstaken/${showing.id}`, 'GET'))
            .then(res => res.json())
            .then(result => {
                this.props.handleSelectedShowing(showing, result);
            }); 

    }

    render() {  
        const showingsOfTheDay = this.showingsOfTheDay(this.props.selectedDay, this.props.showings); //taking showings from selected day => array
        this.sortShowings(showingsOfTheDay); //sorting them
        const readyShowings = this.groupShowings(showingsOfTheDay); //groupping them and returning object to work with
        return (
            <div>
                {readyShowings !== '' ? <Films titlePicked={this.state.selectedShowing.title} readyShowings={readyShowings} handleSelectedShowing={this.handleSelectedShowing} /> : ''}
            </div>

        );

    }
}

export default Showings;