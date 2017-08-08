import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';

import '../../../less/example-styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class DashboardGridLayout extends Component {
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
        layouts: {},
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

    render() {
        return (
            <ResponsiveReactGridLayout
                ref={(c) => { this.rrgl = c; }}
                className="layout"
                layouts={this.state.layouts}
                onLayoutChange={this.onLayoutChange}
                {...this.props}
            >
                {this.props.children}
            </ResponsiveReactGridLayout>
        );
    }
}

export default DashboardGridLayout;
