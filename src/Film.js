import React from 'react';
import './Film.css';

class Film extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detailsVisible: false };
        this.titleClicked = this.titleClicked.bind(this);
        this.showSeats = this.showSeats.bind(this);


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


    titleClicked(showing) {
        this.props.titleClicked(showing);
    }



    render() { //only one description at a time
        const filmSpecs = this.props.data[0];
        const filmTitle = filmSpecs.title;
        const renderTimes = this.showTimes(this.props.data);
        const cName = this.props.isSelected || this.state.detailsVisible ? 'filmSelected' : '';
        console.log(filmSpecs);
        return (
            <div className="film">
                    <div className="filmTitle" onClick={()=>this.titleClicked(filmSpecs)}><p>{filmTitle}</p></div>
                    <div className={"filmTimes " + cName}>{renderTimes}</div>
            </div>
        );

    }
}

export default Film;