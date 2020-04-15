import React from 'react';
import User from './User'
import { authServices } from './services.js';
import { API_URL, request } from './apiconnection.js';
import io from 'socket.io-client';
import './Summary.css';

const socket = io('https://cinema-node.herokuapp.com');


class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
        this.loggedUsername = this.loggedUsername.bind(this);
        this.createTickets = this.createTickets.bind(this);
        this.logout = this.logout.bind(this);

        this.state = { showUser: false, username: '', ticketStatus: '' };
    }

    handleOrder() {
        this.setState({ showUser: true });
    }


    loggedUsername(user) {
        console.log(user);
        this.setState({ username: user });
    }

    logout() {
        authServices.destroyUserCredentials();
        this.setState({ username: '', showUser: false });
    }


    createTickets() {
        const ticket = {
            showing: this.props.selectedShowing.id,
            seats: this.props.seatsArray,
            price: this.props.selectedShowing.normal, //TODO: change to handle prices!!
            email: this.state.username,
            showingDesc: this.props.selectedShowing
        };

        fetch(request(`${API_URL}newticket`, 'POST', ticket))
            .then(res => res.json())
            .then(result => {
                socket.emit('ticketordered', ticket);
                this.setState({ ticketStatus: result });
                this.props.resetOrder(ticket);
            }).catch(error => Promise.reject(new Error(error)));
    }

    render() {
        const seatsArray = this.props.seatsArray;
        let seatsArrayMap;
        if (seatsArray.length > 0) {
            seatsArrayMap = seatsArray.map((seat) => {
                return <p key={seat}>{seat}</p>
            });
        }
        const showing = this.props.selectedShowing.id;
        return (
            <div id="ordering">
                {this.state.username !== '' ?
                    <div id="user-data">
                        <p>{this.state.username}</p>
                        <button onClick={this.logout}>Logout</button>
                    </div>
                    : ''}


                <div id="summary">
                    <p id="showing-summary">Showing: #{showing} {this.props.selectedShowing.title}</p>
                    <div id="seats-summary">
                        <p>Seats chosen:  </p>{seatsArrayMap}
                    </div>
                </div>
                {!this.state.showUser ? <button onClick={this.handleOrder}>Next step</button> : ''}

                <div>{this.state.showUser ? <User loggedUsername={this.loggedUsername} /> : ''}</div>

                {this.state.username !== '' ?
                    <div id="signin-order">
                        <div id="last-step">
                            <button id="create-ticket-btn" onClick={this.createTickets}>Order</button>
                        </div>
                    </div> : ''}
                {this.state.ticketStatus.msg !== '' ? this.state.ticketStatus.msg : ''}

            </div>

        );

    }
}




export default Summary;