import React, { Component } from 'react';
import { Row, Slider } from 'antd';

import TimeInterval from './TimeInterval';
import AggregationSelect from './AggregationSelect';
import { times, types } from '../../utils/commons';

class RealTimePanel extends Component {
    state = {
        intervals: times.getIntervals((times.MINUTE / times.MAX_LIMIT), (times.MINUTE / times.MIN_LIMIT)),
        realtime: {
            interval: times.SECOND.toString(),
            timewindowMs: times.MINUTE.toString(),
        },
        aggregation: {
            type: types.aggregation.avg.value,
            limit: times.AVG_LIMIT,
        },
    }

    handlers = {
        onChangeTimewindowMs: (value) => {
            const intervals = times.getValueIntervals(value);
            const interval = intervals[0].value.toString();
            const realtime = Object.assign({}, this.state.realtime, { timewindowMs: value, interval });
            let limit = this.state.aggregation.limit;
            if (this.state.aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(value / interval);
            }
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                realtime,
                intervals,
                aggregation,
            });
        },
        onChangeInterval: (value) => {
            const realtime = Object.assign({}, this.state.realtime, { interval: value });
            let limit = this.state.aggregation.limit;
            const timewindowMs = this.state.realtime.timewindowMs;
            if (this.state.aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(timewindowMs / value);
            }
            const aggregation = Object.assign({}, this.state.aggregation, { limit });
            this.setState({
                realtime,
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
                    <TimeInterval
                        minutes={1}
                        defaultInterval={this.props.realtime.timewindowMs}
                        intervals={times.predefIntervals}
                        onChangeTimewindowMs={this.props.onChangeTimewindowMs}
                    />
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
                                defaultInterval={this.props.realtime.interval}
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

export default RealTimePanel;
