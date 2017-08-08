import React, { Component } from 'react';
import i18n from 'i18next';
import {
    Popover,
    Row,
    Col,
    Tabs,
} from 'antd';

import HistoryPanel from './HistoryPanel';
import RealTimePanel from './RealTimePanel';
import CommonButton from '../common/CommonButton';
import stateToProps from '../StateToProps';

class GeneralTimeWindow extends Component {
    state = {
        visible: false,
        activeKey: 'realtime',
    }

    handleClickUpdate = () => {
        const { activeKey } = this.state;
        console.log(this.props[activeKey]);
        this.handleChangeVisible();
    }

    handleChangeVisible = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }

    handleChangeTab = (activeKey) => {
        this.setState({
            activeKey,
        });
    }

    contents = () => {
        return (
            <Row>
                <Row>
                    <Tabs
                        defaultActiveKey="realtime"
                        onChange={this.handleChangeTab}
                    >
                        <Tabs.TabPane tab={i18n.t('timewindow.realtime')} key="realtime">
                            <RealTimePanel {...this.props.handlers.realtime} {...this.props.realtime} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={i18n.t('timewindow.history')} key="history">
                            <HistoryPanel {...this.props.handlers.history} {...this.props.history} />
                        </Tabs.TabPane>
                    </Tabs>
                </Row>
                <Row>
                    <Col span={4}>
                        <CommonButton onClick={this.handleClickUpdate}>{'업데이트'}</CommonButton>
                    </Col>
                    <Col span={4}>
                        <CommonButton type="default" onClick={this.handleChangeVisible}>{'취소'}</CommonButton>
                    </Col>
                </Row>
            </Row>
        );
    }

    render() {
        const { children } = this.props;
        const buttonComponent = children || <CommonButton onClick={this.handleChangeVisible} />;
        return (
            <Popover
                placement="topLeft"
                overlayStyle={{ width: '600px' }}
                overlayClassName={undefined}
                autoAdjustOverflow
                arrowPointAtCenter
                content={this.contents()}
                trigger="click"
                visible={this.state.visible}
            >
                {buttonComponent}
            </Popover>
        );
    }
}

export default stateToProps([{ history: HistoryPanel }, { realtime: RealTimePanel }])(GeneralTimeWindow);
