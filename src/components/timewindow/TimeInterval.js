import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Select,
    Switch,
    InputNumber,
    Row,
} from 'antd';
import i18n from 'i18next';

import { times } from '../../utils/commons';

class TimeInterval extends Component {
    static propTypes = {
        intervals: PropTypes.array,
    }

    static defaultProps = {
        intervals: [],
    }

    state = {
        advanced: false,
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 0,
        intervalMs: times.MINUTE.toString(),
    }

    setIntervalMs = (value) => {
        const { advanced } = this.state;
        if (!advanced) {
            this.setState({
                intervalMs: value,
            });
        }
        const intervalMs = parseInt(value, 10);
        const intervalSeconds = Math.floor(intervalMs / 1000);
        this.setState({
            days: Math.floor(intervalSeconds / 86400),
            hours: Math.floor((intervalSeconds % 86400) / 3600),
            minutes: Math.floor(((intervalSeconds % 86400) % 3600) / 60),
            seconds: intervalSeconds % 60,
        });
    }

    calculateIntervalMs = () => {
        const intervalMs = (
            ((this.state.days * 86400) +
            (this.state.hours * 3600) +
            (this.state.minutes * 60) +
            (this.state.seconds)) * 1000
        );
        return intervalMs;
    }

    closestNumber = (intervalMs) => {
        const { intervals } = this.props;
        const nearest = intervals.reduce((prev, curr) => {
            return (Math.abs(curr.value - intervalMs) < Math.abs(prev.value - intervalMs)) ? curr : prev;
        });
        return nearest.value;
    }

    handleChangeAdvanced = () => {
        const intervalMs = this.calculateIntervalMs();
        const closest = this.closestNumber(intervalMs).toString();
        this.setState({
            advanced: !this.state.advanced,
            intervalMs: closest,
        });
        this.setIntervalMs(closest);
    }

    handleChangeSelect = (value) => {
        const { onChangeInterval } = this.props;
        if (typeof onChangeInterval !== 'undefined') {
            onChangeInterval(value);
        }
        this.setIntervalMs(value.key);
    }

    handleChangeTime = (e) => {
        const target = e.target.id;
        const value = parseInt(e.target.value, 10);
        this.changeStepTime(value, target);
    }

    handleBlurTime = (e) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 0) {
            this.setState({
                [e.target.id]: 0,
            });
            return false;
        }
    }

    changeStepTime = (value, current, prevValue) => {
        const { days, hours, minutes, seconds } = this.state;
        if (current === 'seconds') {
            if (value >= 60) {
                this.setState({
                    [current]: 0,
                });
                this.changeStepTime(minutes + 1, 'minutes');
            } else if (value < 0) {
                if (days + hours + minutes === 0) {
                    this.setState({
                        seconds: 1,
                    });
                    return;
                }
                this.setState({
                    [current]: 59,
                });
                this.changeStepTime(minutes - 1, 'minutes', 59);
            } else {
                if (days + hours + minutes + value === 0) {
                    this.setState({
                        seconds: 1,
                    });
                    return;
                }
                this.setState({
                    [current]: value,
                });
            }
        } else if (current === 'minutes') {
            if (value >= 60) {
                this.setState({
                    [current]: 0,
                });
                this.changeStepTime(hours + 1, 'hours');
            } else if (value < 0) {
                if ((days + hours + value < 0)) {
                    this.setState({
                        seconds: 1,
                        minutes: 0,
                    });
                    return;
                }
                this.setState({
                    [current]: 59,
                });
                this.changeStepTime(hours - 1, 'hours', 59);
            } else {
                if (typeof prevValue !== 'undefined') {
                    if (days + hours + value + prevValue === 0) {
                        this.setState({
                            seconds: 1,
                            minutes: 0,
                        });
                        return;
                    }
                } else {
                    if (days + hours + value + seconds === 0) {
                        this.setState({
                            seconds: 1,
                            minutes: 0,
                        });
                        return;
                    }
                }
                this.setState({
                    [current]: value,
                });
            }
        } else if (current === 'hours') {
            if (value >= 24) {
                this.setState({
                    [current]: 0,
                });
                this.changeStepTime(days + 1, 'days');
            } else if (value < 0) {
                if ((days + value + minutes < 0)) {
                    this.setState({
                        seconds: 1,
                        hours: 0,
                    });
                    return;
                }
                this.setState({
                    [current]: 23,
                });
                this.changeStepTime(days - 1, 'days', 23);
            } else {
                if (typeof prevValue !== 'undefined') {
                    if (days + value + prevValue + seconds === 0) {
                        this.setState({
                            seconds: 1,
                            hours: 0,
                        });
                        return;
                    }
                } else {
                    if (days + value + minutes + seconds === 0) {
                        this.setState({
                            seconds: 1,
                            hours: 0,
                        });
                        return;
                    }
                }
                this.setState({
                    [current]: value,
                });
            }
        } else {
            if (value <= 0) {
                if (typeof prevValue !== 'undefined') {
                    if (value + prevValue + minutes + seconds === 0) {
                        this.setState({
                            seconds: 1,
                            days: 0,
                        });
                        return;
                    }
                } else {
                    if (value + hours + minutes + seconds === 0) {
                        this.setState({
                            seconds: 1,
                            days: 0,
                        });
                        return;
                    }
                }
            }
            this.setState({
                [current]: value,
            });
        }
    }

    render() {
        const { intervals } = this.props;
        const { advanced, intervalMs, days, hours, minutes, seconds } = this.state;
        const lastTimeInterval = advanced ? (
            <Row>
                <input type="number" id="days" min={0} max={7300} onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={days} />
                <input type="number" id="hours" onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={hours} />
                <input type="number" id="minutes" onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={minutes} />
                <input type="number" id="seconds" onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={seconds} />
            </Row>
        ) : (
            <Select
                style={{ width: 120 }}
                size="large"
                labelInValue
                defaultValue={{ key: intervalMs }}
                onChange={this.handleChangeSelect}
            >
                {
                    intervals.map(interval => (
                        <Select.Option key={interval.value} value={interval.value.toString()}>
                            {i18n.t(interval.name.text, { value: interval.name.value })}
                        </Select.Option>
                    ))
                }
            </Select>
        );
        return (
            <Row>
                {lastTimeInterval}
                <span>{'고급'}</span>
                <Switch
                    onChange={this.handleChangeAdvanced}
                />
            </Row>
        );
    }
}

export default TimeInterval;
