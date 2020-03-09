import React from 'react';
import './Film.css';

class Film extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detailsVisible: false};
        this.toggleView = this.toggleView.bind(this);
    }

    showTimes(readyShowings) {
        const times = readyShowings.map((showing, index) => {
            return <p key={index} onClick={() => this.showSeats(showing)}>{showing.date}</p>
        });
        return times;
    }


    showSeats(showing) {
        this.props.handleSelectedShowing(showing);
    }

    toggleView() {
        this.setState({ detailsVisible: !this.state.detailsVisible });
    }

    render() {
        const filmSpecs = this.props.data[0];
        const filmTitle = filmSpecs.title;
        const renderTimes = this.showTimes(this.props.data);
        return (
            <div>
                <div className="filmTimes"><p onClick={this.toggleView}>{filmTitle}</p>{renderTimes}</div>
                {this.state.detailsVisible === true ?
                    <div className="filmDetails">
                        <p>Director: {filmSpecs.director}</p>
                        <p>Genre: {filmSpecs.genre}</p>
                        <p>Length: {filmSpecs.length}</p>
                        <p>Age category: {filmSpecs.category}</p>
                        <p>Price normal/discount: {filmSpecs.normal}/{filmSpecs.discount}</p>
                    </div> : ''}
            </div>
        );

    }
}

export default Film;