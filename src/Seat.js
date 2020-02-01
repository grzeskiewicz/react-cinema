import React from 'react';


class Seat extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    handleButton(n) {
        this.props.seatsHandler(n);
    }

    render() {
        return (
            <button className={this.props.className} onClick={() => this.handleButton(this.props.n)} > {this.props.n}</button >
        );

    }
}




export default Seat;