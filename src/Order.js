import React from 'react';
import { authServices } from './services.js';
import { API_URL, request } from './apiconnection.js';
import io from 'socket.io-client';
import './Order.css';

const socket = io('https://cinema-node.herokuapp.com');


class Order extends React.Component {
    constructor(props) {
        super(props);
        this.createTickets = this.createTickets.bind(this);
        this.state = { ticketStatus: '' };
    }


    createTickets() {
        const ticket = {
            showing: this.props.selectedShowing.id,
            seats: this.props.seatsArray,
            price: this.props.selectedShowing.normal, //TODO: change to handle prices!!
            email: this.props.loggedUsername,
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
        /*  const romanNum = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
          const roomRoman = romanNum[this.props.selectedShowing.room]; */
        return (
            <div id="ordering">
                <button id="create-ticket-btn" onClick={this.createTickets}>Order</button>
                {this.state.ticketStatus.msg !== '' ? this.state.ticketStatus.msg : ''}
            </div>

        );

    }
}




export default Order;