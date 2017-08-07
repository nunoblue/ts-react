import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Row, Layout, Col, Select, Button, notification } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import i18n from 'i18next';
import moment from 'moment';

import CommonButton from '../common/CommonButton';
import AttributeAddModal from '../attribute/AttributeAddModal';
import { types } from '../../utils/commons';
import { telemetryService } from '../../services/api';

class AttributeTable extends Component {

    static defaultProps = {
        subscriptions: {},
        type: '',
        entity: {},
    }

    static propTypes = {
        subscriptions: PropTypes.object,
        type: PropTypes.string,
        entity: PropTypes.object,
    }

    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        attributesScope: this.props.type === types.dataKeyType.timeseries ? types.latestTelemetry : types.attributesScope.client,
        attributes: {},
    };

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const data = this.attributeData.getData(nextProps.subscriptions, nextProps.entity.id, nextProps.type, this.state.attributesScope.value);
        console.log(data);
        this.setState({
            attributes: data,
        });
    }

    refreshAttributeTable = () => {
        const { entity } = this.props;
        const entityType = entity.entityType;
        const entityId = entity.id;
        const attributesCope = this.state.attributesScope.value;
        telemetryService.getEntityAttributes(entityType, entityId, attributesCope, { ignoreLoading: true })
        .then((response) => {
            const attributes = response.data;
            const dataSource = attributes.map((attribute) => {
                return {
                    key: attribute.key,
                    lastUpdateTs: attribute.lastUpdateTs,
                    attributeKey: attribute.key,
                    value: attribute.value,
                };
            });
            const newAttributes = {
                dataSource,
                rowLength: dataSource.length,
            };
            this.setState({
                attributes: newAttributes,
            });
        }).catch((error) => {
            notification.error({
                message: error.message,
            });
        });
    }

    handleChangeRowSelection = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    handleClickRow = (record) => {
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

    handleSelectAttributesScope = (value) => {
        this.setState({
            attributesScope: types.attributesScope[value],
        });
    }

    handleClickSearchKey = () => {

    }

    handleClickDeleteAttribute = () => {

    }

    handleClickAddAttribute = () => {
        this.addModal.modal.onShow();
    }

    handleClickAttributeRefresh = () => {

    }

    handleAddModalCancel = () => {
        this.addModal.modal.onHide();
    }

    handleAddModalSave = () => {
        const { entity } = this.props;
        const form = this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            let attributeData = {};
            if (values.checkedValue) {
                attributeData = {
                    [values.key]: values.checkedValue,
                };
            } else {
                attributeData = {
                    [values.key]: values.value,
                };
            }
            const entityType = entity.entityType;
            const entityId = entity.id;
            const attributesScope = this.state.attributesScope.value;
            telemetryService.saveEntityAttributes(entityType, entityId, attributesScope, attributeData)
            .then(() => {
                this.refreshAttributeTable();
            }).catch((error) => {
                notification.error({
                    message: error.message,
                });
            });
        });
        this.addModal.modal.onHide();
    }

    attributeData = {
        getData: (subscriptions, entityId, type, attributesScope) => {
            let dataSource = [];
            if (typeof subscriptions === 'undefined' || Object.keys(subscriptions).length === 0) {
                return dataSource;
            }
            const pickSubscription = Object.values(subscriptions).filter((value) => {
                if (value.subscriptionCommand.entityId === entityId) {
                    return value.type === type;
                }
            }).filter((value) => {
                return value.subscriptionCommand.scope === attributesScope;
            });
            if (pickSubscription.length === 0) {
                return dataSource;
            }
            const attributes = Object.values(pickSubscription)[0].attributes;
            dataSource = Object.keys(attributes).map((key) => {
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

    attributeSelector = (type) => {
        const attributeSelector = type === types.dataKeyType.attribute ? (
            <Select
                defaultValue={i18n.t(types.attributesScope.client.name)}
                onSelect={this.handleSelectAttributesScope}
            >
                <Select.Option value="client">
                    {i18n.t(types.attributesScope.client.name)}
                </Select.Option>
                <Select.Option value="server">
                    {i18n.t(types.attributesScope.server.name)}
                </Select.Option>
                <Select.Option value="shared">
                    {i18n.t(types.attributesScope.shared.name)}
                </Select.Option>
            </Select>
        ) : null;
        return attributeSelector;
    }

    NonSelectionComponents = (type, attributesScope) => {
        const isServerShared = attributesScope.name === types.attributesScope.server.name || attributesScope.name === types.attributesScope.shared.name;
        const actionComponents = isServerShared ? (
            <Button.Group className="custom-card-buttongroup">
                <CommonButton className="custom-card-button" shape="circle" onClick={this.handleClickAddAttribute} tooltipTitle={i18n.t('attribute.add')}>
                    <i className="material-icons vertical-middle">add</i>
                </CommonButton>
                <CommonButton className="custom-card-button" shape="circle" onClick={this.handleClickSearchKey} tooltipTitle={i18n.t('action.search')}>
                    <i className="material-icons vertical-middle">search</i>
                </CommonButton>
                <CommonButton className="custom-card-button" shape="circle" onClick={this.handleClickAttributeRefresh} tooltipTitle={i18n.t('actions.refresh')}>
                    <i className="material-icons vertical-middle">refresh</i>
                </CommonButton>
            </Button.Group>
        ) : (
            <CommonButton className="custom-card-button" shape="circle" onClick={this.handleClickSearchKey} tooltipTitle={i18n.t('action.search')}>
                <i className="material-icons vertical-middle">search</i>
            </CommonButton>
        );
        return actionComponents;
    }

    SelectionComponents = (type, attributesScope) => {
        const isServerShared = attributesScope.name === types.attributesScope.server.name || attributesScope.name === types.attributesScope.shared.name;
        const actionComponents = (
            <Button.Group>
                {
                    isServerShared ? (
                        <CommonButton onClick={this.handleClickDeleteAttribute} tooltipTitle={i18n.t('attribute.delete')}>
                            <i className="material-icons vertical-middle">delete</i>
                        </CommonButton>
                    ) : null
                }
                <CommonButton onClick={this.handleClickSearchKey} tooltipTitle={i18n.t('attribute.show-on-widget')}>
                    <i className="material-icons vertical-middle">widgets</i>
                    {i18n.t('attribute.show-on-widget')}
                </CommonButton>
            </Button.Group>
        );
        return actionComponents;
    }

    titleComponents = (type, attributesScope) => {
        const titleComponents = this.state.selectedRowKeys.length === 0 ? (
            <Layout.Header className="ts-dialog-title">
                <Row>
                    <Col span={20}>
                        <span className="ts-dialog-detail-title">{i18n.t(attributesScope.name)}</span>
                    </Col>
                    <Col span={4}>
                        {this.NonSelectionComponents(type, attributesScope)}
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
                        {this.SelectionComponents(type, attributesScope)}
                    </Col>
                </Row>
            </Layout.Header>
        );
        return titleComponents;
    }

    render() {
        const { type } = this.props;
        const { attributesScope, attributes } = this.state;
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleChangeRowSelection,
        };
        return (
            <Row>
                {this.attributeSelector(type, attributesScope)}
                <Table
                    columns={this.attributeData.columns}
                    dataSource={attributes.dataSource}
                    title={() => this.titleComponents(type, attributesScope)}
                    locale={{ emptyText: i18n.t('attribute.no-data') }}
                    pagination={{
                        total: attributes.rowLength,
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
                    onRowClick={this.handleClickRow}
                />
                <AttributeAddModal
                    ref={(c) => { this.addModal = c; }}
                    onSave={this.handleAddModalSave}
                    onCancel={this.handleAddModalCancel}
                />
            </Row>
        );
    }
}

export default AttributeTable;
