import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Row, Select, Form, Input } from 'antd';
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
        attributesScope: types.attributesScope.client,
    }

    handleClickEdit = () => {
        const { onCancelDialogEdit } = this.props;
        if (this.state.editing) {
            onCancelDialogEdit();
        }
        this.setState({
            editing: !this.state.editing,
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

    handleSelect = (value) => {
        this.setState({
            attributesScope: types.attributesScope[value],
        });
    }

    footerComponents = () => {
        return (
            this.state.editing ? (
                <CommonButton className="ts-card-button" onClick={this.handleSave}>
                    <i className="material-icons margin-right-8 vertical-middle">save</i>
                    {i18n.t('action.apply-changes')}
                </CommonButton>
            ) : null
        );
    }

    tabActionComponents = () => {
        return (
            <CommonButton
                className="ts-card-button"
                shape="circle"
                tooltipTitle={i18n.t('details.toggle-edit-mode')}
                onClick={this.handleClickEdit}
            >
                {
                    !this.state.editing ? (
                        <i className="material-icons margin-right-8 vertical-middle">mode_edit</i>
                    ) : (
                        <i className="material-icons margin-right-8 vertical-middle">close</i>
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
                    defaultActiveKey="1"
                    tabBarExtraContent={this.tabActionComponents()}
                >
                    <Tabs.TabPane tab={i18n.t('device.details')} key="1">
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
                    <Tabs.TabPane tab={i18n.t('attribute.attributes')} key="2">
                        <Select defaultValue={i18n.t(types.attributesScope.client.name)} onChange={this.handleChange} onSelect={this.handleSelect}>
                            <Select.Option value="client">
                                {i18n.t(types.attributesScope.client.name)}
                            </Select.Option>
                            <Select.Option value="server">
                                {i18n.t(types.attributesScope.server.name)}
                            </Select.Option>
                            <Select.Option value="shared">
                                {i18n.t(types.attributesScope.shared.name)}
                            </Select.Option>
                        </Select>
                        <AttributeTable
                            subscriptions={subscriptions}
                            entityId={data ? data.id.id : undefined}
                            type={types.dataKeyType.attribute}
                            attributeScope={this.state.attributesScope}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('attribute.latest-telemetry')} key="3">
                        <AttributeTable
                            subscriptions={subscriptions}
                            entityId={data ? data.id.id : undefined}
                            type={types.dataKeyType.timeseries}
                            attributeScope={types.latestTelemetry}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('device.events')} key="4">Content of Tab Pane 4</Tabs.TabPane>
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
