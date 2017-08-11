import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

class CommonLabel extends Component {
    static propTypes = {
        tooltipTitle: PropTypes.string,
        tooltipClassName: PropTypes.string,
        className: PropTypes.string,
        iconClassName: PropTypes.string,
        visible: PropTypes.bool,
    }

    static defaultProps = {
        tooltipTitle: '',
        tooltipClassName: '',
        className: '',
        iconClassName: '',
        visible: true,
    }

    render() {
        const { htmlFor, visible, className, tooltipTitle, tooltipClassName, children, content } = this.props;
        const component = typeof visible === 'undefined' || visible ? (
            <label htmlFor={htmlFor} className={className}>
                <Tooltip title={tooltipTitle} overlayClassName={tooltipClassName} autoAdjustOverflow>
                    {children}
                    {content}
                </Tooltip>
            </label>
        ) : null;
        return component;
    }
}

export default CommonLabel;
