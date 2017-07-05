import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

export default class CommonModal extends Component {
    static propTypes = {
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.element,
        ]),
        okText: PropTypes.string,
        cancelText: PropTypes.string,
    }

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

    footerComponents = () => {
        const { footer } = this.props;
        if (typeof footer === 'undefined' || footer === null) {
            return ([
                <Button key="back" size="large" onClick={this.props.onCancel}>
                    {this.props.cancelText}
                </Button>,
                <Button key="submit" type="primary" size="large" onClick={this.props.onOk}>
                    {this.props.okText}
                </Button>,
            ]);
        }

        return ([
            footer,
        ]);
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
                    footer={this.footerComponents()}
                >
                    {this.props.children}
                </Modal>
            </div>
        );
    }
}
