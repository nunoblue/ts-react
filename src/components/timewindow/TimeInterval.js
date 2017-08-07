import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Select,
    Switch,
    Input,
    Row,
    Col,
} from 'antd';
import i18n from 'i18next';

import { times } from '../../utils/commons';

class TimeInterval extends Component {
    static propTypes = {
        defaultInterval: PropTypes.string,
        intervals: PropTypes.array,
    }

    static defaultProps = {
        defaultInterval: '',
        intervals: [],
    }

    state = {
        advanced: false,
        days: this.props.days || 0,
        hours: this.props.hours || 0,
        minutes: this.props.minutes || 0,
        seconds: this.props.seconds || 0,
        intervalMs: this.props.defaultInterval,
    }

    componentWillReceiveProps(nextProps) {
        if (typeof this.props.onChangeInterval !== 'undefined') {
            this.setIntervalMs(nextProps.defaultInterval);
        }
    }

    setIntervalMs = (value) => {
        if (!this.state.advanced) {
            this.setState({
                intervalMs: value,
            });
        }
        const intervalMs = parseInt(value, 10);
        const intervalSeconds = Math.floor(intervalMs / 1000);
        const days = Math.floor(intervalSeconds / 86400);
        const hours = Math.floor((intervalSeconds % 86400) / 3600);
        const minutes = Math.floor(((intervalSeconds % 86400) % 3600) / 60);
        const seconds = intervalSeconds % 60;
        this.setState({
            days,
            hours,
            minutes,
            seconds,
        });
    }

    calculateIntervalMs = (days, hours, minutes, seconds) => {
        const { onChangeTimewindowMs, onChangeInterval, intervals } = this.props;
        if (typeof days === 'undefined') {
            days = this.state.days;
        }
        if (typeof hours === 'undefined') {
            hours = this.state.hours;
        }
        if (typeof minutes === 'undefined') {
            minutes = this.state.minutes;
        }
        if (typeof seconds === 'undefined') {
            seconds = this.state.seconds;
        }
        const intervalMs = (
            ((days * 86400) +
            (hours * 3600) +
            (minutes * 60) +
            (seconds)) * 1000
        );
        if (typeof onChangeInterval !== 'undefined') {
            const firstInterval = intervals[0].value;
            const lastInterval = intervals[intervals.length - 1].value;
            if (firstInterval > intervalMs) {
                onChangeInterval(firstInterval.toString());
                this.setIntervalMs(firstInterval.toString());
                return false;
            } else if (lastInterval < intervalMs) {
                onChangeInterval(lastInterval.toString());
                this.setIntervalMs(lastInterval.toString());
                return false;
            }
        }
        if (typeof onChangeTimewindowMs !== 'undefined') {
            onChangeTimewindowMs(intervalMs.toString());
            return intervalMs.toString();
        }
        return intervalMs.toString();
    }

    handleChangeAdvanced = () => {
        const { intervals, onChangeTimewindowMs, onChangeInterval } = this.props;
        const intervalMs = this.calculateIntervalMs();
        const closest = times.closestNumber(intervals, intervalMs).toString();
        if (typeof onChangeTimewindowMs !== 'undefined') {
            onChangeTimewindowMs(closest);
        }
        if (this.state.advanced) {
            this.setState({
                intervalMs: closest,
            });
            if (typeof onChangeInterval !== 'undefined') {
                onChangeInterval(closest);
            }
        } else {
            this.setIntervalMs(this.props.defaultInterval);
        }
        this.setState({
            advanced: !this.state.advanced,
        });
    }

