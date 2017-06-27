import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Button, Icon } from 'antd';

class CustomButton extends Component {
    static propTypes = {
        tooltipTitle: PropTypes.string,
        className: PropTypes.string,
        iconClassName: PropTypes.string,
        isUsed: PropTypes.bool,
    }

    static defaultProps = {
        tooltipTitle: '',
        className: '',
        iconClassName: '',
        isUsed: true,
    }

    render() {
        let component = null;
        if (this.props.isUsed) {
            component = (
                <Tooltip title={this.props.tooltipTitle}>
                    <div className={this.props.className}>
                        <Button shape="circle" type="primary" size={this.props.size} onClick={this.props.onClick}>
                            <Icon type={this.props.iconClassName} />
                        </Button>
                    </div>
                </Tooltip>
            );
        }
        return (
            component
        );
    }
}

export default CustomButton;
