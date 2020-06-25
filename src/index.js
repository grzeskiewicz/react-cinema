import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment';
import Calendar from './Calendar';
import Calendar2 from './Calendar2';
import Showings from './Showings';
import User from './User'
import Order from './Order'
import Seats from './Seats'
import Tickets from './Tickets'
import io from 'socket.io-client';
import { API_URL, request } from './apiconnection.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons'

//console.log = function() {} //removing console.log comments

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
console.log(document);


// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});


const socket = io('https://cinema-node.herokuapp.com');

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showings: '', selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', tickets: '', wrapShowingSelection: false, showUser: false, username: '', showRoom: true };
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.handleSelectedSeats = this.handleSelectedSeats.bind(this);
        this.loggedUsername = this.loggedUsername.bind(this);
        this.resetOrder = this.resetOrder.bind(this);
        this.resetSeatsState = this.resetSeatsState.bind(this);
        this.handleSelectedShowingSocket = this.handleSelectedShowingSocket.bind(this);
        this.showCalAgain = this.showCalAgain.bind(this);
        this.wrapShowingSelection = this.wrapShowingSelection.bind(this);
        this.showShowingSelectionAgain = this.showShowingSelectionAgain.bind(this);
        this.showRoomAgain = this.showRoomAgain.bind(this);

        this.scrollToNode = this.scrollToNode.bind(this);
    }

    componentDidMount() {
        fetch(request(API_URL + "showings", 'GET'))
            .then(res => res.json())
            .then(showings => {
                this.setState({ showings: showings })
            });
    }

    scrollToNode(node) {
        setTimeout(function () {
            node.scrollIntoView({ behavior: 'smooth' });
        }, 300);

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
        this.scrollToNode(this.showings);

    }


    handleSelectedShowing(showing, seatsTaken) {
        this.setState({ selectedShowing: showing, seatsTaken: seatsTaken, selectedSeats: [], seatsState: this.resetSeatsState(showing), showRoom: true, showUser: false });
    }


    handleSelectedShowingSocket(seatsTaken) {
        this.setState({ seatsTaken: seatsTaken })
    }

    handleSelectedSeats(selectedSeats) {
        this.setState({ selectedSeats: selectedSeats });
    }

    loggedUsername(user) {
        this.setState({ username: user });
    }


    resetOrder(tickets) {
        this.setState({
            selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', userLogged: '', showUser: false,
            tickets: tickets, lastOrderedShowing: this.state.selectedShowing, wrapShowingSelection: false
        });
        this.scrollToNode(this.tickets);

    }

    showCalAgain() {
        this.setState({ selectedShowing: '', wrapShowingSelection: false, selectedSeats: [], username: '' });
    }


    wrapShowingSelection() {

        this.setState({ wrapShowingSelection: true, showUser: true, showRoom: false });
        this.scrollToNode(this.order);


    }


    showShowingSelectionAgain() {
        this.setState({ wrapShowingSelection: false, username: '' })
        this.showRoomAgain();

    }



    showRoomAgain() {
        this.setState({ showRoom: true, showUser: false, username: '' })
    }


    render() {
        return (
            <div id="main-panel">
                <div id="calendar-wrapper" className={this.state.selectedShowing !== '' ? "wrapped" : ''} >
                    <div id="first">I</div>
                    <Calendar2 onDaySelection={this.handleDaySelection} className={this.state.selectedShowing !== '' ? "wrapped" : ''} />
                    {this.state.selectedShowing !== '' ?
                        <div id="cal-icon">
                            <i onClick={this.showCalAgain} className="fa fa-calendar"></i>
                            <p>{moment(this.state.selectedDay).format('DD-MM-YYYY')} {this.state.selectedShowing.date}</p>
                        </div> : ''}
                </div>


                <div id="showing-selection-wrapper" className={(this.state.wrapShowingSelection ? "wrapped" : '') + " " + (this.state.tickets!=='' ? 'hidden':'')} ref={(node) => this.showings = node}>
                    <div id="second">II</div>
                    <Showings className={this.state.wrapShowingSelection ? "wrapped" : ''} selectedDay={this.state.selectedDay}
                        showings={this.state.showings} handleSelectedShowing={this.handleSelectedShowing} handleSelectedShowingSocket={this.handleSelectedShowingSocket} />
                    {this.state.selectedShowing !== '' ? <button id="scroll-to-seats" onClick={() => this.scrollToNode(this.room)}>Select seats</button> : ''}
                    {this.state.wrapShowingSelection ?
                        <div id="showing-icon">
                            <i onClick={this.showShowingSelectionAgain} className="fa fa-film"></i>
                            <p>{this.state.selectedShowing.title}</p>
                        </div> : ''}
                </div>

                {this.state.selectedShowing !== '' ?
                    <div id="room-wrapper" className={this.state.showRoom === false ? "wrapped" : ''} ref={(node) => this.room = node}>
                        <div id="third">III</div>
                        <Seats className={this.state.showRoom === false ? "wrapped" : ''} showing={this.state.selectedShowing} seatsState={this.state.seatsState} seatsTaken={this.state.seatsTaken} handleSelectedSeats={this.handleSelectedSeats} />
                        {this.state.showRoom === false ?
                            <div id="room-icon">
                                <FontAwesomeIcon id="chair-icon" onClick={this.showRoomAgain} icon={faChair} />
                                <div id="selectedSeatsSummary">
                                    {this.state.selectedSeats.map((seat, index) => { return <p>{seat}</p> })}
                                </div>
                            </div> : <div id="next"><button onClick={this.wrapShowingSelection}>Go to order</button></div>
                        }

                    </div>
                    : ''}



                {this.state.selectedSeats !== '' && this.state.selectedSeats.length > 0 ?
                    <div id="order-wrapper" ref={(node) => this.order = node}>
                        <div id="fourth">IV</div>
                        <div id="user-order">
                            {this.state.showUser ?
                                <User className={this.state.username ? 'logged-in' : 'not-logged'} loggedUsername={this.loggedUsername} ref={(node) => this.user = node} /> : ''
                            }
                            {this.state.username !== '' ? <Order showUser={this.state.showUser} loggedUsername={this.state.username} seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} resetOrder={this.resetOrder} /> : ''}
                        </div>
                    </div>
                    : ''}
                {this.state.tickets !== '' ?
                    <div id="tickets-wrapper" ref={(node) => this.tickets = node}>
                                                <div id="fifth">V</div>
                        <Tickets tickets={this.state.tickets} lastOS={this.state.lastOrderedShowing} />
                    </div>
                    : ''}
            </div>
        );


    }

}


ReactDOM.render(<Board />, document.getElementById('root'));

export default socket;