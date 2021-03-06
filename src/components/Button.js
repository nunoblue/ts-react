import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'antd';

class Button extends Component {
    static propTypes = {
        content: PropTypes.string,
        iconClassName: PropTypes.string,
    }

    static defaultProps = {
        content: '',
        iconClassName: '',
    }

    render() {
        return (
            <Tooltip title={this.props.content}>
                <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect mdl-button--colored">
                    <i className="material-icons">{this.props.iconClassName}</i>
                </button>
            </Tooltip>
        );
    }
}

export default Button;