    handleChangeSelect = (value) => {
        const { onChangeInterval, onChangeTimewindowMs } = this.props;
        if (typeof onChangeInterval !== 'undefined') {
            onChangeInterval(value.key);
        }
        if (typeof onChangeTimewindowMs !== 'undefined') {
            onChangeTimewindowMs(value.key);
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
                const intervalMs = this.calculateIntervalMs(days, hours, minutes + 1, 0);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: 0,
                        intervalMs,
                    });
                    this.changeStepTime(minutes + 1, 'minutes');
                }
            } else if (value < 0) {
                if (days + hours + minutes === 0) {
                    const intervalMs = this.calculateIntervalMs(days, hours, minutes, 1);
                    if (intervalMs !== false) {
                        this.setState({
                            seconds: 1,
                            intervalMs,
                        });
                    }
                    return;
                }
                const intervalMs = this.calculateIntervalMs(days, hours, minutes - 1, 59);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: 59,
                        intervalMs,
                    });
                    this.changeStepTime(minutes - 1, 'minutes', 59);
                }
            } else {
                if (days + hours + minutes + value === 0) {
                    const intervalMs = this.calculateIntervalMs(days, hours, minutes, 1);
                    if (intervalMs !== false) {
                        this.setState({
                            seconds: 1,
                            intervalMs,
                        });
                    }
                    return;
                }
                const intervalMs = this.calculateIntervalMs(days, hours, minutes, value);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: value,
                        intervalMs,
                    });
                }
            }
        } else if (current === 'minutes') {
            if (value >= 60) {
                const intervalMs = this.calculateIntervalMs(days, hours + 1, 0, seconds);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: 0,
                        intervalMs,
                    });
                    this.changeStepTime(hours + 1, 'hours');
                }
            } else if (value < 0) {
                if ((days + hours + value < 0)) {
                    const intervalMs = this.calculateIntervalMs(days, hours, 0, 1);
                    if (intervalMs !== false) {
                        this.setState({
                            seconds: 1,
                            minutes: 0,
                            intervalMs,
                        });
                    }
                    return;
                }
                const intervalMs = this.calculateIntervalMs(days, hours - 1, 59, seconds);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: 59,
                        intervalMs,
                    });
                    this.changeStepTime(hours - 1, 'hours', 59);
                }
            } else {
                if (typeof prevValue !== 'undefined') {
                    if (days + hours + value + prevValue === 0) {
                        const intervalMs = this.calculateIntervalMs(days, hours, 0, 1);
                        if (intervalMs !== false) {
                            this.setState({
                                seconds: 1,
                                minutes: 0,
                                intervalMs,
                            });
                        }
                        return;
                    }
                } else {
                    if (days + hours + value + seconds === 0) {
                        const intervalMs = this.calculateIntervalMs(days, hours, 0, 1);
                        if (intervalMs !== false) {
                            this.setState({
                                seconds: 1,
                                minutes: 0,
                                intervalMs,
                            });
                        }
                        return;
                    }
                }
                const intervalMs = this.calculateIntervalMs(days, hours, value, prevValue);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: value,
                        intervalMs,
                    });
                }
            }
        } else if (current === 'hours') {
            if (value >= 24) {
                const intervalMs = this.calculateIntervalMs(days + 1, 0, minutes, seconds);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: 0,
                        intervalMs,
                    });
                    this.changeStepTime(days + 1, 'days');
                }
            } else if (value < 0) {
                if (days + value + minutes < 0) {
                    const intervalMs = this.calculateIntervalMs(days, 0, minutes, 1);
                    if (intervalMs !== false) {
                        this.setState({
                            seconds: 1,
                            hours: 0,
                            intervalMs,
                        });
                    }
                    return;
                }
                if (days === 0) {
                    return;
                }
                const intervalMs = this.calculateIntervalMs(days - 1, 23, minutes, seconds);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: 23,
                        intervalMs,
                    });
                    this.changeStepTime(days - 1, 'days', 23);
                }
            } else {
                if (typeof prevValue !== 'undefined') {
                    if (days + value + prevValue + seconds === 0) {
                        const intervalMs = this.calculateIntervalMs(days, 0, minutes, 1);
                        if (intervalMs !== false) {
                            this.setState({
                                seconds: 1,
                                hours: 0,
                                intervalMs,
                            });
                        }
                        return;
                    }
                } else {
                    if (days + value + minutes + seconds === 0) {
                        const intervalMs = this.calculateIntervalMs(days, 0, minutes, 1);
                        if (intervalMs !== false) {
                            this.setState({
                                seconds: 1,
                                hours: 0,
                                intervalMs,
                            });
                        }
                        return;
                    }
                }
                const intervalMs = this.calculateIntervalMs(days, value, prevValue, seconds);
                if (intervalMs !== false) {
                    this.setState({
                        [current]: value,
                        intervalMs,
                    });
                }
            }
        } else {
            if (value <= 0) {
                if (typeof prevValue !== 'undefined') {
                    if (value + prevValue + minutes + seconds === 0) {
                        const intervalMs = this.calculateIntervalMs(0, hours, minutes, 1);
                        if (intervalMs !== false) {
                            this.setState({
                                seconds: 1,
                                days: 0,
                                intervalMs,
                            });
                        }
                        return;
                    }
                } else {
                    if (value + hours + minutes + seconds === 0) {
                        const intervalMs = this.calculateIntervalMs(0, hours, minutes, 1);
                        if (intervalMs !== false) {
                            this.setState({
                                seconds: 1,
                                days: 0,
                                intervalMs,
                            });
                        }
                        return;
                    }
                }
            }
            const intervalMs = this.calculateIntervalMs(value, prevValue, minutes, seconds);
            if (intervalMs !== false) {
                this.setState({
                    [current]: value,
                    intervalMs,
                });
            }
        }
    }

    render() {
        const { intervals, defaultInterval } = this.props;
        const { advanced, intervalMs, days, hours, minutes, seconds } = this.state;
        const lastTimeInterval = advanced ? (
            <Row>
                <Col span={6}>
                    <label>{i18n.t('timeinterval.days')}</label>
                    <Input type="number" id="days" min={0} max={7300} onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={days} />
                </Col>
                <Col span={6}>
                    <label>{i18n.t('timeinterval.hours')}</label>
                    <Input type="number" id="hours" onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={hours} />
                </Col>
                <Col span={6}>
                    <label>{i18n.t('timeinterval.minutes')}</label>
                    <Input type="number" id="minutes" onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={minutes} />
                </Col>
                <Col span={6}>
                    <label>{i18n.t('timeinterval.seconds')}</label>
                    <Input type="number" id="seconds" onBlur={this.handleBlurTime} onChange={this.handleChangeTime} value={seconds} />
                </Col>
            </Row>
        ) : (
            <Select
                style={{ width: 120 }}
                size="large"
                labelInValue
                value={{ key: defaultInterval }}
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
                <Col span={20}>
                    {lastTimeInterval}
                </Col>
                <Col span={4}>
                    <label>{i18n.t('timeinterval.advanced')}</label>
                    <Switch
                        onChange={this.handleChangeAdvanced}
                    />
                </Col>
            </Row>
        );
    }
}

export default TimeInterval;
