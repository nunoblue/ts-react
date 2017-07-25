import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

class CommonCheckbox extends Component {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        name: PropTypes.string,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        checked: PropTypes.bool,
    }

    static defaultProps = {
        id: '',
        value: '',
        name: '',
        disabled: false,
        className: '',
        checked: false,
    }

    state = {
        id: this.props.id,
        checked: this.props.checked,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checkedCount === 0 && this.state.checked === true) {
            this.setState({
                checked: false,
            });
        }
    }

    handleChecked = (e) => {
        const { onChange } = this.props;
        if (typeof onChange !== 'undefined') {
            this.props.onChange(e);
        }
        this.setState({
            checked: !this.state.checked,
        });
    }

    render() {
        const { className, name, value, disabled } = this.props;
        return (
            <Checkbox
                className={className}
                name={name}
                value={value}
                disabled={disabled}
                onChange={this.handleChecked}
                checked={this.state.checked}
            >
                {this.props.children}
            </Checkbox>
        );
    }
}

export default CommonCheckbox;
