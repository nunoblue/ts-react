import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';

import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';

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
                <CustomButton tooltipTitle="Widget Add" iconClassName="plus" />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.widgets.statusMessage,
        data: state.widgets.data,
        currentUser: state.authentication.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getWidgetsRequest: () => dispatch(actions.getWidgetsRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Widgets);
