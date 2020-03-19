import React from 'react';
import './Showings.css';
import moment from 'moment';
import Films from './Films';
import io from 'socket.io-client';



import { API_URL, request } from './apiconnection.js';

const socket = io('https://cinema-node.herokuapp.com');

class Showings extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.state = { selectedShowing: '', readyShowings: '' };
    }


    seatsTakenSocket(msg) {
        console.log(this.props);
        if (this.state.selectedShowing.id === msg.ticket.showing) {
            this.handleSelectedShowing(this.state.selectedShowing, msg.ticket.email);
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
        this.setState({ selectedShowing: showing });
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
            <div>
                {readyShowings !== '' ? <Films readyShowings={readyShowings} handleSelectedShowing={this.handleSelectedShowing} /> : ''}
            </div>

        );

    }
}

export default Showings;