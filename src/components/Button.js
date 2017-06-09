import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'antd';

class Button extends Component {
    static propTypes = {
        content: PropTypes.string,
    }

    static defaultProps = {
        content: '',
    }

    render() {
        return (
            <Tooltip title={this.props.content}>
                <div id="add" className="footer-buttons">
                    <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
                        <i className="material-icons">add</i>
                    </button>
                </div>
            </Tooltip>
        );
    }
}

export default Button;
