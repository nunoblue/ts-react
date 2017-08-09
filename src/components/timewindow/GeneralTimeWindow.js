import React, { Component } from 'react';
import i18n from 'i18next';
import {
    Popover,
    Row,
    Col,
    Tabs,
} from 'antd';
import moment from 'moment';

import HistoryPanel from './HistoryPanel';
import RealTimePanel from './RealTimePanel';
import CommonButton from '../common/CommonButton';
import stateToProps from '../StateToProps';
import { times } from '../../utils/commons';

class GeneralTimeWindow extends Component {
    state = {
        visible: false,
        activeKey: 'realtime',
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.visible !== this.state.visible) {
            return true;
        } else if (prevProps.history !== this.props.history) {
            return true;
        } else if (prevProps.realtime !== this.props.realtime) {
            return true;
        }
        return false;
    }

    handleClickUpdate = () => {
        const { onClickUpdate } = this.props;
        const { activeKey } = this.state;
        if (typeof onClickUpdate !== 'undefined') {
            this.props.onClickUpdate(this.props[activeKey]);
        }
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

    timeLabel = () => {
        const { activeKey } = this.state;
        let label;
        if (activeKey === 'realtime') {
            const timewindowMs = this.props[activeKey].realtime.timewindowMs;
            const name = times.closestName(times.predefIntervals, timewindowMs);
            const value = times.closestValue(times.predefIntervals, timewindowMs);
            label = (
                `${i18n.t('timewindow.realtime')}-${i18n.t('timewindow.last-prefix')} ${i18n.t(name, { value })}`
            );
        } else {
            const historyType = this.props[activeKey].history.historyType;
            const timewindowMs = this.props[activeKey].history.timewindowMs;
            if (historyType === 0) {
                const name = times.closestName(times.predefIntervals, timewindowMs);
                const value = times.closestValue(times.predefIntervals, timewindowMs);
                label = (
                    `${i18n.t('timewindow.history')}-${i18n.t('timewindow.last-prefix')} ${i18n.t(name, { value })}`
                );
            } else {
                const startTime = moment(this.props[activeKey].history.fixedTimewindow.startTimeMs).format('YYYY-MM-DD HH:mm:ss');
                const endTime = moment(this.props[activeKey].history.fixedTimewindow.endTimeMs).format('YYYY-MM-DD HH:mm:ss');
                label = (
                    `${i18n.t('timewindow.history')}-${i18n.t('timewindow.period', { startTime, endTime })}`
                );
            }
        }
        return label;
    }

    render() {
        const { children } = this.props;
        const buttonComponent = children || (
            <CommonButton
                className="ts-card-button"
                onClick={this.handleChangeVisible}
            >
                {this.timeLabel()}
            </CommonButton>
        );
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
