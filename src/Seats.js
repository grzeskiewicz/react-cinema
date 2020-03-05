import React from 'react';
import './Seats.css';
import Seat from './Seat'

class Seats extends React.Component {
    constructor(props) {
        super(props);
        this.state = { seatsState: [] }
        this.handleSeats = this.handleSeats.bind(this);
    }

    handleSeats(n) { //OGARCNAC TUTAj!!!!!!!!!!
        console.log(this.state.seatsState);
        let selectedSeatsTemp = false;
        if (this.state.seatsState !== undefined && this.state.seatsState !== false) { selectedSeatsTemp = this.state.seatsState; }
        if (selectedSeatsTemp) {
            let seatToRemoveIndex = this.state.seatsState.findIndex(element => element.number === n);
            if (seatToRemoveIndex !== -1) {
                selectedSeatsTemp.splice(seatToRemoveIndex, 1);
                this.selectedSeatsHandler(selectedSeatsTemp);
            } else {
                let selectedSeatsTemp = this.state.seatsState;
                console.log(this.state.seatsState);
                selectedSeatsTemp.push({ number: n, cName: 'selected' });
                this.selectedSeatsHandler(selectedSeatsTemp);
                this.setState({ seatsState: selectedSeatsTemp });

            }
        }

    }



    selectedSeatsHandler(selectedSeats) {
        let seatsList = [];
        for (const obj of selectedSeats) {
            seatsList.push(obj.number);
        }
        //  this.props.handleSummary(seatsList);

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

            if (this.state.seatsState.length > 0) {
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