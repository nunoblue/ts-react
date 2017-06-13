import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import FooterButton from '../components/FooterButton';

import * as actions from '../actions/rules';

class Rules extends Component {

    componentDidMount() {
        console.log('Rules Render');
        this.props.getRulesRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const state = data.state;
            const id = data.id.id;
            return (
                <Card key={id} title={name} description={state} buttonTooltip="Rule Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <div className="mdl-grid">
                {this.components()}
                <FooterButton content="Rule Add" iconClassName="add" />
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
