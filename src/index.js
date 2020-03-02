import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calendar from './Calendar';
import Showings from './Showings';
import Summary from './Summary'
import User from './User'
import moment from 'moment';

import { authServices } from './services.js';
import { API_URL, request, headers } from './apiconnection.js';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showings: '', selectedDay: '', selectedSeats: '', selectedShowing: '', showUser: false };
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleSummary = this.handleSummary.bind(this);
        this.handleOrder = this.handleOrder.bind(this);
    }

    componentDidMount() {
        fetch(request(API_URL + "showings", 'GET'))
            .then(res => res.json())
            .then(showings => {
                this.setState({ showings: showings })
            });
    }

    handleDaySelection(day) {
        console.log(day);
         this.setState({ selectedDay: day, selectedShowing: '', selectedSeats: '' });
    }


    handleSummary(orderInfo) {
        this.setState({ selectedSeats: orderInfo.selectedSeats, selectedShowing: orderInfo.selectedShowing });
    }

    handleOrder() {
        this.setState({ showUser: true });
    }

    render() {
        console.log(this.state);
        return (

            <div>
                <Calendar onDaySelection={this.handleDaySelection} />
                {(this.state.showings.length > 0 && this.state.selectedDay !== '') ?
                    <Showings selectedDay={this.state.selectedDay} showings={this.state.showings} handleSummary={this.handleSummary} selectedShowing={this.selectedShowing} /> : ''}
                {this.state.selectedSeats !== '' && this.state.selectedSeats.length > 0 ?
                    <Summary seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} handleOrder={this.handleOrder} /> : ''}

            </div>

        );


    }

}


ReactDOM.render(<Board />, document.getElementById('root'));