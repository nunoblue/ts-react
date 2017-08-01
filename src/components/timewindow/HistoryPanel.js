import React, { Component } from 'react';
import i18n from 'i18next';
import { Row, Radio } from 'antd';

import TimeInterval from './TimeInterval';
import DatePeriod from './DatePeriod';
import AggregationSelect from './AggregationSelect';
import { times } from '../../utils/commons';

class HistoryPanel extends Component {
    state = {
        dateTimeType: 1,
        history: {},
    }

    handlers = {
        onChangedateTimeType: (e) => {
            this.setState({
                dateTimeType: e.target.value,
            });
        },
    }

    render() {
        return (
            <Row>
                <Row>
                    <Radio.Group
                        defaultValue={1}
                        onChange={this.props.onChangedateTimeType}
                    >
                        <Radio value={1}>
                            <label>{i18n.t('timewindow.last')}</label>
                            {
                                this.props.dateTimeType === 1 ? (
                                    <TimeInterval
                                        intervals={times.predefIntervals}
                                    />
                                ) : null
                            }
                        </Radio>
                        <Radio value={2}>
                            <label>{i18n.t('timewindow.time-period')}</label>
                            {
                                this.props.dateTimeType === 2 ? (
                                    <DatePeriod
                                        
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
