import React, { Component } from 'react';
import { Tabs } from 'antd';
import { translate } from 'react-i18next';

import CommonDialog from '../common/CommonDialog';

@translate(['device'], { wait: false })
class DetailDeviceDialog extends Component {

    handleChange = (e) => {
        console.log(e.target);
    }

    render() {
        const { t, data } = this.props;

        return (
            <CommonDialog visible={true} title={'test'} type={t('device.device-details')}>
                <Tabs defaultActiveKey="1" onChange={this.handleChange}>
                    <Tabs.TabPane tab="Tab 1" key="1">Content of Tab Pane 1</Tabs.TabPane>
                    <Tabs.TabPane tab="Tab 2" key="2">Content of Tab Pane 2</Tabs.TabPane>
                    <Tabs.TabPane tab="Tab 3" key="3">Content of Tab Pane 3</Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

export default DetailDeviceDialog;
