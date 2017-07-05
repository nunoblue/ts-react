import React, { Component } from 'react';
import { Tabs } from 'antd';

import CommonDialog from '../common/CommonDialog';
import DeviceForm from './DeviceForm';

class DetailDeviceDialog extends Component {
    render() {
        const { t, data, visible, options, onPressEnter, closeDialog } = this.props;
        return (
            <CommonDialog onClick={closeDialog} visible={visible} title={'test'} type={t('device.device-details')}>
                <Tabs defaultActiveKey="1" onChange={this.handleChange}>
                    <Tabs.TabPane tab={t('device.details')} key="1">
                        <DeviceForm ref={(c) => { this.form = c; }} value={data} onPressEnter={onPressEnter} options={options} />
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
