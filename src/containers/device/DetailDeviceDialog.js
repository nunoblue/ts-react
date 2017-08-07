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
                <CommonButton className="ts-dialog-button" onClick={this.handleSave}>
                    <i className="material-icons margin-right-8 vertical-middle">save</i>
                    {i18n.t('action.apply-changes')}
                </CommonButton>
            ) : null
        );
    }

    tabActionComponents = () => {
        return (
            <CommonButton
                className="ts-dialog-button"
                tooltipTitle={i18n.t('details.toggle-edit-mode')}
                onClick={this.handleClickEdit}
            >
                {
                    !this.state.editing ? (
                        <i className="material-icons">mode_edit</i>
                    ) : (
                        <i className="material-icons">close</i>
                    )
                }
            </CommonButton>
        );
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
        console.log(data);
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
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('attribute.latest-telemetry')} key="latestData" disabled={this.state.editing}>
                        <AttributeTable
                            subscriptions={subscriptions}
                            entity={data ? data.id : undefined}
                            type={types.dataKeyType.timeseries}
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
            isOpened: state.telemetry.isOpened,
            subscriptions: state.telemetry.subscriptions,
        };
    }
    return {
        isOpened: state.telemetry.isOpened,
    };
};

export default connect(mapStateToProps, null, null, { withRef: true })(DetailDeviceDialog);
