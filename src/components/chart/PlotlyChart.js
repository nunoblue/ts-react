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

const seriesStyle = {
    basic: {
        mode: 'lines',
        type: 'scatter',
    },
    anomaly: {
        mode: 'markers',
        type: 'scatter',
    },
    upper: {
        fill: 'tonexty',
        fillcolor: 'rgba(0,100,80,0.1)',
        line: { width: 0, shape: 'spline' },
        marker: { color: '444' },
        mode: 'lines',
        type: 'scatter',
    },
    lower: {
        fillcolor: 'rgba(0,100,80,0.1)',
        line: { width: 0, shape: 'spline' },
        marker: { color: '444' },
        mode: 'lines',
        type: 'scatter',
    },

}

class PlotlyChart extends Component {
    static propTypes = {
        // type: PropTypes.string.isRequired,
        onPlotChartClick: PropTypes.func,
        attributes: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]),
        timeWindow: PropTypes.object,
        redrawChart: PropTypes.bool,
        isAnomaly: PropTypes.bool,
        yAxisTitle: PropTypes.string,
    };

    static defaultProps = {
        attributes: {},
        onPlotChartClick: null,
    };

    state = {
        isUpdate: false,
    };

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
        const { attributes: { dataSource }, timeWindow, } = this.props;
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
                    name: key,
                };
                const copyTrace = Object.assign(trace, seriesStyle.basic);
                return copyTrace;
            });
            Plotly.newPlot('plotly', data);       // eslint-disable-line no-undef
            if (isRealtime && !isUpdate && !_.isEmpty(data)) {
                this.setState({
                    isUpdate: true,
                });
            }
        }
    };

    drawAnomalyPlot = () => {
        const { attributes: { dataSource }, timeWindow } = this.props;
        const isRealtime = !_.isEmpty(timeWindow.realtime);
        if (!dataSource) {
            return;
        }

        let data = [];
        const xTraces = [];
        const yTraces = [];
        const traceArray = [];
        const shapes = [];
        let time = null;
        if (isRealtime) {
            const { isUpdate } = this.state;
            if (isUpdate) {
                Object.keys(dataSource).forEach((key, i) => {
                    const attr = dataSource[key];
                    const lastIndex = key.lastIndexOf('_');
                    const type = lastIndex > -1 ? key.substring(lastIndex + 1, key.length) : 'basic';
                    if (type === 'mchanged') {
                        return {};
                    }
                    const x = [];
                    const y = [];
                    _.eachRight(attr, (obj) => {
                        if (type === 'anomaly') {
                            if (parseFloat(obj.value) < 50) {
                                return;
                            }
                        }
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
                    const lastIndex = key.lastIndexOf('_');
                    const type = lastIndex > -1 ? key.substring(lastIndex + 1, key.length) : 'basic';
                    if (type === 'mchanged') {
                        _.eachRight(attr, (obj) => {
                            if (obj.value === 'true') {
                                shapes.push({
                                    type: 'line',
                                    x0: moment(obj.lastUpdateTs).format('YYYY-MM-DD HH:mm:ss'),
                                    y0: 0,
                                    x1: moment(obj.lastUpdateTs).format('YYYY-MM-DD HH:mm:ss'),
                                    y1: 100,
                                    line: {
                                        color: 'rgb(23, 190, 207)',
                                        width: 2,
                                    },
                                    yref: 'y2',
                                });
                            }
                        });
                        return {};
                    }
                    const x = [];
                    const y = [];
                    _.eachRight(attr, (obj) => {
                        if (type === 'anomaly') {
                            if (parseFloat(obj.value) < 50) {
                                return;
                            }
                        }
                        x.push(moment(obj.lastUpdateTs).format('YYYY-MM-DD HH:mm:ss'));
                        y.push(obj.value);
                    });

                    const trace = {
                        x,
                        y,
                        line: { color: lineSeriesColor[i % 12], shape: 'spline' },
                        name: key,
                        yaxis: type === 'anomaly' ? 'y2' : 'y1',
                    };

                    const copyTrace = Object.assign(trace, seriesStyle[type]);
                    return copyTrace;
                });

                const layout = {
                    shapes,
                    yaxis1: {
                        title: this.props.yAxisTitle,
                    },
                    yaxis2: {
                        title: 'Anomaly',
                        overlaying: 'y',
                        side: 'right',
                    },
                };

                Plotly.newPlot('plotly', data, layout);       // eslint-disable-line no-undef
                if (isRealtime && !isUpdate && !_.isEmpty(data)) {
                    this.setState({
                        isUpdate: true,
                    });
                }
            }
        }
    };

    render() {
        return (
            <div id="plotly"></div>
        );
    }
}

export default PlotlyChart;
