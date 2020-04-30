import React from 'react';
import './Film.css';

class Film extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detailsVisible: false };
        this.toggleView = this.toggleView.bind(this);
    }

    showTimes(readyShowings) {
        const times = readyShowings.map((showing, index) => {
            const cName = this.props.selectedShowing.id === showing.id ? 'hourSelected' : '';     //lifted up or state here?
            return <p className={cName} key={index} onClick={() => this.showSeats(showing)}>{showing.date}</p>
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
        const cName = this.props.isSelected ? 'filmSelected' : '';
        console.log(filmSpecs);
        return (
            <div className="film">
                <div className="filmTT">
                    <div className="filmTitle"><p onClick={this.toggleView}>{filmTitle}</p></div>
                    <div className={"filmTimes " + cName}>{renderTimes}</div>
                </div>
                {this.state.detailsVisible === true ?
                    <div className="filmDetailsContainer">
                        <div className="filmDetails">
                            <p>Director: {filmSpecs.director}</p>
                            <p>Genre: {filmSpecs.genre}</p>
                            <p>Length: {filmSpecs.length}</p>
                            <p>Age category: {filmSpecs.category}</p>
                            <p>Price normal/discount: {filmSpecs.normal}/{filmSpecs.discount}</p>
                        </div>
                        <div className="poster"><img className="poster-img" src={filmSpecs.imageurl} alt="Poster"></img></div>
                    </div>
                    : ''}
            </div>
        );

    }
}

export default Film;