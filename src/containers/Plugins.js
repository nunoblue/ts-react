import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/plugins';

import Card from '../components/Card';

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
                <Card key={id} title={name} description={state} />
            );
        });
        return components;
    }

    render() {
        return (
            <div className="mdl-grid">
                {this.components()}
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
