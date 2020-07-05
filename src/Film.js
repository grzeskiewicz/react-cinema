import React from 'react';
import './Film.css';

class Film extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detailsVisible: false }; //?
    }

    showTimes(showingsGrouped) {
        const times = showingsGrouped.map((showing, index) => {
            const cName = this.props.selectedShowing.id === showing.id ? 'hourSelected' : '';     //lifted up or state here?
            return <p className={cName} key={index} onClick={() => this.props.handleSelectedShowing(showing)}>{showing.date}</p>
        });
        return times;
    }



    render() { //only one description at a time
        const filmSpecs = this.props.showingsGrouped[0];
        const filmTitle = filmSpecs.title;
        const renderTimes = this.showTimes(this.props.showingsGrouped);
        const cName = this.props.isSelected || this.state.detailsVisible ? 'filmSelected' : '';
        return (
            <div className="film">
                    <div className="filmTitle" onClick={()=>this.props.handleSelectedShowing(filmSpecs)}><p>{filmTitle}</p></div>
                    <div className={"filmTimes " + cName}>{renderTimes}</div>
            </div>
        );

    }
}

export default Film;