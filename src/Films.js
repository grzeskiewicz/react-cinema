import React from 'react';
import Film from './Film';

class Films extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.scrollLeft = this.scrollLeft.bind(this);

    }

    handleSelectedShowing(showing) {
        this.props.handleSelectedShowing(showing);
    }
    scrollLeft() {
        this.props.scrollLeft();
    }


    render() {
        const readyShowings = this.props.readyShowings;
        const selectedShowing = this.props.selectedShowing;
        const selectedShowingDate = selectedShowing.fullDate;

        const readyToRender = readyShowings.filmTitles.map((filmTitle, index) => {
            const isSelected = selectedShowing.title === filmTitle && selectedShowingDate === readyShowings.showingsGrouped[filmTitle][0].fullDate;
            return <Film handleSelectedShowing={this.handleSelectedShowing} selectedShowing={this.props.selectedShowing} isSelected={isSelected} key={index} showingsGrouped={readyShowings.showingsGrouped[filmTitle]} />
        });

        return (
            <div>
                <div id="films">{readyToRender}</div>
                <div id="film-description-wrapper" className={selectedShowing !== '' && readyShowings.filmTitles.length ? '' : 'hidden'}>
                    <button id="back-to-showings" onClick={() => this.scrollLeft()}>&lt;</button>
                    <div id="film-description">
                        <div className="poster"><img className="poster-img" src={selectedShowing.imageurl} alt="Poster"></img></div>
                        <div className="filmDetails">
                            <div><p>Director:</p> <p>{selectedShowing.director}</p></div>
                            <div><p>Genre: </p><p>{selectedShowing.genre}</p></div>
                            <div><p>Length: </p><p>{selectedShowing.length}</p></div>
                            <div><p>Age category: </p><p>{selectedShowing.category}</p></div>
                            <div><p>Price normal/discount: </p><p>{selectedShowing.normal}/{selectedShowing.discount}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default Films;