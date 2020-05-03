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
        console.log("ehehehegdsasadax", filmTitle);
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
        return (
            <div id="films">{readyToRender}</div>
        );

    }
}

export default Films;