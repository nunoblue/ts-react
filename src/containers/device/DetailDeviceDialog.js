import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, Switch, Row, Select } from 'antd';
import i18n from 'i18next';

import CommonDialog from '../../components/common/CommonDialog';
import CommonButton from '../../components/common/CommonButton';
import DeviceForm from '../../components/device/DeviceForm';
import AttributeTable from '../../components/attribute/AttributeTable';
import { types } from '../../utils/commons';

class DetailDeviceDialog extends Component {
    state = {
        editing: false,
        title: null,
        attributesScope: types.attributesScope.client,
    }

    changeEdit = () => {
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
        const type = 'dialog';
        this.props.onSave(type);
    }

    handleTitleChange = (value) => {
        this.setState({
            title: value,
        });
    }

    handleSelect = (value, option) => {
        this.setState({
            attributesScope: types.attributesScope[value],
        });
    }

    render() {
        const { data, visible, options, onPressEnter, closeDialog, buttonComponents } = this.props;
        const { subscriptions, isOpened } = this.props;
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                subTitle={i18n.t('device.device-details')}
                tooltipTitle={i18n.t('action.close')}
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={i18n.t('device.details')} key="1">
                        <Row>
                            {data ? buttonComponents(data.name, data.id.id, data.customerId.id) : null}
                            <CommonButton className="ts-dialog-button">
                                <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                                {i18n.t('device.copyId')}
                            </CommonButton>
                            <CommonButton className="ts-dialog-button">
                                <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                                {i18n.t('device.copyAccessToken')}
                            </CommonButton>
                            <Switch checkedChildren={i18n.t('action.edit')} unCheckedChildren={i18n.t('action.view')} checked={this.state.editing} onChange={this.changeEdit}>
                                {i18n.t('details.toggle-edit-mode')}
                            </Switch>
                        </Row>
                        <DeviceForm
                            ref={(c) => { this.form = c; }}
                            onPressEnter={onPressEnter}
                            options={options}
                            disabled={!this.state.editing}
                            titleChangeEvent={this.handleTitleChange}
                        />
                        {this.state.editing ? (
                            <CommonButton className="ts-dialog-button" onClick={this.handleSave}>
                                <i className="material-icons margin-right-8 vertical-middle">save</i>
                                {i18n.t('action.apply-changes')}
                            </CommonButton>
                        ) : null}
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
    
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DetailDeviceDialog);
