import React from 'react';
import { API_URL, request } from './apiconnection.js';
import io from 'socket.io-client';
import './css/Order.css';
import FileSaver from 'file-saver';
const axios = require("axios");


const socket = io('http://localhost:3001', { transport: ['websocket'] });


class Order extends React.Component {
    constructor(props) {
        super(props);
        this.createTickets = this.createTickets.bind(this);
        this.getPDF = this.getPDF.bind(this);
        this.state = { ticketStatus: '', ordering: false };
    }
    getPDF(ticketsIDs) {
        axios.post(`${API_URL}getpdf`, { ticketid: ticketsIDs[0] }, { //try request
            responseType: 'arraybuffer',
            headers: {
                Accept: 'application/pdf'
            },
        }).then((response) => {
            console.log(response)
            FileSaver.saveAs(
                new Blob([response.data], { type: 'application/pdf' }), `sample.pdf`);
        }).catch((error) => { });
    }

    createTickets() {
        const ticket = {
            showing: this.props.selectedShowing.id,
            seats: this.props.seatsArray,
            price: this.props.selectedShowing.normal, //TODO: change to handle prices!!
            email: this.props.loggedUser.username,
            userid: this.props.loggedUser.id,
            showingDesc: this.props.selectedShowing
        };
        this.setState({ ordering: true });
        fetch(request(`${API_URL}newticket`, 'POST', ticket))
            .then(res => res.json())
            .then(result => {
                console.log(result);
                socket.emit('ticketordered', ticket);
                this.setState({ ticketStatus: result });
                this.props.resetOrder(ticket);
                this.getPDF(result.ticketsIDs);
                this.setState({ ordering: false });
            }).catch(error => Promise.reject(new Error(error)));
    }

    render() {
        /* const seatsArray = this.props.seatsArray;
         let seatsArrayMap;
         if (seatsArray.length > 0) {
             seatsArrayMap = seatsArray.map((seat) => {
                 return <p key={seat}>{seat}</p>
             });
         } */
        /*  const romanNum = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
          const roomRoman = romanNum[this.props.selectedShowing.room]; */
        return (
            <div id="ordering">
                {this.state.ordering ? <div className="loader"></div> : <button id="create-ticket-btn" onClick={this.createTickets}>ORDER</button>}
            </div>

        );

    }
}




export default Order;