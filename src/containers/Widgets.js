import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';

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
                <CommonCard key={id} style={{ cursor: 'pointer' }} title={title} buttonTooltip="Widget Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <Row>
                {this.components()}
                <CommonButton tooltipTitle="Widget Add" iconClassName="plus" />
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
