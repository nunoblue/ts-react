import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Row, Layout, Col, Select, Button, notification, Modal } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import i18n from 'i18next';
import moment from 'moment';

import CommonButton from '../common/CommonButton';
import AttributeModal from '../attribute/AttributeModal';
import { types } from '../../utils/commons';
import { telemetryService } from '../../services/api';
import PlotlyChart from '../chart/PlotlyChart';
import GeneralTimeWindow from '../timewindow/GeneralTimeWindow';

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
        attributeModalDisbaled: false,
        widgetMode: false,
        showChart: false,
    };

    componentWillMount() {
        const attributes = this.attributeData.getData(this.props.subscriptions, this.props.entity.id, this.props.type, this.state.attributesScope.value);
        this.setState({
            attributes,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.subscriptions) {
            if (this.state.attributesScope.clientSide) {
                const attributes = this.attributeData.getData(nextProps.subscriptions, nextProps.entity.id, nextProps.type, this.state.attributesScope.value);
                this.setState({
                    attributes,
                });
            }
        }
        if (nextProps.entity.id !== this.props.entity.id) {
            this.setState({
                selectedRowKeys: [],
                attributesScope: this.props.type === types.dataKeyType.timeseries ? types.latestTelemetry : types.attributesScope.client,
                attributes: {},
                attributeModalDisbaled: false,
            });
        }
    }

    isInt = n => (n !== '' && !isNaN(n) && Math.round(n) === n)

    isFloat = n => (n !== '' && !isNaN(n) && Math.round(n) !== n)

    refreshAttributeTable = (scope) => {
        const { entity } = this.props;
        const entityType = entity.entityType;
        const entityId = entity.id;
        const attributesCope = typeof scope === 'undefined' ? this.state.attributesScope.value : scope.value;
        telemetryService.getEntityAttributes(entityType, entityId, attributesCope, { ignoreLoading: true })
        .then((response) => {
            const attributes = response.data;
            const dataSource = attributes.map((attribute) => {
                const lastUpdateTs = moment(attribute.lastUpdateTs).format('YYYY-MM-DD HH:mm:ss');
                return {
                    key: attribute.key,
                    lastUpdateTs,
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

    attributeSubscribe = (subscriber) => {
        const { subscribe } = this.props;
        subscribe(subscriber, true);
    }

    attributeUnsubscribe = (unsubscriber, subscriber) => {
        const { unsubscribe } = this.props;
        unsubscribe(unsubscriber).then(() => {
            if (subscriber) {
                this.attributeSubscribe(subscriber);
            }
        });
    }

    handleClickChangeWidgetMode = () => {
        this.setState({
            widgetMode: true,
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
            this.handleChangeRowSelection(selectedRowKeys);
            return;
        }
        selectedRowKeys.push(key);
        this.handleChangeRowSelection(selectedRowKeys);
    }

    handleSelectAttributesScope = (value) => {
        let key;
        if (value.key === types.attributesScope.client.value) {
            key = 'client';
        } else if (value.key === types.attributesScope.server.value) {
            key = 'server';
        } else if (value.key === types.attributesScope.shared.value) {
            key = 'shared';
        }
        if (this.state.attributesScope.value === types.attributesScope[key].value) {
            return;
        }
        const { entity, subscribers } = this.props;
        const attributesScope = types.attributesScope[key];
        if (attributesScope.clientSide) {
            const attributeScope = {
                entityType: entity.entityType,
                entityId: entity.id,
                scope: attributesScope.value,
            };
            this.attributeSubscribe(attributeScope);
        } else {
            const unsubscriberId = entity.entityType + entity.id + types.attributesScope.client.value;
            const unsubscriber = subscribers[unsubscriberId];
            if (unsubscriber) {
                this.attributeUnsubscribe(unsubscriber);
            }
        }
        this.refreshAttributeTable(attributesScope);
        this.setState({
            attributesScope,
            selectedRowKeys: [],
        });
    }

    handleClickSearchKey = () => {
        this.setState({
            showChart: true,
            attributes: {},
        });
        const { entity, subscribers } = this.props;
        const unsubscriberId = `${entity.entityType}${entity.id}LATEST_TELEMETRY`;
        const unsubscriber = subscribers[unsubscriberId];
        if (unsubscriber) {
            this.attributeUnsubscribe(unsubscriber);
        }

        const tsScope = {
            entityType: entity.entityType,
            entityId: entity.id,
            tsKeys: this.state.selectedRowKeys.join(),
            type: types.widgetType.timeseries.value,
        };



        const timeWindow = {
            realtime: {
                intervals: 1000,
                realtime: {
                    interval: 1000,
                    timewindowMs: 61000,
                },
                aggregation: {
                    type: 'NONE',
                    limit: 200,
                },
            },
        }

        // const timeWindow = this.timeWindow.state;
        const { subscribeDataSources } = this.props;
        subscribeDataSources([tsScope], timeWindow);
    };

    handleBackToTable = () => {
        const { entity } = this.props;
        const latestTelemetryScope = {
            entityType: 'DEVICE',
            entityId: entity.id,
            scope: 'LATEST_TELEMETRY',
        };
        // this.attributeSubscribe(latestTelemetryScope);

        this.setState({
            showChart: false,
        });
    };

    handleClickOpenAddModal = () => {
        this.attributeModal.modal.onShow();
    }

    handleClickAttributeRefresh = () => {
        this.refreshAttributeTable();
    }

    hanldeDeleteAttrbiute = (idArray) => {
        const { entity } = this.props;
        const entityId = entity.id;
        const entityType = entity.entityType;
        const attributesScope = this.state.attributesScope.value;
        const keys = idArray.reduce((prev, curr, index) => {
            if (index > 0) {
                prev += ',';
            }
            return prev += curr;
        });
        telemetryService.deleteEntityAttributes(entityType, entityId, attributesScope, keys)
        .then(() => {
            this.refreshAttributeTable();
        }).catch((error) => {
            notification.error({
                message: error.message,
            });
        });
    }

    handleClickDeleteConfirm = () => {
        const newTitle = i18n.t('attribute.delete-attributes-title', { count: this.state.selectedRowKeys.length });
        const newContent = i18n.t('attribute.delete-attributes-text');
        const deleteEvent = this.hanldeDeleteAttrbiute.bind(this, this.state.selectedRowKeys);
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: i18n.t('action.yes'),
            cancelText: i18n.t('action.no'),
            onOk: deleteEvent,
        });
    }

    handleClickOpenModify = (record) => {
        this.setState({
            attributeModalDisbaled: true,
        });
        this.attributeModal.modal.onShow();
        const key = record.attributeKey;
        const value = record.value;
        if (typeof value === 'string') {
            this.attributeModal.changeValue(key, 'String', value);
        } else if (this.isInt(value)) {
            this.attributeModal.changeValue(key, 'Integer', value);
        } else if (this.isFloat(value)) {
            this.attributeModal.changeValue(key, 'Double', value);
        } else if (typeof value === 'boolean') {
            this.attributeModal.changeValue(key, 'Boolean', value);
        }
    }

    handleAddModalCancel = () => {
        this.attributeModal.form.resetFields();
        this.attributeModal.initFields();
        this.attributeModal.modal.onHide();
        this.setState({
            attributeModalDisbaled: false,
        });
    }

    handleAddModalSave = () => {
        const { entity } = this.props;
        const form = this.attributeModal.form;
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
                let value = values.value;
                if (values.selectedType === 'Integer') {
                    value = parseInt(values.value, 10);
                } else if (values.selectedType === 'Double') {
                    value = parseFloat(values.value);
                }
                attributeData = {
                    [values.key]: value,
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
        this.handleAddModalCancel();
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
        }, {
            key: 'edit',
            render: (text, record) => {
                const openModify = this.handleClickOpenModify.bind(this, record);
                const action = this.props.type === types.dataKeyType.attribute && !this.state.attributesScope.clientSide ? (
                    <CommonButton className="ts-card-button" shape="circle" onClick={openModify} tooltipTitle={i18n.t('details.toggle-edit-mode')}>
                        <i className="material-icons vertical-middle">mode_edit</i>
                    </CommonButton>
                ) : null;
                return action;
            },
        }],
    }

    attributeSelector = (type, attributesScope) => {
        const component = type === types.dataKeyType.attribute ? (
            <Select
                labelInValue
                value={{ key: attributesScope.value }}
                defaultValue={{ key: types.attributesScope.client.value }}
                onSelect={this.handleSelectAttributesScope}
            >
                <Select.Option key={types.attributesScope.client.value} value={types.attributesScope.client.value}>
                    {i18n.t(types.attributesScope.client.name)}
                </Select.Option>
                <Select.Option key={types.attributesScope.server.value}value={types.attributesScope.server.value}>
                    {i18n.t(types.attributesScope.server.name)}
                </Select.Option>
                <Select.Option key={types.attributesScope.shared.value} value={types.attributesScope.shared.value}>
                    {i18n.t(types.attributesScope.shared.name)}
                </Select.Option>
            </Select>
        ) : null;
        return component;
    }

    nonSelectionComponents = (type, attributesScope) => {
        const isServerShared = attributesScope.name === types.attributesScope.server.name || attributesScope.name === types.attributesScope.shared.name;
        const actionComponents = isServerShared ? (
            <Button.Group className="ts-attribute-buttongroup">
                <CommonButton className="ts-attribute-button" shape="circle" onClick={this.handleClickOpenAddModal} tooltipTitle={i18n.t('attribute.add')}>
                    <i className="material-icons vertical-middle">add</i>
                </CommonButton>
                <CommonButton className="ts-attribute-button" shape="circle" onClick={this.handleClickOpenAddModal} tooltipTitle={i18n.t('attribute.add')}>
                    <i className="material-icons vertical-middle">search</i>
                </CommonButton>
                <CommonButton className="ts-attribute-button" shape="circle" onClick={this.handleClickAttributeRefresh} tooltipTitle={i18n.t('attribute.add')}>
                    <i className="material-icons vertical-middle">refresh</i>
                </CommonButton>
            </Button.Group>
        ) : (
            <CommonButton className="ts-card-button" shape="circle" onClick={this.handleClickSearchKey} tooltipTitle={i18n.t('action.search')}>
                <i className="material-icons vertical-middle">search</i>
            </CommonButton>
        );
        return actionComponents;
    }

    selectionComponents = (type, attributesScope) => {
        const isServerShared = attributesScope.name === types.attributesScope.server.name || attributesScope.name === types.attributesScope.shared.name;
        const actionComponents = (
            <Button.Group className="ts-attribute-buttongroup">
                {
                    isServerShared ? (
                        <CommonButton className="ts-attribute-button" onClick={this.handleClickDeleteConfirm} tooltipTitle={i18n.t('attribute.delete')}>
                            <i className="material-icons vertical-middle">delete</i>
                        </CommonButton>
                    ) : null
                }
                <CommonButton className="ts-attribute-button" onClick={this.handleClickSearchKey} tooltipTitle={i18n.t('attribute.show-on-widget')}>
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
                    <Col span={24}>
                        <span className="ts-dialog-detail-title">{i18n.t(attributesScope.name)}</span>
                        <span>{this.nonSelectionComponents(type, attributesScope)}</span>
                    </Col>
                </Row>
            </Layout.Header>
        ) : (
            <Layout.Header className="ts-dialog-title">
                <Row>
                    <Col span={24}>
                        <span className="ts-dialog-detail-title">
                            {
                                type === types.dataKeyType.attribute ?
                                i18n.t('attribute.selected-attributes', { count: this.state.selectedRowKeys.length })
                                : i18n.t('attribute.selected-telemetry', { count: this.state.selectedRowKeys.length })
                            }
                        </span>
                        <span>{this.selectionComponents(type, attributesScope)}</span>
                    </Col>
                </Row>
            </Layout.Header>
        );
        return titleComponents;
    };

    tableComponents = () => {
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
                    className="ts-table-wrapper"
                    columns={this.attributeData.columns}
                    dataSource={attributes.dataSource}
                    title={() => this.titleComponents(type, attributesScope)}
                    locale={{ emptyText: i18n.t('attribute.no-data') }}
                    pagination={{
                        total: attributes.rowLength,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        defaultPageSize: 10,
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
                <AttributeModal
                    ref={(c) => { this.attributeModal = c; }}
                    disabled={this.state.attributeModalDisbaled}
                    onSave={this.handleAddModalSave}
                    onCancel={this.handleAddModalCancel}
                />
            </Row>
        );
    };

    chartComponents = () => {
        return (
            <div>
                <Button onClick={this.handleBackToTable}>Back</Button>
                <GeneralTimeWindow
                    ref={(c) => { this.timeWindow = c; }}
                />
                <PlotlyChart attributes={this.state.attributes} />
            </div>
        );
    };

    render() {
        const { showChart } = this.state;
        return (
            <Row>
                { showChart ? this.chartComponents() : this.tableComponents()}
            </Row>
        );
    }
}

export default AttributeTable;
