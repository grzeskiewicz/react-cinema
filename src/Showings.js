import React from 'react';
import './Showings.css';
import moment from 'moment';
import Films from './Films';
import io from 'socket.io-client';





import { API_URL, request } from './apiconnection.js';

const socket = io('https://cinema-node.herokuapp.com');
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
class Showings extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.scrollLeft=this.scrollLeft.bind(this);
    }

    scrollLeft(){
        this.props.scrollLeft();
    }
    

    seatsTakenSocket(msg) {
        if (this.props.selectedShowing.id === msg.ticket.showing) {
            this.handleSelectedShowing(this.props.selectedShowing, msg.ticket.email);
        }
    }

    componentDidMount() {
        socket.on('seatstakennow2', (msg => this.seatsTakenSocket(msg)));
    }

    componentWillUnmount(){
        socket.off('seatstakennow2', (msg => this.seatsTakenSocket(msg)));

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
                showcopy.fullDate = this.dateParser(showcopy.date, 'L');
                showcopy.date = this.dateParser(showcopy.date, 'HH:mm');

                result.push(showcopy);
            }
        }
        return result;
    }


    handleSelectedShowing(showing, username) { //gets seats which are taken already
        fetch(request(`${API_URL}seatstaken/${showing.id}`, 'GET'))
            .then(res => res.json())
            .then(result => {
                console.log(username)
                if (username===undefined) {
                    this.props.handleSelectedShowing(showing, result, username)
                } else {
                    this.props.handleSelectedShowingSocket(showing, result, username);

                }

            });

    }

    render() {
        const showingsOfTheDay = this.showingsOfTheDay(this.props.selectedDay, this.props.showings); //taking showings from selected day => array
        this.sortShowings(showingsOfTheDay); //sorting them
        const readyShowings = this.groupShowings(showingsOfTheDay); //groupping them and returning object to work with
        return (
            <div id="showing-selection" className={this.props.className}>
                {readyShowings.filmTitles.length > 0 ? <Films readyShowings={readyShowings} handleSelectedShowing={this.handleSelectedShowing} selectedShowing={this.props.selectedShowing} scrollLeft={this.props.scrollLeft} /> : <p id="no-showings-info">Unfortunately there are no showings today.</p>}
            </div>

        );

    }
}

export default Showings;