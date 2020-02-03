import React from 'react';


class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
    }

    handleOrder() {
        this.props.handleOrder();
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
                <button onClick={this.handleOrder}>Order</button>
            </div>
        );

    }
}




export default Summary;