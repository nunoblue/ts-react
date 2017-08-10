import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Row, Card, Table, notification } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import i18n from 'i18next';
import moment from 'moment';
import _ from 'lodash';

import DashboardGridLayout from '../../components/dashboard/DashboardGridLayout';
import GeneralTimeWindow from '../../components/timewindow/GeneralTimeWindow';
import { types } from '../../utils/commons';
import * as actions from '../../actions/dashboard/dashboards';
import * as telemetry from '../../actions/telemetry/telemetry';
import { deviceService, telemetryService } from '../../services/api';


/**
 * function validateAndUpdateEntityAliases(configuration, datasourcesByAliasId, targetDevicesByAliasId) {
        var aliasId, entityAlias;
        if (angular.isUndefined(configuration.entityAliases)) {
            configuration.entityAliases = {};
            if (configuration.deviceAliases) {
                var deviceAliases = configuration.deviceAliases;
                for (aliasId in deviceAliases) {
                    var deviceAlias = deviceAliases[aliasId];
                    entityAlias = validateAndUpdateDeviceAlias(aliasId, deviceAlias, datasourcesByAliasId, targetDevicesByAliasId);
                    configuration.entityAliases[entityAlias.id] = entityAlias;
                }
                delete configuration.deviceAliases;
            }
        } else {
            var entityAliases = configuration.entityAliases;
            for (aliasId in entityAliases) {
                entityAlias = entityAliases[aliasId];
                entityAlias = validateAndUpdateEntityAlias(aliasId, entityAlias, datasourcesByAliasId, targetDevicesByAliasId);
                if (aliasId != entityAlias.id) {
                    delete entityAliases[aliasId];
                }
                entityAliases[entityAlias.id] = entityAlias;
            }
        }
        return configuration;
    }

    function validateAliasId(aliasId, datasourcesByAliasId, targetDevicesByAliasId) {
        if (!aliasId || !angular.isString(aliasId) || aliasId.length != 36) {
            var newAliasId = utils.guid();
            var aliasDatasources = datasourcesByAliasId[aliasId];
            if (aliasDatasources) {
                aliasDatasources.forEach(
                      function(datasource) {
                          datasource.entityAliasId = newAliasId;
                      }
                );
            }
            var targetDeviceAliasIdsList = targetDevicesByAliasId[aliasId];
            if (targetDeviceAliasIdsList) {
                targetDeviceAliasIdsList.forEach(
                    function(targetDeviceAliasIds) {
                        targetDeviceAliasIds[0] = newAliasId;
                    }
                );
            }
            return newAliasId;
        } else {
            return aliasId;
        }
    }

    function validateAndUpdateDeviceAlias(aliasId, deviceAlias, datasourcesByAliasId, targetDevicesByAliasId) {
        aliasId = validateAliasId(aliasId, datasourcesByAliasId, targetDevicesByAliasId);
        var alias = deviceAlias.alias;
        var entityAlias = {
            id: aliasId,
            alias: alias,
            filter: {
                type: null,
                entityType: types.entityType.device,
                resolveMultiple: false
            },
        }
        if (deviceAlias.deviceFilter) {
            entityAlias.filter.type =
                deviceAlias.deviceFilter.useFilter ? types.aliasFilterType.entityName.value : types.aliasFilterType.entityList.value;
            if (entityAlias.filter.type == types.aliasFilterType.entityList.value) {
                entityAlias.filter.entityList = deviceAlias.deviceFilter.deviceList;
            } else {
                entityAlias.filter.entityNameFilter = deviceAlias.deviceFilter.deviceNameFilter;
            }
        } else {
            entityAlias.filter.type = types.aliasFilterType.entityList.value;
            entityAlias.filter.entityList = [deviceAlias.deviceId];
        }
        return entityAlias;
    }

    function validateAndUpdateEntityAlias(aliasId, entityAlias, datasourcesByAliasId, targetDevicesByAliasId) {
        entityAlias.id = validateAliasId(aliasId, datasourcesByAliasId, targetDevicesByAliasId);
        if (!entityAlias.filter) {
            entityAlias.filter = {
                type: entityAlias.entityFilter.useFilter ? types.aliasFilterType.entityName.value : types.aliasFilterType.entityList.value,
                entityType: entityAlias.entityType,
                resolveMultiple: false
            }
            if (entityAlias.filter.type == types.aliasFilterType.entityList.value) {
                entityAlias.filter.entityList = entityAlias.entityFilter.entityList;
            } else {
                entityAlias.filter.entityNameFilter = entityAlias.entityFilter.entityNameFilter;
            }
            delete entityAlias.entityType;
            delete entityAlias.entityFilter;
        }
        return entityAlias;
    }

    function validateAndUpdateWidget(widget) {
        if (!widget.config) {
            widget.config = {};
        }
        if (!widget.config.datasources) {
            widget.config.datasources = [];
        }
        widget.config.datasources.forEach(function(datasource) {
            if (datasource.type === 'device') {
                datasource.type = types.datasourceType.entity;
            }
            if (datasource.deviceAliasId) {
                datasource.entityAliasId = datasource.deviceAliasId;
                delete datasource.deviceAliasId;
            }
        });
        return widget;
    }
 */
