import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import moment from 'moment';
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

//vh calc for mobile CSS
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
const socket = io('http://localhost:3001', { transport: ['websocket'] });

//const socket = io('http://localhost:3001');

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { locked: false, showings: '', selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', scrolledToDescription: false, tickets: '', wrapShowingSelection: false, showUser: false, user: '', showRoom: true };
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.handleSelectedSeats = this.handleSelectedSeats.bind(this);
        this.loggedUser = this.loggedUser.bind(this);
        this.resetOrder = this.resetOrder.bind(this);
        this.resetSeatsState = this.resetSeatsState.bind(this);
        this.handleSelectedShowingSocket = this.handleSelectedShowingSocket.bind(this);

        this.showCalAgain = this.showCalAgain.bind(this);
        this.wrapShowingSelection = this.wrapShowingSelection.bind(this);
        this.showShowingSelectionAgain = this.showShowingSelectionAgain.bind(this);
        this.showRoomAgain = this.showRoomAgain.bind(this);


        this.scrollToNode = this.scrollToNode.bind(this);
        this.scrollSide = this.scrollSide.bind(this);
        this.scrollToLeft = this.scrollToLeft.bind(this);
        this.scrollLeft = this.scrollLeft.bind(this);
        this.scrollToSeats = this.scrollToSeats.bind(this);
    }


    componentDidMount() {
        fetch(request(API_URL + "showings", 'GET'))
            .then(res => res.json())
            .then(showings => {
                this.setState({ showings: showings })
            });

    }

    scrollToNode(node, behavior) {
        setTimeout(function () {
            node.scrollIntoView({ behavior: behavior });
        }, 300);
    }


    scrollSide(node) {
        setTimeout(function () {
            node.scrollIntoView({ behavior: 'smooth', inline: "end" });
        }, 300);
    }

    scrollToLeft(node) {
        setTimeout(function () {
            node.scrollIntoView({ behavior: 'smooth', inline: "start" });
        }, 300);
    }


    scrollLeft() {
        this.setState({ scrolledToDescription: false });
        document.querySelector('#root').classList.remove('scroll-lock-vertical');
        this.scrollToLeft(this.showings);
    }


    scrollToSeats() {
        this.scrollToNode(this.room, 'auto');
        document.querySelector('#root').classList.remove('scroll-lock-vertical');

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
        this.scrollToNode(this.showings, 'smooth');
        document.querySelector('#root').classList.add('scroll-lock-horizontal'); //?
    }


    handleSelectedShowing(showing, seatsTaken) {
        this.setState({ selectedShowing: showing, seatsTaken: seatsTaken, selectedSeats: [], seatsState: this.resetSeatsState(showing), showRoom: true, showUser: false, scrolledToDescription: true });
        this.scrollSide(this.showings);
        document.querySelector('#root').classList.add('scroll-lock-vertical');
    }


    handleSelectedShowingSocket(seatsTaken) {
        this.setState({ seatsTaken: seatsTaken })
    }

    handleSelectedSeats(selectedSeats) {
        this.setState({ selectedSeats: selectedSeats });
    }

    loggedUser(user) {
        console.log(user);
        this.setState({ user:user });
    }


    resetOrder(tickets) {
        this.setState({
            selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', userLogged: '', showUser: false,
            tickets: tickets, lastOrderedShowing: this.state.selectedShowing, wrapShowingSelection: false
        });
        this.scrollToNode(this.tickets, 'smooth');
    }

    showCalAgain() {
        this.setState({ selectedShowing: '', wrapShowingSelection: false, selectedSeats: [], user: '', selectedDay: '' });
    }


    wrapShowingSelection() {
        this.setState({ wrapShowingSelection: true, showUser: true, showRoom: false });
        this.scrollToNode(this.order, 'smooth');
    }

    showShowingSelectionAgain() {
        this.setState({ wrapShowingSelection: false, user: '' })
        this.showRoomAgain();

    }

    showRoomAgain() {
        this.setState({ showRoom: true, showUser: false, user: '' })
    }




    render() {
        // const romanNum = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
        const romanNum = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const roomRoman = romanNum[this.state.selectedShowing.room];
        return (
            <div id="main-panel">
                <div id="calendar-wrapper" className={this.state.selectedShowing !== '' ? "wrapped" : ''} ref={(node) => this.calendar = node} >
                    <div id="first">I</div>
                    <Calendar2 onDaySelection={this.handleDaySelection} className={this.state.selectedShowing !== '' ? "wrapped" : ''} />
                    {this.state.selectedShowing !== '' ?
                        <div id="cal-icon" onClick={this.showCalAgain}>
                                <div className="icon"></div>
                            <p>{moment(this.state.selectedDay).format('DD-MM-YYYY')} {this.state.selectedShowing.date}</p>
                        </div> : ''}
                </div>


                <div id="showing-selection-wrapper" className={(this.state.wrapShowingSelection ? "wrapped" : '') + " " + (this.state.tickets !== '' || this.state.selectedDay === '' ? 'hidden' : '')} ref={(node) => this.showings = node}>
                    <div id="second-mobile"><p>II</p><p>II</p></div>
                    <div id="second">II</div>
                    <Showings className={this.state.wrapShowingSelection ? "wrapped" : ''}
                        selectedDay={this.state.selectedDay}
                        showings={this.state.showings} handleSelectedShowing={this.handleSelectedShowing}
                        handleSelectedShowingSocket={this.handleSelectedShowingSocket} selectedShowing={this.state.selectedShowing} scrollLeft={this.scrollLeft} />
                    {this.state.selectedShowing !== '' ?
                        <div id="scroll-to-seats" className={this.state.scrolledToDescription ? 'right' : 'left'} >
                            <button onClick={this.scrollToSeats}>SELECT SEATS</button>
                        </div> : ''}
                    {this.state.wrapShowingSelection ?
                        <div id="showing-icon" onClick={this.showShowingSelectionAgain}>
                                <div className="icon"></div>
                            <p>{this.state.selectedShowing.title}</p>
                        </div> : ''}
                </div>

                {this.state.selectedShowing !== '' ?
                    <div id="room-wrapper" className={this.state.showRoom === false ? "wrapped" : ''} ref={(node) => this.room = node}>
                        <div id="third">III</div>
                        <Seats className={this.state.showRoom === false ? "wrapped" : ''} showing={this.state.selectedShowing} seatsState={this.state.seatsState} seatsTaken={this.state.seatsTaken} handleSelectedSeats={this.handleSelectedSeats} />
                        {this.state.showRoom === false ?
                            <div id="room-icon" onClick={this.showRoomAgain}>
                                <div className="icon"></div>
                                <div id="selectedSeatsSummary">
                                    <div><p>Room: {roomRoman}</p></div>
                                    <div id="selectedSeatsList">
                                        {this.state.selectedSeats.map((seat, index) => { return <p key={index}>{seat}</p> })}
                                    </div>
                                </div>
                            </div> : ''
                        }
                        {this.state.selectedSeats.length > 0 ?
                            <div id="next" className={(this.state.selectedSeats.length > 0 ? 'show-order-btn ' : '') + (this.state.showRoom ? '' : 'room-icon')}><button onClick={this.wrapShowingSelection}>GO TO ORDER</button></div>
                            : ''}

                    </div>
                    : ''}

                {this.state.selectedSeats.length > 0 ?
                    <div id="order-wrapper" className={this.state.showRoom ? "hidden" : ''} ref={(node) => this.order = node}>
                        <div id="fourth">IV</div>
                        <div id="user-order" className={this.state.user !== '' ? 'logged-in' : ''}>
                            {this.state.showUser ?
                                <User className={this.state.user ? 'logged-in' : 'not-logged'} loggedUser={this.loggedUser} ref={(node) => this.user = node} /> : ''
                            }
                            {this.state.user !== '' && this.state.wrapShowingSelection ? <Order showUser={this.state.showUser} loggedUser={this.state.user} seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} resetOrder={this.resetOrder} /> : ''}
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