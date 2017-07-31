import React, { Component } from 'react';
import i18n from 'i18next';
import {
    Popover,
    DatePicker,
    TimePicker,
    Select,
    Switch,
    InputNumber,
    Row,
    Col,
    Tabs,
    Radio,
} from 'antd';

import { types, times } from '../../utils/commons';
import TimeInterval from './datetime/TimeInterval';
import DatePeriod from './datetime/DatePeriod';
import CommonButton from '../common/CommonButton';

class GeneralTimeWindow extends Component {
    state = {
        visible: false,
        datetimeType: 1,
    }

    handleHide = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }

    handeVisibleChange = (visible) => {
        console.log(visible);
        this.setState({
            visible,
        });
    }

    handleChangeSelect = (value) => {
        console.log(value);
    }

    aggregationContents = () => {
        return (
            <Select
                style={{ width: 120 }}
                size="large"
                labelInValue
                defaultValue={{ key: types.aggregation.avg.value }}
                onChange={this.handleChangeSelect}
            >
                {
                    Object.keys(types.aggregation).map((key) => {
                        return (
                            <Select.Option key={types.aggregation[key].value} value={types.aggregation[key].value}>
                                {i18n.t(types.aggregation[key].name)}
                            </Select.Option>
                        );
                    })
                }
            </Select>
        );
    }

    realtimeContents = () => {
        return (
            <Row>
                <TimeInterval
                    intervals={times.predefIntervals}
                />
                {this.aggregationContents()}
                <TimeInterval
                    intervals={times.predefIntervals}
                />
            </Row>
        );
    }

    handleChangeDateTimeType = (e) => {
        console.log(e.target.value);
        this.setState({
            datetimeType: e.target.value,
        });
    }

    historyContents = () => {
        return (
            <Row>
                <Radio.Group
                    value={this.state.datetimeType}
                    onChange={this.handleChangeDateTimeType}
                >
                    <Radio value={1}>
                        <label>{i18n.t('timewindow.last')}</label>
                        {
                            this.state.datetimeType === 1 ? (
                                <TimeInterval
                                    intervals={times.predefIntervals}
                                />
                            ) : null
                        }
                    </Radio>
                    <Radio value={2}>
                        <label>{i18n.t('timewindow.time-period')}</label>
                        {
                            this.state.datetimeType === 2 ? (
                                <DatePeriod

                                />
                            ) : null
                        }
                    </Radio>
                </Radio.Group>
                {this.aggregationContents()}
                <TimeInterval
                    intervals={times.predefIntervals}
                />
            </Row>
        );
    }

    contents = () => {
        return (
            <Row>
                <Tabs
                    defaultActiveKey="1"
                >
                    <Tabs.TabPane tab={i18n.t('timewindow.realtime')} key="1">
                        {this.realtimeContents()}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('timewindow.history')} key="2">
                        {this.historyContents()}
                    </Tabs.TabPane>
                </Tabs>
                <CommonButton>{'업데이트'}</CommonButton>
                <CommonButton type="default">{'취소'}</CommonButton>
            </Row>
        );
    }

    render() {
        const { children } = this.props;
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
                onVisibleChange={this.handeVisibleChange}
            >
                {children}
            </Popover>
        );
    }
}

export default GeneralTimeWindow;
