import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'antd';

export default class CustomModal extends Component {
    static defaultProps = {
        title: 'Title',
        okText: '예',
        cancelText: '아니오',
    }

    state = {
        visible: false,
    }

    onShow = () => {
        this.setState({
            visible: true,
        });
    }

    onHide = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <div>
                <Modal
                    title={this.props.title}
                    visible={this.state.visible}
                    okText={this.props.okText}
                    cancelText={this.props.cancelText}
                    onOk={this.props.onOk}
                    onCancel={this.props.onCancel}
                    maskClosable={false}
                >
                    {this.props.children}
                </Modal>
            </div>
        );
    }
}
