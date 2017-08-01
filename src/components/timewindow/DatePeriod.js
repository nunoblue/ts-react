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
        startDateTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]),
        endDateTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]),
    }

    handleChangeStartDateTime = (date, dateString) => {
        console.log(date, dateString);
    }

    handleChangeEndDateTime = (date, dateString) => {
        console.log(date, dateString);
    }

    render() {
        const startDateTime = +new Date() - (1 * 1000 * 60 * 60 * 24);
        const endDateTime = +new Date();
        return (
            <Row>
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    locale={enUS.DatePicker}
                    defaultValue={moment(startDateTime)}
                    onChange={this.handleChangeStartDateTime}
                />
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    locale={enUS.DatePicker}
                    defaultValue={moment(endDateTime)}
                    onChange={this.handleChangeEndDateTime}
                />
            </Row>
        );
    }
}

export default DatePeriod;
