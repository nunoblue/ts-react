import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tooltip, Icon } from 'antd';

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
                    <Icon type="plus-circle" />
            </Tooltip>
        );
    }
}

export default Button;
