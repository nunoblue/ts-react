import React, { Component } from 'react';
import {
    DatePicker,
    Row,
} from 'antd';

class DatePeriod extends Component {
    render() {
        return (
            <Row>
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                />
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                />
            </Row>
        );
    }
}

export default DatePeriod;
