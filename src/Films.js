import React from 'react';
import Film from './Film';

class Films extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
        this.handleSelectedShowingReset = this.handleSelectedShowingReset.bind(this);
        this.titleClicked = this.titleClicked.bind(this);
        this.state = { selectedShowing: '' };
    }

    handleSelectedShowing(showing) {
        console.log(showing);
        this.props.handleSelectedShowing(showing);
        this.setState({ selectedShowing: showing });
    }


    handleSelectedShowingReset(filmTitle) {
    }

    titleClicked(showing) {
        this.setState({ selectedShowing: showing });
    }


    render() {
        const readyShowings = this.props.readyShowings;

        const selectedShowing = this.state.selectedShowing;
        const selectedShowingDate = this.state.selectedShowing.fullDate;
        const readyToRender = readyShowings.filmTitles.map((filmTitle, index) => {
            const isSelected = selectedShowing.title === filmTitle && selectedShowingDate === readyShowings.showingsGrouped[filmTitle][0].fullDate;
            return <Film selectedShowing={this.state.selectedShowing} isSelected={isSelected} key={index} data={readyShowings.showingsGrouped[filmTitle]} handleSelectedShowing={this.handleSelectedShowing} titleClicked={this.titleClicked} />
        });
        const filmSpecs = this.state.selectedShowing;
        return (
            <div>
                <div id="films">{readyToRender}</div>
                {this.state.selectedShowing !== '' && readyShowings.filmTitles.length ?
                    <div id="film-description">
                        <div className="poster"><img className="poster-img" src={filmSpecs.imageurl} alt="Poster"></img></div>
                        <div className="filmDetails">
                            <div><p>Director:</p> <p>{filmSpecs.director}</p></div>
                            <div><p>Genre: </p><p>{filmSpecs.genre}</p></div>
                            <div><p>Length: </p><p>{filmSpecs.length}</p></div>
                            <div><p>Age category: </p><p>{filmSpecs.category}</p></div>
                            <div><p>Price normal/discount: </p><p>{filmSpecs.normal}/{filmSpecs.discount}</p></div>
                        </div>
                    </div> : ''}
            </div>
        );

    }
}

export default Films;