class Dashboard extends Component {
    static contextTypes = {
        currentUser: PropTypes.object,
        pageLoading: PropTypes.func,
    }

    state = {
        timewindowVisible: false,
        attributesScope: types.attributesScope.client,
    }

    componentDidMount() {
        console.log('Dashboard Render');
        this.refershDashboardRequest();
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.subscriptions);
    }

    componentWillUnmount() {
        const { clearDashboardsRequest, unsubscribeWithObjects, subscribers } = this.props;
        clearDashboardsRequest();
        unsubscribeWithObjects(subscribers);
    }

    refershDashboardRequest = () => {
        this.context.pageLoading();
        const { match } = this.props;
        const dashboardId = match.params.dashboardId;
        this.props.getDashboardRequest(dashboardId).then(() => {
            if (this.props.statusMessage === 'FAILURE') {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
            if (this.props.statusMessage === 'SUCCESS') {
                const configuration = this.props.dashboard.configuration || null;
                const entityAliases = configuration ? configuration.entityAliases : null;
                const widgets = configuration ? configuration.widgets : null;
                this.subscribeDataSources(entityAliases, widgets);
                this.context.pageLoading();
            }
        });
    }

    subscribeDataSources = (entityAliases, widgets) => {
        if (!entityAliases || Object.keys(entityAliases).length === 0) {
            return;
        }
        Object.keys(entityAliases).forEach((entityAliasId) => {
            if (entityAliases[entityAliasId].filter) {
                if (entityAliases[entityAliasId].filter.type === types.aliasFilterType.entityList.value) {
                    const entityList = entityAliases[entityAliasId].filter.entityList;
                    const entityIds = entityList.join(',');
                    deviceService.getDevices(entityIds).then((response) => {
                        console.log(response);
                    });
                } else if (entityAliases[entityAliasId].filter.type === types.aliasFilterType.entityName.value) {
                    const filterName = entityAliases[entityAliasId].filter.entityNameFilter;
                    const resolveMultiple = entityAliases[entityAliasId].filter.resolveMultiple || false;
                    if (filterName) {
                        deviceService.getTenantDevices(100, filterName).then((response) => {
                            this.setState({
                                entityAliases: {
                                    [entityAliasId]: {
                                        resolveMultiple,
                                        devices: response.data.data,
                                    },
                                },
                            });
                            if (!widgets || Object.keys(widgets).length === 0) {
                                return;
                            }
                            Object.keys(widgets).forEach((widgetId) => {
                                const dataSources = widgets[widgetId].config.datasources;
                                const widgetType = widgets[widgetId].type;
                                dataSources.forEach((dataSource) => {
                                    if (dataSource.entityAliasId === entityAliasId) {
                                        let tsKeys = '';
                                        let attrKeys = '';
                                        dataSource.dataKeys.forEach((dataKey) => {
                                            if (dataKey.type === types.dataKeyType.timeseries) {
                                                if (tsKeys.length !== 0) {
                                                    tsKeys += ',';
                                                }
                                                tsKeys += dataKey.name;
                                            } else {
                                                if (attrKeys.length !== 0) {
                                                    attrKeys += ',';
                                                }
                                                attrKeys += dataKey.name;
                                            }
                                        });
                                        let newDataSources = [];
                                        if (resolveMultiple) {
                                            newDataSources = response.data.data.map((device) => {
                                                return {
                                                    entityType: device.id.entityType,
                                                    entityId: device.id.id,
                                                    tsKeys,
                                                    attrKeys,
                                                    type: widgetType,
                                                };
                                            });
                                        } else {
                                            const notResolveDataSource = {
                                                entityType: response.data.data[0].id.entityType,
                                                entityId: response.data.data[0].id.id,
                                                tsKeys,
                                                attrKeys,
                                                type: widgetType,
                                            };
                                            newDataSources.push(notResolveDataSource);
                                        }
                                        console.log(newDataSources);
                                        if (newDataSources.length > 0) {
                                            this.props.subscribeWithObjectsForDataSources(newDataSources, this.timewindow.state);
                                        }
                                    }
                                });
                            });
                        });
                    }
                } else if (entityAliases[entityAliasId].filter.type === 'singleEntity') {
                    const singleEntity = entityAliases[entityAliasId].filter.singleEntity;
                    deviceService.getDevice(singleEntity.id, true).then((response) => {
                        console.log(response);
                    });
                }
            }
        });
    }

    updateTimewindowDataSources = (timewindow) => {
        const {
            subscribers,
            subscribeWithObjects,
            unsubscribeWithObjects,
            updateWithTimewindowForDataSources,
        } = this.props;
        if (Object.keys(subscribers).length === 0) {
            return;
        }
        const copySubscribers = _.cloneDeep(subscribers);
        unsubscribeWithObjects(subscribers).then(() => {
            const newSubscribers = updateWithTimewindowForDataSources(copySubscribers, timewindow);
            subscribeWithObjects(newSubscribers);
        });
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

    render() {
        const { subscriptions, entityId, type, attributeScope } = this.props;
        const data = this.attributeData.getData(subscriptions, entityId, type, types.latestTelemetry);
        return (
            <Row>
                <Row>
                    <GeneralTimeWindow ref={(c) => { this.timewindow = c; }} onClickUpdate={this.updateTimewindowDataSources} />
                    <DashboardGridLayout>
                        <div key="1" data-grid={{ w: 2, h: 3, x: 0, y: 0 }}>
                            <Card className="text">
                                <Table
                                    columns={this.attributeData.columns}
                                    dataSource={data.dataSource}
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
                                />
                            </Card>
                        </div>
                        <div key="2" data-grid={{ w: 2, h: 3, x: 2, y: 0 }}>
                            <Card className="text">2</Card>
                        </div>
                        <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0 }}>
                            <Card className="text">3</Card>
                        </div>
                        <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0 }}>
                            <Card className="text">4</Card>
                        </div>
                        <div key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0 }}>
                            <Card className="text">5</Card>
                        </div>
                    </DashboardGridLayout>
                </Row>
            </Row>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        statusMessage: state.dashboards.statusMessage,
        errorMessage: state.dashboards.errorMessage,
        dashboard: state.dashboards.dashboard,
        isOpened: state.telemetry.isOpened,
        subscriptions: state.telemetry.subscriptions,
        subscribers: state.telemetry.subscribers,
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getDashboardRequest: actions.getDashboardRequest,
    clearDashboardsRequest: actions.clearDashboardsRequest,
    subscribeWithObjects: telemetry.subscribeWithObjects,
    subscribeWithObjectsForDataSources: telemetry.subscribeWithObjectsForDataSources,
    unsubscribeWithObjects: telemetry.unsubscribeWithObjects,
    updateWithTimewindowForDataSources: telemetry.updateWithTimewindowForDataSources,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
