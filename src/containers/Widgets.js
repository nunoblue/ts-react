import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'antd';
import i18n from 'i18next';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';

import * as actions from '../actions/widget/widgets';

class Widgets extends Component {

    componentDidMount() {
        console.log('Widgets Render');
        this.props.getWidgetsRequest();
    }

    componentWillUnmount() {
        const { clearWidgetsRequest } = this.props;
        clearWidgetsRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const id = data.id.id;
            return (
                <CommonCard key={id} style={{ cursor: 'pointer' }} title={title} tooltipTitle={i18n.t('widget.delete')} />
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

const mapStateToProps = (state) => ({
    statusMessage: state.widgets.statusMessage,
    data: state.widgets.data,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getWidgetsRequest: actions.getWidgetsRequest,
    clearWidgetsRequest: actions.clearWidgetsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Widgets);
