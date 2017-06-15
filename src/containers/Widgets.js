import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';

import CustomCard from '../components/CustomCard';
import CardButton from '../components/CardButton';

import * as actions from '../actions/widgets';

class Widgets extends Component {

    componentDidMount() {
        console.log('Widgets Render');
        this.props.getWidgetsRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const id = data.id.id;
            return (
                <CustomCard key={id} title={title} buttonTooltip="Widget Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <Row>
                {this.components()}
                <CardButton content="Widget Add" iconClassName="add" />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.widgets.statusMessage,
        data: state.widgets.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getWidgetsRequest: () => dispatch(actions.getWidgetsRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Widgets);
