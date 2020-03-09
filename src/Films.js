import React from 'react';
import Film from './Film';

class Films extends React.Component {
    constructor(props) {
        super(props);
        this.state = { filmSelected: '' };
        this.handleSelectedShowing = this.handleSelectedShowing.bind(this);
    }

    handleSelectedShowing(showing) {
        this.setState({filmSelected: showing.title});
        this.props.handleSelectedShowing(showing);
    }


    render() {
        const readyShowings = this.props.readyShowings;
        const readyToRender = readyShowings.filmTitles.map((filmTitle, index) => {
           // console.log(this.state.filmSelected, readyShowings.showingsGrouped[filmTitle][0].title);
            return <Film 
            cName={(this.state.filmSelected === readyShowings.showingsGrouped[filmTitle][0].title) ? 'filmSelected' : '' }
            key={index} data={readyShowings.showingsGrouped[filmTitle]} handleSelectedShowing={this.handleSelectedShowing} />
        });
        return (
            <div>{readyToRender}</div>
        );

    }
}

export default Films;