import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calendar from './Calendar';
import Showings from './Showings';
import Summary from './Summary'
import Seats from './Seats'
import { API_URL, request } from './apiconnection.js';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showings: '', selectedDay: '', selectedDayPast: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', showUser: false };
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.handleSummary = this.handleSummary.bind(this);
        this.handleOrder = this.handleOrder.bind(this);
        this.resetSeatsState = this.resetSeatsState.bind(this);
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
        for (let i = 1; i <= seats; i++) {
            seatsState.push({ number: i, cName: '', disabled: false });
        }
        return seatsState;
    }

    handleDaySelection(day) {
        this.setState({ selectedDay: day, selectedDayPast: this.state.selectedDay ? this.state.selectedDay : '', selectedShowing: '', selectedSeats: '', dayChange: true });
        console.log(this.state);
    }


    handleSelectedShowing(showing, seatsTaken) {
        this.setState({ selectedShowing: showing, seatsTaken: seatsTaken, selectedSeats: [], ss2: this.resetSeatsState(showing) });
        console.log(this.state);
    }


    handleSummary(selectedSeats, ss2) {
        this.setState({ selectedSeats: selectedSeats, ss2 });
    }

    handleOrder() {
        this.setState({ showUser: true });
    }

    render() {
        return (

            <div>
                <Calendar onDaySelection={this.handleDaySelection} />
                {(this.state.showings.length > 0 && this.state.selectedDay !== '') ?
                    <Showings selectedDay={this.state.selectedDay} showings={this.state.showings} handleSelectedShowing={this.handleSelectedShowing} /> : ''}
                {this.state.selectedShowing ?
                    <Seats showing={this.state.selectedShowing} selectedSeatsHandler={this.selectedSeatsHandler} seatsState={this.state.ss2} seatsTaken={this.state.seatsTaken} handleSummary={this.handleSummary} />
                    : ''}

                {this.state.selectedSeats !== '' && this.state.selectedSeats.length > 0 ?
                    <Summary seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} handleOrder={this.handleOrder} /> : ''}

            </div>

        );


    }

}


ReactDOM.render(<Board />, document.getElementById('root'));