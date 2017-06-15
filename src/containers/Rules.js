import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';

import CustomCard from '../components/CustomCard';
import CardButton from '../components/CardButton';

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
                <CustomCard key={id} title={name} description={state} buttonTooltip="Rule Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <Row>
                {this.components()}
                <CardButton content="Rule Add" iconClassName="add" />
            </Row>
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
