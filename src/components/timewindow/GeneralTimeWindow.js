import React, { Component } from 'react';
import i18n from 'i18next';
import {
    Popover,
    Row,
    Col,
    Tabs,
} from 'antd';

import { types, times } from '../../utils/commons';
import HistoryPanel from './HistoryPanel';
import RealTimePanel from './RealTimePanel';
import CommonButton from '../common/CommonButton';
import stateToProps from './StateToProps';

class GeneralTimeWindow extends Component {
    state = {
        visible: false,
    }

    onChangeVisible = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }

    handleChangeVisible = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }

    getIntervals = (min, max) => {
        const { intervals } = this.props;
        min = this.boundMinInterval(min);
        max = this.boundMaxInterval(max);
        const newIntervals = [];
        for (let i in intervals) {
            const interval = intervals[i];
            if (interval.value >= min && interval.value <= max) {
                newIntervals.push(interval);
            }
        }
        return newIntervals;
    }

    matchesExistingInterval = (min, max, intervalMs) => {
        const intervals = this.getIntervals(min, max);
        for (let i in intervals) {
            const interval = intervals[i];
            if (intervalMs === interval.value) {
                return true;
            }
        }
        return false;
    }

    boundMinInterval = (min) => {
        return this.toBound(min, times.MIN_INTERVAL, times.MAX_INTERVAL, times.MIN_INTERVAL);
    }

    boundMaxInterval = (max) => {
        return this.toBound(max, times.MIN_INTERVAL, times.MAX_INTERVAL, times.MAX_INTERVAL);
    }

    toBound = (value, min, max, defValue) => {
        if (value) {
            value = Math.max(value, min);
            value = Math.min(value, max);
            return value;
        } else {
            return defValue;
        }
    }

    handleChangeSelect = (value) => {
        const min = value.key / times.MAX_LIMIT;
        const test = this.boundMinInterval(min);
        const max = value.key / times.MIN_LIMIT;
        const test2 = this.boundMaxInterval(max);
        console.log(test, test2);
        const test3 = this.matchesExistingInterval(min, max, value.key);
        console.log(test3);
    }

    contents = () => {
        return (
            <Row>
                <Row>
                    <Tabs
                        defaultActiveKey="1"
                    >
                        <Tabs.TabPane tab={i18n.t('timewindow.realtime')} key="1">
                            <RealTimePanel {...this.props.handlers} {...this.props} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={i18n.t('timewindow.history')} key="2">
                            <HistoryPanel {...this.props.handlers} {...this.props} />
                        </Tabs.TabPane>
                    </Tabs>
                </Row>
                <Row>
                    <Col span={4}>
                        <CommonButton onClick={this.handleChangeVisible}>{'업데이트'}</CommonButton>
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
                placement={undefined}
                overlayStyle={{ width: '600px' }}
                overlayClassName={undefined}
                autoAdjustOverflow
                arrowPointAtCenter={false}
                content={this.contents()}
                trigger="click"
                visible={this.state.visible}
            >
                {buttonComponent}
            </Popover>
        );
    }
}

export default stateToProps([HistoryPanel, RealTimePanel])(GeneralTimeWindow);
