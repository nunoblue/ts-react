import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import CardButton from '../components/CardButton';

import * as actions from '../actions/plugins';

class Plugins extends Component {

    componentDidMount() {
        console.log('Plugins Render');
        this.props.getPluginsRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const state = data.state;
            const id = data.id.id;
            return (
                <Card key={id} title={name} description={state} buttonTooltip="Plugin Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <div className="mdl-grid">
                {this.components()}
                <CardButton content="Plugin Add" iconClassName="add" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.plugins.statusMessage,
        data: state.plugins.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPluginsRequest: () => dispatch(actions.getPluginsRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
