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

class PlotlyChart extends Component {
    static propTypes = {
        // type: PropTypes.string.isRequired,
        xData: PropTypes.array,             // Array in Array... eg. [[1,2,3], [2,4,1]]
        yData: PropTypes.array,             // Array in Array... eg. [[1,2,3], [2,4,1]]
        onPlotChartClick: PropTypes.func,
        attributes: PropTypes.object,
    };

    static defaultProps = {
        // xData: [],
        xData: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
        // yData: [],
        yData: [[1, 2, 5, 6, 7, 3, 4, 8, 9, 4]],
        onPlotChartClick: null,
    };

    state = {
    };

    componentDidMount() {
        console.log('PlotlyChart componentDidMount=================', 'subscription', this.props.subscriptions);
        this.drawPlot();
        console.log(this.props.attributes);
    }

    componentDidUpdate() {
        console.log('PlotlyChart componentDidUpdate=================', 'subscription', this.props.subscriptions);
        this.drawPlot();
        console.log(this.props.attributes);
    }

    componentWillUnmount() {

    }

    drawPlot = () => {
        const trace1 = {
            x: this.props.xData[0],
            y: this.props.yData[0],
            line: { color: 'rgb(31, 119, 180)', shape: 'spline' },
            mode: 'lines',
            name: 'Measurement',
            type: 'scatter',
        }
        const data = [trace1];
        Plotly.newPlot('plotly', data);       // eslint-disable-line no-undef
    };

    render() {
        return (
            <div id="plotly"></div>
        );
    }
}

export default PlotlyChart;
