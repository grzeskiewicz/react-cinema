import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment';
import Calendar from './Calendar';
import Calendar2 from './Calendar2';
import Showings from './Showings';
import Summary from './Summary'
import Seats from './Seats'
import Tickets from './Tickets'
import io from 'socket.io-client';
import { API_URL, request } from './apiconnection.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons'

//console.log = function() {} //removing console.log comments



const socket = io('https://cinema-node.herokuapp.com');

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showings: '', selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', tickets: '', wrapShowingSelection: false };
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.handleSelectedSeats = this.handleSelectedSeats.bind(this);
        this.resetOrder = this.resetOrder.bind(this);
        this.resetSeatsState = this.resetSeatsState.bind(this);
        this.handleSelectedShowingSocket = this.handleSelectedShowingSocket.bind(this);
        this.showCalAgain = this.showCalAgain.bind(this);
        this.wrapShowingSelection = this.wrapShowingSelection.bind(this);
        this.showShowingSelectionAgain = this.showShowingSelectionAgain.bind(this);
    }

    componentDidMount() {
        fetch(request(API_URL + "showings", 'GET'))
            .then(res => res.json())
            .then(showings => {
                this.setState({ showings: showings })
            });
    }

    resetSeatsState(showing) {
        const seats = showing.seats;
        const seatsState = [];
        seatsState[0] = "dummy";
        for (let i = 1; i <= seats; i++) {
            seatsState.push({ number: i, cName: '', disabled: false });
        }
        return seatsState;
    }

    handleDaySelection(day) {
        this.setState({ selectedDay: day, selectedShowing: '', selectedSeats: [], tickets: '' });
    }


    handleSelectedShowing(showing, seatsTaken, username) {
        console.log("z wyboru showing", username)
        this.setState({ selectedShowing: showing, seatsTaken: seatsTaken, selectedSeats: [], seatsState: this.resetSeatsState(showing) });
    }


    handleSelectedShowingSocket(seatsTaken) {
        this.setState({ seatsTaken: seatsTaken })
    }

    handleSelectedSeats(selectedSeats) {
        this.setState({ selectedSeats: selectedSeats });
    }


    resetOrder(tickets) {
        console.log(this.state.showings);
        this.setState({
            selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', userLogged: '',
            tickets: tickets, lastOrderedShowing: this.state.selectedShowing, wrapShowingSelection: false
        }); //userLogged:username
    }

    showCalAgain() {
        this.setState({ selectedShowing: '' });
    }

    showShowingSelectionAgain() {
        this.setState({ wrapShowingSelection: false })

    }


    wrapShowingSelection() {
        this.setState({ wrapShowingSelection: true })
    }


    render() {
        return (
            <div id="main-panel">
                <Calendar2 onDaySelection={this.handleDaySelection} className={this.state.selectedShowing !== '' ? "wrapped" : ''} />
                {this.state.selectedShowing !== '' ?
                    <div id="cal-icon">
                        <i onClick={this.showCalAgain} className="fa fa-calendar"></i>
                        <p>{moment(this.state.selectedDay).format('DD-MM-YYYY')}</p>
                    </div> : ''}


                {(this.state.showings.length > 0 && this.state.selectedDay !== '') ?
                    <Showings className={this.state.wrapShowingSelection ? "wrapped" : ''} selectedDay={this.state.selectedDay} showings={this.state.showings} handleSelectedShowing={this.handleSelectedShowing} handleSelectedShowingSocket={this.handleSelectedShowingSocket} /> : ''}
                {this.state.wrapShowingSelection ?
                    <div id="showing-icon">
                        <i onClick={this.showShowingSelectionAgain} className="fa fa-film"></i>
                        <p>{this.state.selectedShowing.title}</p>
                    </div> : ''}


                {this.state.selectedShowing !== '' ?
                    <Seats showing={this.state.selectedShowing} seatsState={this.state.seatsState} seatsTaken={this.state.seatsTaken} handleSelectedSeats={this.handleSelectedSeats} />
                    : ''}

                    

                {this.state.selectedSeats !== '' && this.state.selectedSeats.length > 0 ?
                    <Summary wrapShowingSelection={this.wrapShowingSelection} seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} resetOrder={this.resetOrder} /> : ''}
                {this.state.tickets !== '' ? <Tickets tickets={this.state.tickets} lastOS={this.state.lastOrderedShowing} /> : ''}
            </div>
        );


    }

}


ReactDOM.render(<Board />, document.getElementById('root'));

export default socket;