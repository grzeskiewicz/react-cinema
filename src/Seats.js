import React from 'react';
import './Seats.css';
import Seat from './Seat'

class Seats extends React.Component {
    constructor(props) {
        super(props);
        this.handleSeats = this.handleSeats.bind(this);
    }


    handleSeats(n) { //OGARCNAC TUTAj!!!!!!!!!!
        let seatsStateTemp = false;
        if (this.props.seatsState !== undefined && this.props.seatsState !== false) { seatsStateTemp = this.props.seatsState; }
        if (seatsStateTemp) {
            let seatStateToModify = this.props.seatsState.findIndex(element => element.number === n);
            if (seatStateToModify !== -1) {
                seatsStateTemp[seatStateToModify].cName = (seatsStateTemp[seatStateToModify].cName === 'selected') ? '' : 'selected';
                this.selectedSeatsHandler(seatsStateTemp);
            } else { console.log("Błąd programu, funkcja handleSeats") }
        }

    }

    selectedSeatsHandler(selectedSeats) {
        let seatsList = [];
        for (const obj of selectedSeats) {
            if (obj.cName === 'selected') seatsList.push(obj.number);
        }
        this.props.handleSelectedSeats(seatsList, selectedSeats);

    }

    render() {
        const seats = this.props.seatsState;
        const seatsRender = [];
        let row = [];
        for (let i = 1; i < seats.length; i++) {
            for (const seat of this.props.seatsTaken) {
                if (seats[i].number === Number(seat)) {
                    seats[i].cName = seats[i].cName + ' taken';
                    seats[i].disabled = true;
                }

            }

            if (i % 10) {
                row.push(<Seat seatsHandler={this.handleSeats} key={i} n={i} className={seats[i].cName} disabled={seats[i].disabled} />);

            } else {
                row.push(<Seat seatsHandler={this.handleSeats} key={i} n={i} className={seats[i].cName} disabled={seats[i].disabled} />);
                seatsRender.push(row);
                row = [];
            }

        }

        const wholeRender = seatsRender.map((row, index) => {
            return <div className="row" key={index}>{row}</div>;
        });

       // const romanNum = ['0','I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
        const romanNum = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

        const roomRoman = romanNum[this.props.showing.room];

        return (
            <div className={this.props.className} id="room"><p>ROOM {roomRoman}</p><div id="screen"></div>{this.props.seatsTaken !== '' ? <div id="seats">{wholeRender}</div> : ''}
                <div id="markings">
                    <div><button diasbled="true"></button><p>Free</p></div>
                    <div><button className="taken" diasbled="true"></button><p>Taken</p></div>
                    <div><button className="selected"diasbled="true"></button><p>Selected</p></div>
                </div>
            </div>
        );

    }
}





export default Seats;