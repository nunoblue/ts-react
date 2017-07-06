import React, { Component } from 'react';
import { Tabs, Switch, Button, Row, Col } from 'antd';

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
        const { t, visible, options, onPressEnter, closeDialog } = this.props;
        console.log('ttt2');
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                type={t('device.device-details')}
                tooltipTitle="상세정보 닫기"
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={t('device.details')} key="1">
                        <Row>
                            <CommonButton className="ts-dialog-button">
                                <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                                {t('device.copyId')}
                            </CommonButton>
                            <CommonButton className="ts-dialog-button">
                                <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                                {t('device.copyAccessToken')}
                            </CommonButton>
                            <Switch checkedChildren={'쓰기'} unCheckedChildren={'읽기'} checked={this.state.editing} onChange={this.changeEdit}>
                                {t('details:details.toggle-edit-mode')}
                            </Switch>
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
                                    {t('action:action.apply-changes')}
                                </CommonButton>
                            ) : null}
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={t('attribute:attribute.attributes')} key="2">Content of Tab Pane 2</Tabs.TabPane>
                    <Tabs.TabPane tab={t('attribute:attribute.latest-lelmetry')} key="3">Content of Tab Pane 3</Tabs.TabPane>
                    <Tabs.TabPane tab={t('device.events')} key="4">Content of Tab Pane 4</Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

export default DetailDeviceDialog;
