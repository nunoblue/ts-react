import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/rules';
import Card from '../components/Card';

class Rules extends Component {

    componentDidMount() {
        console.log('Rules Render');
        this.props.getRulesRequest();
    }

    components = () => {
        return (
            this.props.data.map((data, index) => {
                let name = data.name;
                let state = data.state;
                return (
                    <Card key={index} title={name} description={state} />
                )
            })
        )
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
        statusMessage: state.rules.statusMessage,
        data: state.rules.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getRulesRequest: () => {
            return dispatch(actions.getRulesRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rules);