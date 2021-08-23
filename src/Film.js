import React from 'react';
import './css/Film.css';

class Film extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detailsVisible: false }; //?
    }

    showTimes(showingsGrouped) {
        const roomABC = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

        const times = showingsGrouped.map((showing, index) => {
            const room = roomABC[showing.room];
            const time = showing.date.split(":");
            const timeNow = new Date().getHours();
            const isSelectable = time[0] >= timeNow ? 'selectable' : 'not-selectable';
            let cName = this.props.selectedShowing.id === showing.id ? 'hourSelected' : '';     //lifted up or state here?
            cName=cName + " " + isSelectable;
            return <p className={cName} key={index} onClick={() => cName.includes('selectable') ? this.props.handleSelectedShowing(showing) : false}>{showing.date}-{room}</p>
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
                <div className="filmTitle" onClick={() => this.props.handleSelectedShowing(filmSpecs)}><p>{filmTitle}</p></div>
                <div className={"filmTimes " + cName}>{renderTimes}</div>
            </div>
        );

    }
}

export default Film;