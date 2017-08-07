import React, { Component } from 'react';
import { Row, Slider } from 'antd';

import TimeInterval from './TimeInterval';
import AggregationSelect from './AggregationSelect';
import { times, types } from '../../utils/commons';

class RealTimePanel extends Component {
    state = {
        realtime: {
            intervals: times.getIntervals((times.MINUTE / times.MAX_LIMIT), (times.MINUTE / times.MIN_LIMIT)),
            realtime: {
                interval: times.SECOND.toString(),
                timewindowMs: times.MINUTE.toString(),
            },
            aggregation: {
                type: types.aggregation.avg.value,
                limit: times.AVG_LIMIT,
            },
        },
    }

    handlers = {
        id: 'realtime',
        onChangeTimewindowMs: (value) => {
            const id = this.handlers.id;
            const intervals = times.getValueIntervals(value);
            const interval = intervals[0].value.toString();
            let realtime = Object.assign({}, this.state[id].realtime, { timewindowMs: value, interval });
            let limit = this.state[id].aggregation.limit;
            if (this.state[id].aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(value / interval);
            }
            const aggregation = Object.assign({}, this.state[id].aggregation, { limit });
            realtime = Object.assign({}, this.state[id], { realtime, intervals, aggregation });
            this.setState({
                [id]: realtime,
            });
        },
        onChangeInterval: (value) => {
            const id = this.handlers.id;
            let realtime = Object.assign({}, this.state[id].realtime, { interval: value });
            let limit = this.state[id].aggregation.limit;
            const timewindowMs = this.state[id].realtime.timewindowMs;
            if (this.state[id].aggregation.type !== types.aggregation.none.value) {
                limit = Math.ceil(timewindowMs / value);
            }
            const aggregation = Object.assign({}, this.state[id].aggregation, { limit });
            realtime = Object.assign({}, this.state[id], { realtime, aggregation });
            this.setState({
                [id]: realtime,
            });
        },
        onChangeAggregation: (value) => {
            const id = this.handlers.id;
            const type = value;
            const aggregation = Object.assign({}, this.state[id].aggregation, { type });
            const realtime = Object.assign({}, this.state[id], { aggregation });
            this.setState({
                [id]: realtime,
            });
        },
        onChangeAggregationLimit: (value) => {
            const id = this.handlers.id;
            const limit = value;
            const aggregation = Object.assign({}, this.state[id].aggregation, { limit });
            const realtime = Object.assign({}, this.state[id], { aggregation });
            this.setState({
                [id]: realtime,
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
