import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    DatePicker,
    Row,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';

class DatePeriod extends Component {
    static defaultProps = {
        startTimeMs: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]),
        endTimeMs: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]),
    }

    state = {
        startTimeMs: this.props.startTimeMs,
        endTimeMs: this.props.endTimeMs,
        endOpen: false,
    }

    datetimeParser = (date, dateString) => {
        return date ? date.valueOf() : parseInt(moment(dateString).format('x'), 10);
    }

    handleChangeStartDateTime = (date, dateString) => {
        const { onChangeStartTimeMs } = this.props;
        const startTimeMs = this.datetimeParser(date, dateString);
        if (typeof onChangeStartTimeMs !== 'undefined') {
            onChangeStartTimeMs(startTimeMs);
        }
        this.setState({
            startTimeMs,
        });
    }

    handleChangeEndDateTime = (date, dateString) => {
        const { onChangeEndTimeMs } = this.props;
        const endTimeMs = this.datetimeParser(date, dateString);
        if (typeof onChangeEndTimeMs !== 'undefined') {
            onChangeEndTimeMs(endTimeMs);
        }
        this.setState({
            endTimeMs,
        });
    }

    disabledStartDateTime = (startDate) => {
        const endTimeMs = this.state.endTimeMs;
        if (!startDate || !endTimeMs) {
            return false;
        }
        return startDate.valueOf() > endTimeMs;
    }

    disabledEndDateTime = (endDate) => {
        const startTimeMs = this.state.startTimeMs;
        if (!endDate || !startTimeMs) {
            return false;
        }
        return endDate.valueOf() < startTimeMs;
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    render() {
        const { startTimeMs, endTimeMs } = this.props;
        return (
            <Row>
                <DatePicker
                    showTime
                    placeholder={'Start Date'}
                    format="YYYY-MM-DD HH:mm:ss"
                    locale={enUS.DatePicker}
                    value={isNaN(startTimeMs) ? null : moment(startTimeMs)}
                    defaultValue={moment(this.state.startTimeMs)}
                    disabledDate={this.disabledStartDateTime}
                    onChange={this.handleChangeStartDateTime}
                    onOpenChange={this.handleStartOpenChange}
                />
                <DatePicker
                    showTime
                    placeholder={'End Date'}
                    format="YYYY-MM-DD HH:mm:ss"
                    locale={enUS.DatePicker}
                    value={isNaN(endTimeMs) ? null : moment(endTimeMs)}
                    defaultValue={moment(this.state.endTimeMs)}
                    open={this.state.endOpen}
                    disabledDate={this.disabledEndDateTime}
                    onChange={this.handleChangeEndDateTime}
                    onOpenChange={this.handleEndOpenChange}
                />
            </Row>
        );
    }
}

export default DatePeriod;
