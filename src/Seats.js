import React from 'react';
import './Seats.css';
import Seat from './Seat'

class Seats extends React.Component {
    constructor(props) {
        super(props);
        //  this.state = { seatsState: [] }
        this.handleSeats = this.handleSeats.bind(this);

        //  this.state = { seatsState: ()=> this.resetSeatsState() }

    }


    handleSeats(n) { //OGARCNAC TUTAj!!!!!!!!!!
        let selectedSeatsTemp = false;
        if (this.props.seatsState !== undefined && this.props.seatsState !== false) { selectedSeatsTemp = this.props.seatsState; }
        if (selectedSeatsTemp) {
            console.log(this.props.seatsState);
            let seatToRemoveIndex = this.props.seatsState.findIndex(element => element.number === n);
            console.log(seatToRemoveIndex);
            if (seatToRemoveIndex !== -1) {
                console.log("2");
                selectedSeatsTemp[seatToRemoveIndex].cName = (selectedSeatsTemp[seatToRemoveIndex].cName === 'selected') ? '' : 'selected';
                // selectedSeatsTemp.splice(seatToRemoveIndex, 1);
                this.selectedSeatsHandler(selectedSeatsTemp);
                //  this.setState({ seatsState: selectedSeatsTemp });

            } else {
                //  let selectedSeatsTemp = this.props.seatsState;
                //  selectedSeatsTemp.push({ number: n, cName: 'selected' });
                //  this.selectedSeatsHandler(selectedSeatsTemp);
                //   this.setState({ seatsState: selectedSeatsTemp });

            }
        }

    }



    selectedSeatsHandler(selectedSeats) {
        let seatsList = [];
        for (const obj of selectedSeats) {
            if (obj.cName === 'selected') seatsList.push(obj.number);

        }
        this.props.handleSummary(seatsList, selectedSeats);

    }

    render() {
        const seats = this.props.showing.seats;
        const seatsRender = [];
        let row = [];
        //TUTAJ POPRAWIC, PETLA MA BYC PO WSZYSTKICH STANACH SEAT!

        for (let i = 1; i <= seats; i++) {
            let tempSeat = { cName: '', disabled: false };
            for (const seat of this.props.seatsTaken) {
                if (i == seat) {
                    tempSeat.cName = tempSeat.cName + ' taken';
                    tempSeat.disabled = true;

                }

            }
//TUTAJ POPRAWIC, PETLA MA BYC PO WSZYSTKICH STANACH SEAT!
/*
            if (this.props.seatsState.length > 0) {
                for (const state of this.props.seatsState) {
                    if (Number(state.number) === i) { tempSeat = state; }
                }
            }*/


            if (i % 10) {
                row.push(<Seat seatsHandler={this.handleSeats} key={i} n={i} className={tempSeat.cName} disabled={tempSeat.disabled} />);

            } else {
                row.push(<Seat seatsHandler={this.handleSeats} key={i} n={i} className={tempSeat.cName} disabled={tempSeat.disabled} />);
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