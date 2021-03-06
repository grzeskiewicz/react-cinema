import React from 'react';
import './Seats.css';
import Seat from './Seat'
import { API_URL, request, headers } from './apiconnection.js';


class Seats extends React.Component {
    constructor(props) {
        super(props);
        this.handleSeats = this.handleSeats.bind(this);
    }



    handleSeats(n) {
        let selectedSeatsTemp = false;
        if (this.props.seatsState !== undefined && this.props.seatsState !== false) { selectedSeatsTemp = this.props.seatsState; }
        if (selectedSeatsTemp) {
            let seatToRemoveIndex = this.props.seatsState.findIndex(element => element.number === n);
            if (seatToRemoveIndex !== -1) {
                selectedSeatsTemp.splice(seatToRemoveIndex, 1);
                this.props.selectedSeatsHandler(selectedSeatsTemp);
            } else {
                let selectedSeatsTemp = this.props.seatsState;
                console.log(this.props.seatsState);
                selectedSeatsTemp.push({ number: n, cName: 'selected' });
                this.props.selectedSeatsHandler(selectedSeatsTemp);
                this.setState({ seatsState: selectedSeatsTemp });

            }
        }

    }

    render() {
        const seats = this.props.showing.seats;
        const seatsRender = [];
        let row = [];

        for (let i = 1; i <= seats; i++) {
            let tempSeat = { cName: '', disabled: false };
            for (const seat of this.props.seatsTaken) {
                if (i == seat) {
                    tempSeat.cName = tempSeat.cName + ' taken';
                    tempSeat.disabled = true;

                }

            }

            if (this.props.seatsState.length > 0) {
                for (const state of this.state.seatsState) {
                    if (state.number === i) tempSeat = state;
                }
            }

            if (i % 10) {
                row.push(<Seat seatsHandler={this.handleSeats} key={i} className={tempSeat.cName} disabled={tempSeat.disabled} n={i} />);
            } else {
                row.push(<Seat seatsHandler={this.handleSeats} key={i} n={i} className={tempSeat.cName} />);
                seatsRender.push(row);
                row = [];
            }

        }

        const wholeRender = seatsRender.map((row, index) => {
            return <div className="row" key={index}>{row}</div>;
        });


        return (
            <div>{this.props.seatsTaken !== '' ? <div id="seats">{wholeRender}</div> : ''}</div>
        );

    }
}





export default Seats;