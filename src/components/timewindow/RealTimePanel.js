import React, { Component } from 'react';
import { Row } from 'antd';

import TimeInterval from './TimeInterval';
import AggregationSelect from './AggregationSelect';
import { times } from '../../utils/commons';

class RealTimePanel extends Component {
    state = {
        realtime: {},
    }

    handlers = {
        changeLast: () => {

        },
    }

    handleChangeLast = () => {

    }

    render() {
        return (
            <Row>
                <TimeInterval
                    intervals={times.predefIntervals}
                />
                <AggregationSelect />
                <TimeInterval
                    intervals={times.predefIntervals}
                />
            </Row>
        );
    }
}

export default RealTimePanel;
