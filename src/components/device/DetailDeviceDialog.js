import React, { Component } from 'react';
import { Tabs, Switch, Row } from 'antd';
import i18n from 'i18next';

import CommonDialog from '../common/CommonDialog';
import CommonButton from '../common/CommonButton';
import DeviceForm from './DeviceForm';

class DetailDeviceDialog extends Component {
    state = {
        editing: false,
        title: null,
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

    render() {
        const { data, visible, options, onPressEnter, closeDialog, buttonComponents } = this.props;
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
                    <Tabs.TabPane tab={i18n.t('attribute.attributes')} key="2">Content of Tab Pane 2</Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('attribute.latest-telemetry')} key="3">Content of Tab Pane 3</Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('device.events')} key="4">Content of Tab Pane 4</Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

export default DetailDeviceDialog;
