import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import i18n from 'i18next';
import {
    Popover,
    Row,
    Col,
    Tabs,
} from 'antd';

import HistoryPanel from './HistoryPanel';
import RealTimePanel from './RealTimePanel';
import CommonButton from '../common/CommonButton';
import stateToProps from '../StateToProps';

/**
 * var historyCommand = {
        entityType: datasourceSubscription.entityType,
        entityId: datasourceSubscription.entityId,
        keys: tsKeys,
        startTs: subsTw.fixedWindow.startTimeMs,
        endTs: subsTw.fixedWindow.endTimeMs,
        interval: subsTw.aggregation.interval,
        limit: subsTw.aggregation.limit,
        agg: subsTw.aggregation.type
    };

    entityType: datasourceSubscription.entityType,
    entityId: datasourceSubscription.entityId,
    keys: tsKeys
    function updateRealtimeSubscriptionCommand(subscriptionCommand, subsTw) {
        subscriptionCommand.startTs = subsTw.startTs;
        subscriptionCommand.timeWindow = subsTw.aggregation.timeWindow;
        subscriptionCommand.interval = subsTw.aggregation.interval;
        subscriptionCommand.limit = subsTw.aggregation.limit;
        subscriptionCommand.agg = subsTw.aggregation.type;
    }

    function createSubscriptionTimewindow(timewindow, stDiff) {

        var subscriptionTimewindow = {
            fixedWindow: null,
            realtimeWindowMs: null,
            aggregation: {
                interval: SECOND,
                limit: AVG_LIMIT,
                type: types.aggregation.avg.value
            }
        };
        var aggTimewindow = 0;

        if (angular.isDefined(timewindow.aggregation)) {
            subscriptionTimewindow.aggregation = {
                type: timewindow.aggregation.type || types.aggregation.avg.value,
                limit: timewindow.aggregation.limit || AVG_LIMIT
            };
        }
        if (angular.isDefined(timewindow.realtime)) {
            subscriptionTimewindow.realtimeWindowMs = timewindow.realtime.timewindowMs;
            subscriptionTimewindow.aggregation.interval =
                boundIntervalToTimewindow(subscriptionTimewindow.realtimeWindowMs, timewindow.realtime.interval,
                    subscriptionTimewindow.aggregation.type);
            subscriptionTimewindow.startTs = (new Date).getTime() + stDiff - subscriptionTimewindow.realtimeWindowMs;
            var startDiff = subscriptionTimewindow.startTs % subscriptionTimewindow.aggregation.interval;
            aggTimewindow = subscriptionTimewindow.realtimeWindowMs;
            if (startDiff) {
                subscriptionTimewindow.startTs -= startDiff;
                aggTimewindow += subscriptionTimewindow.aggregation.interval;
            }
        } else if (angular.isDefined(timewindow.history)) {
            if (angular.isDefined(timewindow.history.timewindowMs)) {
                var currentTime = (new Date).getTime();
                subscriptionTimewindow.fixedWindow = {
                    startTimeMs: currentTime - timewindow.history.timewindowMs,
                    endTimeMs: currentTime
                }
                aggTimewindow = timewindow.history.timewindowMs;

            } else {
                subscriptionTimewindow.fixedWindow = {
                    startTimeMs: timewindow.history.fixedTimewindow.startTimeMs,
                    endTimeMs: timewindow.history.fixedTimewindow.endTimeMs
                }
                aggTimewindow = subscriptionTimewindow.fixedWindow.endTimeMs - subscriptionTimewindow.fixedWindow.startTimeMs;
            }
            subscriptionTimewindow.startTs = subscriptionTimewindow.fixedWindow.startTimeMs;
            subscriptionTimewindow.aggregation.interval =
                boundIntervalToTimewindow(aggTimewindow, timewindow.history.interval, subscriptionTimewindow.aggregation.type);
        }
        var aggregation = subscriptionTimewindow.aggregation;
        aggregation.timeWindow = aggTimewindow;
        if (aggregation.type !== types.aggregation.none.value) {
            aggregation.limit = Math.ceil(aggTimewindow / subscriptionTimewindow.aggregation.interval);
        }
        return subscriptionTimewindow;
    }

    getServerTimeDiff() {
        var deferred = $q.defer();
        var url = '/api/dashboard/serverTime';
        var ct1 = Date.now();
        $http.get(url, { ignoreLoading: true }).then(function success(response) {
            var ct2 = Date.now();
            var st = response.data;
            var stDiff = Math.ceil(st - (ct1+ct2)/2);
            deferred.resolve(stDiff);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }
 */

class GeneralTimeWindow extends Component {
    state = {
        visible: false,
        activeKey: 'realtime',
    }

    handleClickUpdate = () => {
        const { activeKey } = this.state;
        console.log(this.props[activeKey]);
        this.setState({
            visible: !this.state.visible,
        });
    }

    handleChangeVisible = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }

    handleChangeTab = (activeKey) => {
        this.setState({
            activeKey,
        });
    }

    contents = () => {
        return (
            <Row>
                <Row>
                    <Tabs
                        defaultActiveKey="realtime"
                        onChange={this.handleChangeTab}
                    >
                        <Tabs.TabPane tab={i18n.t('timewindow.realtime')} key="realtime">
                            <RealTimePanel {...this.props.handlers.realtime} {...this.props.realtime} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={i18n.t('timewindow.history')} key="history">
                            <HistoryPanel {...this.props.handlers.history} {...this.props.history} />
                        </Tabs.TabPane>
                    </Tabs>
                </Row>
                <Row>
                    <Col span={4}>
                        <CommonButton onClick={this.handleClickUpdate}>{'업데이트'}</CommonButton>
                    </Col>
                    <Col span={4}>
                        <CommonButton type="default" onClick={this.handleChangeVisible}>{'취소'}</CommonButton>
                    </Col>
                </Row>
            </Row>
        );
    }

    render() {
        const { children } = this.props;
        const buttonComponent = children || <CommonButton onClick={this.handleChangeVisible} />;
        return (
            <Popover
                placement={undefined}
                overlayStyle={{ width: '600px' }}
                overlayClassName={undefined}
                autoAdjustOverflow
                arrowPointAtCenter={false}
                content={this.contents()}
                trigger="click"
                visible={this.state.visible}
            >
                {buttonComponent}
            </Popover>
        );
    }
}

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    
}, dispatch);

export default stateToProps([HistoryPanel, RealTimePanel])(GeneralTimeWindow);
