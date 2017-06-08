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
        return (
            this.props.data.map((data, index) => {
                let name = data.name;
                let state = data.state;
                return (
                    <Card key={index} title={name} description={state} />
                );
            })
        );
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
        data: state.plugins.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPluginsRequest: () => {
            return dispatch(actions.getPluginsRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);