import React from 'react';
import User from './User'
import { authServices } from './services.js';
import { API_URL, request, headers } from './apiconnection.js';


class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
        this.loggedUsername = this.loggedUsername.bind(this);
        this.createTickets = this.createTickets.bind(this);
        this.logout = this.logout.bind(this);

        this.state = { showUser: false, username: '' };
    }

    handleOrder() {
        //   this.props.handleOrder();
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
        const seatsOnly = [];
        for (const seat of this.props.seatsArray) {
            seatsOnly.push(seat.number);
        }

        const ticket = {
            showing: this.props.selectedShowing.id,
            seats: seatsOnly,
            price: this.props.selectedShowing.normal, //change to handle prices!!
            email: this.state.username,
        };

        fetch(request(`${API_URL}newticket`, 'POST', ticket))
            .then(res => res.json())
            .then(result => {
                // socket.emit('ticketordered', ticket);
                console.log(result)
            }).catch(error => Promise.reject(new Error(error)));
    }

    render() {
        const seatsArray = this.props.seatsArray;
        let seatsArrayMap;
        if (seatsArray.length > 0) {
            seatsArrayMap = seatsArray.map((seat) => {
                return <p key={seat.number}>{seat.number} </p>
            });
        }
        const showing = this.props.selectedShowing.id;
        return (
            <div><p>Showing:{showing}</p>
                <div id="seats-summary">
                    Seats chosen: {seatsArrayMap}
                </div>
                {!this.state.showUser ? <button onClick={this.handleOrder}>Next step</button> : ''}
                <div>{this.state.showUser ? <User loggedUsername={this.loggedUsername} /> : ''}</div>
                {this.state.username !== '' ?
                    <div>
                        <div>
                            <p>{this.state.username}</p>
                            <button onClick={this.logout}>Logout</button>
                        </div>

                        <div>
                            <button onClick={this.createTickets}>Order</button>
                        </div>
                    </div> : ''}


            </div>

        );

    }
}




export default Summary;