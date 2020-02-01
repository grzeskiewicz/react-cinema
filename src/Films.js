import React from 'react';
import Film from './Film';

class Films extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const readyShowings = this.props.readyShowings;
        const readyToRender = readyShowings.filmTitles.map((filmTitle, index) => {
            return <Film key={index} data={readyShowings.showingsGrouped[filmTitle]} handleSelectedShowing={this.props.handleSelectedShowing} />
        });
        return (
            <div>{readyToRender}</div>
        );

    }
}

export default Films;