import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'antd';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';

import * as actions from '../actions/plugin/plugins';

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
                <CommonCard key={id} style={{ cursor: 'pointer' }} title={name} content={state} buttonTooltip="Plugin Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <Row>
                {this.components()}
                <CommonButton tooltipTitle="Plugin Add" iconClassName="plus" />
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    statusMessage: state.plugins.statusMessage,
    data: state.plugins.data,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getPluginsRequest: actions.getPluginsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
