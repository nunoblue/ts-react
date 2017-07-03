import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Button, Icon } from 'antd';

class CustomButton extends Component {
    static propTypes = {
        tooltipTitle: PropTypes.string,
        className: PropTypes.string,
        iconClassName: PropTypes.string,
        visible: PropTypes.bool,
    }

    static defaultProps = {
        tooltipTitle: '',
        className: '',
        iconClassName: '',
        visible: true,
    }

    render() {
        let component = null;
        if (this.props.visible) {
            component = (
                <Tooltip title={this.props.tooltipTitle}>
                    <div className={this.props.className}>
                        <Button shape="circle" type="primary" size={this.props.size} onClick={this.props.onClick}>
                            <Icon type={this.props.iconClassName} />
                            {this.props.children}
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
