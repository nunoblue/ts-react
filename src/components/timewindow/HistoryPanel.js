import React, { Component } from 'react';
import i18n from 'i18next';
import { Row, Radio } from 'antd';

import TimeInterval from './TimeInterval';
import DatePeriod from './DatePeriod';
import AggregationSelect from './AggregationSelect';
import { times } from '../../utils/commons';

class HistoryPanel extends Component {
    state = {
        datetimeType: 1,
        startDateTime: +new Date() - (1 * 1000 * 60 * 60 * 24),
        endDateTime: +new Date(),
        history: {},
    }

    handleChangeDateTimeType = (e) => {
        this.setState({
            datetimeType: e.target.value,
        });
    }

    render() {
        console.log(this.state.datetimeType);
        return (
            <Row>
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
                                        startDateTime={this.state.startDateTime}
                                        endDateTime={this.state.endDateTime}
                                    />
                                ) : null
                            }
                        </Radio>
                    </Radio.Group>
                </Row>
                <Row>
                    <AggregationSelect />
                </Row>
                <Row>
                    <TimeInterval
                        intervals={times.predefIntervals}
                    />
                </Row>
            </Row>
        );
    }
}

export default HistoryPanel;
