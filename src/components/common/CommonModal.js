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
        maskClosable: PropTypes.bool,
    }

    static defaultProps = {
        title: 'Title',
        okText: '예',
        cancelText: '아니오',
        maskClosable: false,
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
        const { footer, onCancel, onOk, cancelText, okText } = this.props;
        if (typeof footer === 'undefined' || footer === null) {
            return ([
                <Button key="back" size="large" onClick={typeof onCancel === 'undefined' ? this.onHide : onCancel}>
                    {cancelText}
                </Button>,
                <Button key="submit" type="primary" size="large" onClick={onOk}>
                    {okText}
                </Button>,
            ]);
        }

        return ([
            footer,
        ]);
    }

    render() {
        const { children, title, okText, cancelText, onOk, onCancel, maskClosable } = this.props;
        return (
            <div>
                <Modal
                    title={title}
                    visible={this.state.visible}
                    okText={okText}
                    cancelText={cancelText}
                    onOk={onOk}
                    onCancel={typeof onCancel === 'undefined' ? this.onHide : onCancel}
                    maskClosable={maskClosable}
                    footer={this.footerComponents()}
                >
                    {children}
                </Modal>
            </div>
        );
    }
}
