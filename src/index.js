import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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
const socket = io('http://localhost:3001', { transport : ['websocket'] });

//const socket = io('http://localhost:3001');

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { locked: false, showings: '', selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', scrolledToDescription: false, tickets: '', wrapShowingSelection: false, showUser: false, username: '', showRoom: true };
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
        document.querySelector('#root').classList.add('scroll-lock-horizontal');
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

    loggedUsername(user) {
        this.setState({ username: user });
    }


    resetOrder(tickets) {
        this.setState({
            selectedDay: '', selectedSeats: [], seatsTaken: '', selectedShowing: '', userLogged: '', showUser: false,
            tickets: tickets, lastOrderedShowing: this.state.selectedShowing, wrapShowingSelection: false
        });
        this.scrollToNode(this.tickets, 'smooth');
    }

    showCalAgain() {
        this.setState({ selectedShowing: '', wrapShowingSelection: false, selectedSeats: [], username: '', selectedDay: '' });
    }


    wrapShowingSelection() {
        this.setState({ wrapShowingSelection: true, showUser: true, showRoom: false });
        this.scrollToNode(this.order, 'smooth');
    }

    showShowingSelectionAgain() {
        this.setState({ wrapShowingSelection: false, username: '' })
        this.showRoomAgain();

    }

    showRoomAgain() {
        this.setState({ showRoom: true, showUser: false, username: '' })
    }




    render() {
        // const romanNum = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
        const romanNum = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const roomRoman = romanNum[this.state.selectedShowing.room];
        console.log(this.state.scrolledToDescription)
        return (
            <div id="main-panel">
                <div id="calendar-wrapper" className={this.state.selectedShowing !== '' ? "wrapped" : ''} ref={(node) => this.calendar = node} >
                    <div id="first">I</div>
                    <Calendar2 onDaySelection={this.handleDaySelection} className={this.state.selectedShowing !== '' ? "wrapped" : ''} />
                    {this.state.selectedShowing !== '' ?
                        <div id="cal-icon">
                            <img src="https://img.icons8.com/officel/160/000000/calendar.png" />
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
                        <div id="showing-icon">
                            <img width="150" alt="Clap cinema" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Clap_cinema.svg/128px-Clap_cinema.svg.png"></img>
                            <p>{this.state.selectedShowing.title}</p>
                        </div> : ''}
                </div>

                {this.state.selectedShowing !== '' ?
                    <div id="room-wrapper" className={this.state.showRoom === false ? "wrapped" : ''} ref={(node) => this.room = node}>
                        <div id="third">III</div>
                        <Seats className={this.state.showRoom === false ? "wrapped" : ''} showing={this.state.selectedShowing} seatsState={this.state.seatsState} seatsTaken={this.state.seatsTaken} handleSelectedSeats={this.handleSelectedSeats} />
                        {this.state.showRoom === false ?
                            <div id="room-icon">
                                <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <title>background</title>
                                        <rect fill="#ffffff" id="canvas_background" height="602" width="802" y="-1" x="-1" />
                                    </g>
                                    <g>
                                        <title>Layer 1</title>
                                        <rect stroke="#000" id="svg_7" height="180.50067" width="328.00058" y="175.99954" x="235.49944" fill-opacity="null" stroke-opacity="null" stroke-width="14" fill="none" />
                                        <path transform="rotate(-90 266.25033569335943,357.75079345703125) " stroke="#000" id="svg_75" d="m257.5002,354.50067l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 310.2499389648438,359.2507629394531) " stroke="#000" id="svg_76" d="m301.49981,356.00066l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 354.7495422363282,360.7507629394531) " stroke="#000" id="svg_77" d="m345.99942,357.50064l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 538.7479858398439,360.2507629394532) " stroke="#000" id="svg_78" d="m529.99782,357.00065l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 497.2483215332032,360.2507629394532) " stroke="#000" id="svg_79" d="m488.49818,357.00065l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 444.74877929687506,361.2507629394531) " stroke="#000" id="svg_80" d="m435.99863,358.00064l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 398.2491760253907,360.7507629394531) " stroke="#000" id="svg_81" d="m389.49904,357.50064l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 244.7505035400391,388.7505187988281) " stroke="#000" id="svg_82" d="m236.00039,385.5004l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 288.75012207031256,390.25048828125) " stroke="#000" id="svg_83" d="m280,387.00039l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 333.24972534179693,391.75048828125) " stroke="#000" id="svg_84" d="m324.49961,388.50038l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 522.7481079101564,390.75048828125006) " stroke="#000" id="svg_85" d="m513.99796,387.50038l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 473.24853515625006,390.2505187988282) " stroke="#000" id="svg_86" d="m464.49839,387.00039l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 429.74890136718756,391.2505187988281) " stroke="#000" id="svg_87" d="m420.99876,388.00038l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 376.74935913085943,391.75048828125) " stroke="#000" id="svg_88" d="m367.99923,388.50038l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                        <path transform="rotate(-90 562.7477416992189,390.2505187988282) " stroke="#000" id="svg_89" d="m553.99759,387.00038l8.75013,0l0,0c4.83256,0 8.75013,1.45512 8.75013,3.2501c0,1.79498 -3.91757,3.2501 -8.75013,3.2501l-8.75013,0l0,-6.5002z" stroke-width="28" fill="none" />
                                    </g>
                                </svg>
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
                        <div id="user-order" className={this.state.username !== '' ? 'logged-in' : ''}>
                            {this.state.showUser ?
                                <User className={this.state.username ? 'logged-in' : 'not-logged'} loggedUsername={this.loggedUsername} ref={(node) => this.user = node} /> : ''
                            }
                            {this.state.username !== '' && this.state.wrapShowingSelection ? <Order showUser={this.state.showUser} loggedUsername={this.state.username} seatsArray={this.state.selectedSeats} selectedShowing={this.state.selectedShowing} resetOrder={this.resetOrder} /> : ''}
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