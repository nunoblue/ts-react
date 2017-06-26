import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

class CustomCheckbox extends Component {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool,
        className: PropTypes.string,
    }

    static defaultProps = {
        id: '',
        value: '',
        name: '',
        disabled: false,
        className: '',
    }

    state = {
        id: this.props.id,
    }

    render() {
        return (
            <Checkbox className={this.props.className} name={this.props.name} value={this.props.value} disabled={this.props.disabled} onChange={this.props.onChange}>
                {this.props.children}
            </Checkbox>
        );
    }
}

export default CustomCheckbox;
