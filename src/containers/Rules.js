import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import Button from '../components/Button';

import * as actions from '../actions/rules';

class Rules extends Component {

    componentDidMount() {
        console.log('Rules Render');
        this.props.getRulesRequest();
    }

    components = () => {
        console.log(this.props.data);
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
                <Button content="Rule Add" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.rules.statusMessage,
        data: state.rules.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRulesRequest: () => dispatch(actions.getRulesRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);
