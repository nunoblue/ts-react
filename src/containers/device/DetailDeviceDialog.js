import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Row, Form, Input } from 'antd';
import i18n from 'i18next';

import CommonDialog from '../../components/common/CommonDialog';
import CommonButton from '../../components/common/CommonButton';
import DeviceForm from '../../components/device/DeviceForm';
import AttributeTable from '../../components/attribute/AttributeTable';
import { types } from '../../utils/commons';
import * as actions from '../../actions/telemetry/telemetry';

class DetailDeviceDialog extends Component {
    state = {
        type: 'dialog',
        editing: false,
        title: null,
        activeKey: 'detail',
    }

    handleClickEdit = () => {
        const { onCancelDialogEdit } = this.props;
        if (this.state.editing) {
            onCancelDialogEdit();
        }
        this.setState({
            editing: !this.state.editing,
            activeKey: 'detail',
        });
    }

    clearEdit = () => {
        this.setState({
            editing: false,
            title: null,
        });
    }

    initTitle = (title) => {
        this.setState({
            title,
        });
    }

    handleSave = () => {
        this.props.onSave(this.state.type);
    }

    handleTitleChange = (value) => {
        this.setState({
            title: value,
        });
    }

    handleChangeActiveTabs = (value) => {
        this.setState({
            activeKey: value,
        });
    }

    footerComponents = () => {
        return (
            this.state.editing ? (
                <CommonButton className="ts-card-button" onClick={this.handleSave}>
                    <i className="material-icons vertical-middle">save</i>
                    {i18n.t('action.apply-changes')}
                </CommonButton>
            ) : null
        );
    }

    tabActionComponents = () => {
        const isDetail = this.state.activeKey === 'detail';
        return isDetail ? (
            <CommonButton
                className="ts-card-button"
                shape="circle"
                tooltipTitle={i18n.t('details.toggle-edit-mode')}
                onClick={this.handleClickEdit}
            >
                {
                    !this.state.editing ? (
                        <i className="material-icons vertical-middle">mode_edit</i>
                    ) : (
                        <i className="material-icons vertical-middle">close</i>
                    )
                }
            </CommonButton>
        ) : null;
    }

    render() {
        const { data, visible, options, onPressEnter, closeDialog, buttonComponents } = this.props;
        const { subscriptions, isOpened } = this.props;
        let assigendInput;
        if (!this.state.editing) {
            assigendInput = data && data.assignedCustomer ? (
                <Form.Item label={i18n.t('device.assignedToCustomer')}>
                    <Input value={data.assignedCustomer.title} readOnly disabled />
                </Form.Item>
            ) : null;
        }
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                subTitle={i18n.t('device.device-details')}
                tooltipTitle={i18n.t('action.close')}
                footer={this.footerComponents()}
            >
                <Tabs
                    activeKey={this.state.activeKey}
                    defaultActiveKey={this.state.activeKey}
                    tabBarExtraContent={this.tabActionComponents()}
                    onChange={this.handleChangeActiveTabs}
                >
                    <Tabs.TabPane tab={i18n.t('device.details')} key="detail" disabled={this.state.editing}>
                        <Row>
                            {data ? buttonComponents(data.name, data.id.id, data.customerId.id, true) : null}
                        </Row>
                        <DeviceForm
                            ref={(c) => { this.form = c; }}
                            onPressEnter={onPressEnter}
                            options={options}
                            disabled={!this.state.editing}
                            titleChangeEvent={this.handleTitleChange}
                        >
                            {assigendInput}
                        </DeviceForm>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('attribute.attributes')} key="attribute" disabled={this.state.editing}>
                        <AttributeTable
                            subscriptions={subscriptions}
                            entity={data ? data.id : undefined}
                            type={types.dataKeyType.attribute}
                            subscribers={this.props.subscribers}
                            subscribe={this.props.subscribeWithObjectForAttribute}
                            unsubscribe={this.props.unsubscribe}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('attribute.latest-telemetry')} key="latestData" disabled={this.state.editing}>
                        <AttributeTable
                            subscriptions={subscriptions}
                            entity={data ? data.id : undefined}
                            type={types.dataKeyType.timeseries}
                            subscribers={this.props.subscribers}
                            subscribe={this.props.subscribeWithObjectForAttribute}
                            unsubscribe={this.props.unsubscribe}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('device.events')} key="event" disabled={this.state.editing}>Content of Tab Pane 4</Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    if (ownProps.visible) {
        return {
            subscribers: state.telemetry.subscribers,
            isOpened: state.telemetry.isOpened,
            subscriptions: state.telemetry.subscriptions,
        };
    }
    return {
        subscribers: state.telemetry.subscribers,
        isOpened: state.telemetry.isOpened,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    subscribeWithObjectForAttribute: actions.subscribeWithObjectForAttribute,
    unsubscribe: actions.unsubscribe,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DetailDeviceDialog);
