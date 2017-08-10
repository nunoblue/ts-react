// TODO
// 기본 스타일 정의
// 데이터 타입 정의
// 실시간 처리
// 차트 옵션
// 차트 레이아웃
// 라인 컬러 정의
// 이벤트 정의(like click)

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import { lineSeriesColor } from "../../utils/chartColors";

class PlotlyChart extends Component {
    static propTypes = {
        // type: PropTypes.string.isRequired,
        onPlotChartClick: PropTypes.func,
        attributes: PropTypes.any,
        timeWindow: PropTypes.object,
        redrawChart: PropTypes.bool,
        isAnomaly: PropTypes.bool,
    };

    static defaultProps = {
        onPlotChartClick: null,
    };

    state = {
        isUpdate: false,
    }

    componentDidMount() {
        this.drawPlot();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.timeWindow) !== JSON.stringify(this.props.timeWindow)) {
            this.setState({
                isUpdate: false,
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isUpdate !== nextState.isUpdate) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            this.drawPlot();
        }
    }

    componentWillUnmount() {

    }

    drawPlot = () => {
        const { isAnomaly } = this.props;

        if (isAnomaly) {
            this.drawAnomalyPlot();
        } else {
            this.drawBasicPlot();
        }
    };

    drawBasicPlot = () => {
        const { attributes: {dataSource, startTs}, timeWindow, isAnomaly } = this.props;
        const isRealtime = !_.isEmpty(timeWindow.realtime);
        const { isUpdate } = this.state;

        if (!dataSource) {
            return;
        }

        let data = [];
        const xTraces = [];
        const yTraces = [];
        const traceArray = [];
        let time = null;
        if (isRealtime && dataSource) {
            if (isUpdate) {
                Object.keys(dataSource).forEach((key, i) => {
                    const attr = dataSource[key];
                    const x = [];
                    const y = [];
                    _.eachRight(attr, (obj) => {
                        x.push(moment(obj.lastUpdateTs).format('YYYY-MM-DD HH:mm:ss'));
                        y.push(obj.value);
                        time = new Date(obj.lastUpdateTs);
                    });
                    xTraces.push(x);
                    yTraces.push(y);
                    traceArray.push(i);
                });

                const { realtime: { interval }, realtime: { timewindowMs } } = timeWindow;
                const xLength = Math.floor(parseFloat(timewindowMs / interval));
                const diff = xLength >= 60 ? Math.floor(parseFloat(xLength / 60)) : 1;
                const olderTime = time.setMinutes(time.getMinutes() - diff);
                const futureTime = time.setMinutes(time.getMinutes() + diff);

                const rangeView = {
                    xaxis: {
                        type: 'date',
                        range: [olderTime, futureTime],
                    },
                };

                Plotly.relayout('plotly', rangeView);
                Plotly.extendTraces('plotly', { x: xTraces, y: yTraces }, traceArray);      // eslint-disable-line no-undef
            } else {
                data = Object.keys(dataSource).map((key, i) => {
                    const attr = dataSource[key];
                    const x = [];
                    const y = [];
                    _.eachRight(attr, (obj) => {
                        x.push(moment(obj.lastUpdateTs).format('YYYY-MM-DD HH:mm:ss'));
                        y.push(obj.value);
                    });

                    const trace = {
                        x,
                        y,
                        line: { color: lineSeriesColor[i % 12], shape: 'spline' },
                        mode: 'lines',
                        name: key,
                        type: 'scatter',
                    }
                    return trace;
                });

                Plotly.newPlot('plotly', data);       // eslint-disable-line no-undef
                if (!isUpdate && !_.isEmpty(data)) {
                    this.setState({
                        isUpdate: true,
                    });
                }
            }
        }
    };

    drawAnomalyPlot = () => {
        const { attributes: {dataSource, startTs}, timeWindow, isAnomaly } = this.props;
        const isRealtime = !_.isEmpty(timeWindow.realtime);
        const { isUpdate } = this.state;

        if (!dataSource) {
            return;
        }
    };

    render() {
        return (
            <div id="plotly"></div>
        );
    }
}

export default PlotlyChart;
