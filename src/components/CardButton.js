import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tooltip, Button } from 'antd';

class CardButton extends Component {
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
                <div className="footer-buttons">
                    <Button shape="circle" type="primary" icon="plus" />
                </div>
            </Tooltip>
        );
    }
}

export default CardButton;
