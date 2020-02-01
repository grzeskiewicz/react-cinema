import React from 'react';
import './Seats.css';
import Seat from './Seat'

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
            let tempSeat = { cName: '' };

            if (this.props.seatsState.length > 0) {
                for (const state of this.state.seatsState) {
                    if (state.number === i) tempSeat = state;
                }
            }

            if (i % 10) {
                row.push(<Seat seatsHandler={this.handleSeats} key={i} className={tempSeat.cName} n={i} />);
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
            <div id="seats">{wholeRender}</div>
        );

    }
}





export default Seats;