import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calendar from './Calendar';
import Showings from './Showings';
import Summary from './Summary'
import Seats from './Seats'
import Tickets from './Tickets'
import io from 'socket.io-client';
import { API_URL, request } from './apiconnection.js';
//console.log = function() {} //removing console.log comments



const socket = io('https://cinema-node.herokuapp.com');

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showings: '', selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '',tickets:'' };
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.handleSelectedSeats = this.handleSelectedSeats.bind(this);
        this.resetOrder = this.resetOrder.bind(this);
        this.resetSeatsState = this.resetSeatsState.bind(this);
        this.handleSelectedShowingSocket = this.handleSelectedShowingSocket.bind(this);
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
        this.setState({ selectedDay: day, selectedShowing: '', selectedSeats: [],tickets:'' });
    }


    handleSelectedShowing(showing, seatsTaken, username) {
        console.log("z wyboru showing", username)
        this.setState({ selectedShowing: showing, seatsTaken: seatsTaken, selectedSeats: [], seatsState: this.resetSeatsState(showing) });
    }


    handleSelectedShowingSocket(showing, seatsTaken, username) {
        this.setState({ seatsTaken: seatsTaken })
    }

    handleSelectedSeats(selectedSeats) {
        this.setState({ selectedSeats: selectedSeats });
    }


    resetOrder(tickets) {
        console.log(this.state.showings);
        this.setState({ selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', userLogged: '', tickets:tickets,lastOrderedShowing:this.state.selectedShowing }); //userLogged:username
    }


    render() { //PUT FILMS AFTER SHOWINGS
        return (
<div id="board">
            <div id="main-panel">
                <Calendar onDaySelection={this.handleDaySelection} />
                {(this.state.showings.length > 0 && this.state.selectedDay !== '') ?
                    <Showings selectedDay={this.state.selectedDay} showings={this.state.showings} handleSelectedShowing={this.handleSelectedShowing} handleSelectedShowingSocket={this.handleSelectedShowingSocket} /> : ''}

                {this.state.selectedShowing !== '' ?
                    <Seats showing={this.state.selectedShowing} seatsState={this.state.seatsState} seatsTaken={this.state.seatsTaken} handleSelectedSeats={this.handleSelectedSeats} />
                    : ''}

                {this.state.selectedSeats !== '' && this.state.selectedSeats.length > 0 ?
                    <Summary seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} resetOrder={this.resetOrder} /> : ''}
                    {this.state.tickets !== '' ? <Tickets tickets={this.state.tickets} lastOS={this.state.lastOrderedShowing} />:''} 
            </div>
            </div>
        );


    }

}


ReactDOM.render(<Board />, document.getElementById('root'));

export default socket;