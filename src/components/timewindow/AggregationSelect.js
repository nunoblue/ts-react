import React, { Component } from 'react';
import i18n from 'i18next';
import { Select } from 'antd';

import { types } from '../../utils/commons';

class AggregationSelect extends Component {

    handleChangeSelect = (value) => {
        console.log(value);
    }

    render() {
        return (
            <Select
                style={{ width: 120 }}
                size="large"
                labelInValue
                defaultValue={{ key: types.aggregation.avg.value }}
                onChange={this.handleChangeSelect}
            >
                {
                    Object.keys(types.aggregation).map((key) => {
                        return (
                            <Select.Option key={types.aggregation[key].value} value={types.aggregation[key].value}>
                                {i18n.t(types.aggregation[key].name)}
                            </Select.Option>
                        );
                    })
                }
            </Select>
        );
    }
}

export default AggregationSelect;
