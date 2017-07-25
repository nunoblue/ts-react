import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Row, Layout, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import i18n from 'i18next';
import moment from 'moment';

import CommonButton from '../common/CommonButton';
import { types } from '../../utils/commons';

class AttributeTable extends Component {

    static defaultProps = {
        subscriptions: {},
        type: '',
        entityId: '',
    }

    static propTypes = {
        subscriptions: PropTypes.object,
        type: PropTypes.string,
        entityId: PropTypes.string,
    }

    state = {
        selectedRowKeys: [],  // Check here to configure the default column
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    rowClick = (record) => {
        const key = record.key;
        const selectedRowKeys = this.state.selectedRowKeys;
        if (selectedRowKeys.indexOf(key) !== -1) {
            const index = selectedRowKeys.indexOf(key);
            selectedRowKeys.splice(index, 1);
            this.onSelectChange(selectedRowKeys);
            return;
        }
        selectedRowKeys.push(key);
        this.onSelectChange(selectedRowKeys);
    }

    attributeData = {
        getData: (subscriptions, entityId, type, attributeScope) => {
            let dataSource = [];
            if (typeof subscriptions === 'undefined' || Object.keys(subscriptions).length === 0) {
                return dataSource;
            }
            const pickSubscription = Object.values(subscriptions).filter((value) => {
                if (value.subscriptionCommand.entityId === entityId) {
                    return value.type === type;
                }
            }).filter((value) => {
                return value.subscriptionCommand.scope === attributeScope;
            });
            if (pickSubscription.length === 0) {
                return dataSource;
            }
            const attributes = Object.values(pickSubscription)[0].attributes;
            dataSource = Object.keys(attributes).map((key, index) => {
                const lastUpdateTs = moment(attributes[key].lastUpdateTs).format('YYYY-MM-DD HH:mm:ss');
                return {
                    key,
                    lastUpdateTs,
                    attributeKey: key,
                    value: attributes[key].value,
                };
            });
            const data = {
                dataSource,
                rowLength: dataSource.length,
            };
            return data;
        },
        columns: [{
            title: i18n.t('attribute.last-update-time'),
            dataIndex: 'lastUpdateTs',
        }, {
            title: i18n.t('attribute.key'),
            dataIndex: 'attributeKey',
        }, {
            title: i18n.t('attribute.value'),
            dataIndex: 'value',
        }],
    }

    render() {
        const { subscriptions, entityId, type, attributeScope } = this.props;
        const title = this.state.selectedRowKeys.length === 0 ? (
            <Layout.Header className="ts-dialog-title">
                <Row>
                    <Col span={20}>
                        <span className="ts-dialog-detail-title">{i18n.t(attributeScope.name)}</span>
                    </Col>
                    <Col span={4}>
                        <CommonButton shape="circle" onClick={this.searchKeyClick} tooltipTitle={i18n.t('action.search')}>
                            <i className="material-icons vertical-middle">search</i>
                        </CommonButton>
                    </Col>
                </Row>
            </Layout.Header>
        ) : (
            <Layout.Header className="ts-dialog-title">
                <Row>
                    <Col span={20}>
                        <span className="ts-dialog-detail-title">
                            {
                                type === types.dataKeyType.attribute ?
                                i18n.t('attribute.selected-attributes', { count: this.state.selectedRowKeys.length })
                                : i18n.t('attribute.selected-telemetry', { count: this.state.selectedRowKeys.length })
                            }
                        </span>
                    </Col>
                    <Col span={4}>
                        <CommonButton onClick={this.searchKeyClick} tooltipTitle={i18n.t('attribute.show-on-widget')}>
                            <i className="material-icons vertical-middle">widgets</i>
                            {i18n.t('attribute.show-on-widget')}
                        </CommonButton>
                    </Col>
                </Row>
            </Layout.Header>
        );
        const data = this.attributeData.getData(subscriptions, entityId, type, attributeScope.value);
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <Row>
                <Table
                    columns={this.attributeData.columns}
                    dataSource={data.dataSource}
                    title={() => title}
                    locale={{ emptyText: i18n.t('attribute.no-data') }}
                    pagination={{
                        total: data.rowLength,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        defaultPageSize: 5,
                        defaultCurrent: 1,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['5', '10', '15', '20', '25', '30'],
                        locale: enUS.Pagination,
                        onChange: (page, pageSize) => { },
                    }}
                    rowSelection={rowSelection}
                    onRowClick={this.rowClick}
                />
            </Row>
        );
    }
}

export default AttributeTable;
