import React, { Component } from 'react';
import i18n from 'i18next';
import { Row, Radio, Slider } from 'antd';

import TimeInterval from './TimeInterval';
import DatePeriod from './DatePeriod';
import AggregationSelect from './AggregationSelect';
import { times, types } from '../../utils/commons';

class HistoryPanel extends Component {
    state = {
        intervals: times.getIntervals((times.MINUTE / times.MAX_LIMIT), (times.MINUTE / times.MIN_LIMIT)),
        history: {
            historyType: 0,
            interval: times.SECOND.toString(),
            timewindowMs: times.MINUTE.toString(),
            fixedTimewindow: {
                startTimeMs: +new Date() - times.DAY,
                endTimeMs: +new Date(),
            },
        },
        aggregation: {
            type: types.aggregation.avg.value,
            limit: times.AVG_LIMIT,
        },
    }

    handlers = {
        onChangeHistoryType: (e) => {
            let timewindowMs = this.state.history.timewindowMs;
            let intervals = times.getValueIntervals(timewindowMs);
            if (e.target.value === 1) {
                const gapInterval = this.state.history.fixedTimewindow.endTimeMs - this.state.history.fixedTimewindow.startTimeMs;
                intervals = times.getValueIntervals(gapInterval);
                timewindowMs = gapInterval.toString();
            } else {
                timewindowMs = times.closestNumber(times.predefIntervals, timewindowMs).toString();
                intervals = times.getValueIntervals(timewindowMs);
            }
            const interval = intervals[0].value.toString();
            const history = Object.assign({}, this.state.history, { historyType: e.target.value, interval, timewindowMs });
            let limit = this.state.aggregation.limit;
            if (this.state.aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(timewindowMs / interval);
            }
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                intervals,
                history,
                aggregation,
            });
        },
        onChangeTimewindowMs: (value) => {
            const intervals = times.getValueIntervals(value);
            const interval = intervals[0].value.toString();
            const history = Object.assign({}, this.state.history, { timewindowMs: value, interval });
            let limit = this.state.aggregation.limit;
            if (this.state.aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(value / interval);
            }
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                intervals,
                history,
                aggregation,
            });
        },
        onChangeInterval: (value) => {
            const history = Object.assign({}, this.state.history, { interval: value });
            const timewindowMs = this.state.history.timewindowMs;
            let limit = this.state.aggregation.limit;
            if (this.state.aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(timewindowMs / value);
            }
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                history,
                aggregation,
            });
        },
        onChangeStartTimeMs: (value) => {
            let intervals = this.state.intervals;
            let interval = this.state.history.interval;
            let timewindowMs = this.state.history.timewindowMs;
            if (!isNaN(value)) {
                const gapInterval = this.state.history.fixedTimewindow.endTimeMs - value;
                intervals = times.getValueIntervals(gapInterval);
                interval = intervals[0].value.toString();
                timewindowMs = gapInterval;
            }
            const fixedTimewindow = Object.assign({}, this.state.history.fixedTimewindow, { startTimeMs: value });
            const history = Object.assign({}, this.state.history, { fixedTimewindow, interval, timewindowMs });
            let limit = this.state.aggregation.limit;
            if (this.state.aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(timewindowMs / interval);
            }
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                intervals,
                history,
                aggregation,
            });
        },
        onChangeEndTimeMs: (value) => {
            let intervals = this.state.intervals;
            let interval = this.state.history.interval;
            let timewindowMs = this.state.history.timewindowMs;
            if (!isNaN(value)) {
                const gapInterval = value - this.state.history.fixedTimewindow.startTimeMs;
                intervals = times.getValueIntervals(gapInterval);
                interval = intervals[0].value.toString();
                timewindowMs = gapInterval;
            }
            const fixedTimewindow = Object.assign({}, this.state.history.fixedTimewindow, { endTimeMs: value });
            const history = Object.assign({}, this.state.history, { fixedTimewindow, interval, timewindowMs });
            let limit = this.state.aggregation.limit;
            if (this.state.aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(timewindowMs / interval);
            }
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                intervals,
                history,
                aggregation,
            });
        },
        onChangeAggregation: (value) => {
            const type = value;
            const aggregation = Object.assign({}, this.state.aggregation, { type });
            this.setState({
                aggregation,
            });
        },
        onChangeAggregationLimit: (value) => {
            const limit = value;
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                aggregation,
            });
        },
    }

    render() {
        return (
            <Row>
                <Row>
                    <Radio.Group
                        defaultValue={0}
                        onChange={this.props.onChangeHistoryType}
                    >
                        <Radio value={0}>
                            <label>{i18n.t('timewindow.last')}</label>
                            {
                                this.props.history.historyType === 0 ? (
                                    <TimeInterval
                                        minutes={1}
                                        defaultInterval={this.props.history.timewindowMs}
                                        intervals={times.predefIntervals}
                                        onChangeTimewindowMs={this.props.onChangeTimewindowMs}
                                    />
                                ) : null
                            }
                        </Radio>
                        <Radio value={1}>
                            <label>{i18n.t('timewindow.time-period')}</label>
                            {
                                this.props.history.historyType === 1 ? (
                                    <DatePeriod
                                        startTimeMs={this.props.history.fixedTimewindow.startTimeMs}
                                        endTimeMs={this.props.history.fixedTimewindow.endTimeMs}
                                        onChangeStartTimeMs={this.props.onChangeStartTimeMs}
                                        onChangeEndTimeMs={this.props.onChangeEndTimeMs}
                                    />
                                ) : null
                            }
                        </Radio>
                    </Radio.Group>
                </Row>
                <Row>
                    <AggregationSelect onChangeAggregation={this.props.onChangeAggregation} />
                </Row>
                <Row>
                    {
                        this.props.aggregation.type === types.aggregation.none.value ? (
                            <Slider
                                min={times.MIN_LIMIT}
                                max={times.MAX_LIMIT}
                                step={1}
                                defaultValue={this.props.aggregation.limit}
                                onAfterChange={this.props.onChangeAggregationLimit}
                            />
                        ) : (
                            <TimeInterval
                                seconds={1}
                                defaultInterval={this.props.history.interval}
                                intervals={this.props.intervals}
                                onChangeInterval={this.props.onChangeInterval}
                            />
                        )
                    }
                </Row>
            </Row>
        );
    }
}

export default HistoryPanel;
