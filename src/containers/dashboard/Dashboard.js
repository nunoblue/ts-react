import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Row, Card, Table, notification } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import i18n from 'i18next';
import moment from 'moment';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';

import '../../../less/example-styles.css';

import * as actions from '../../actions/dashboard/dashboards';
import GeneralTimeWindow from '../../components/timewindow/GeneralTimeWindow';
import { types } from '../../utils/commons';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends Component {
    static contextTypes = {
        currentUser: PropTypes.object,
        pageLoading: PropTypes.func,
    }

    static propTypes = {
        onLayoutChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        className: 'layout',
        // isDraggable: false,
        // isResizable: false,
        breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 30,
        onLayoutChange: () => {},
    }

    state = {
        timewindowVisible: false,
        layouts: {},
        attributesScope: types.attributesScope.client,
    }

    componentDidMount() {
        console.log('Dashboard Render');
        this.refershDashboardRequest();
    }

    componentWillUnmount() {
        const { clearDashboardsRequest } = this.props;
        clearDashboardsRequest();
    }

    onLayoutChange = (layout, layouts) => {
        this.setState({ layouts });
        this.props.onLayoutChange(layout, layouts);
    }

    generateLayout = () => {
        const p = this.props;
        return _.map(new Array(p.items), (item, i) => {
            const y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
            return { x: i * 2 % 12, y: Math.floor(i / 6) * y, w: 2, h: y, i: i.toString() };
        });
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
                this.context.pageLoading();
            }
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
                    <GeneralTimeWindow />
                </Row>
                <ResponsiveReactGridLayout
                    ref={(c) => { this.rrgl = c; }}
                    className="layout"
                    layouts={this.state.layouts}
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}
                >
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
                </ResponsiveReactGridLayout>
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
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getDashboardRequest: actions.getDashboardRequest,
    clearDashboardsRequest: actions.clearDashboardsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
