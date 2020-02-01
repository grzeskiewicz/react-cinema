import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calendar from './Calendar';
import Showings from './Showings';
import Summary from './Summary'
import moment from 'moment';

//import { authServices } from './services.js';
import { API_URL, request } from './apiconnection.js';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showings: '', selectedDay: '', selectedSeats: '', selectedShowing: '' };
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleSummary = this.handleSummary.bind(this);

    }

    componentDidMount() {
        console.log(moment.now());
        fetch(request(API_URL + "showings", 'GET'))
            .then(res => res.json())
            .then(showings => {
                this.setState({ showings: showings })
            });
    }

    handleDaySelection(day) {
        this.setState({ selectedDay: day });
    }


    handleSummary(orderInfo) {
        this.setState({ selectedSeats: orderInfo.selectedSeats, selectedShowing: orderInfo.selectedShowing });
    }

    render() {
        return (
            <div>
                <Calendar onDaySelection={this.handleDaySelection} />
                {this.state.showings.length > 0 ?
                    <Showings selectedDay={this.state.selectedDay} showings={this.state.showings} handleSummary={this.handleSummary} /> : ''}
            <Summary seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} />
            </div>

        );


    }

}


ReactDOM.render(<Board />, document.getElementById('root'));


