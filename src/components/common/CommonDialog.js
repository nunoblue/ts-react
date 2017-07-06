import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col, Button } from 'antd';

import CommonButton from './CommonButton';

class CommonDialog extends Component {

    static defaultProps = {
        title: '',
        visible: false,
    }

    static propTypes = {
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.element,
        ]),
        visible: PropTypes.bool,
    }

    state = {
        visible: this.props.visible,
    }

    onHide = () => {
        this.setState({
            visible: false,
        });
    }

    onShow = () => {
        this.setState({
            visible: true,
        });
    }

    clearButtonClick = (e) => {
        e.preventDefault();
        const { onClick } = this.props;
        if (typeof onClick === 'undefined') {
            this.onHide();
            return;
        }

        onClick(e);
        this.onHide();
    }

    render() {
        return (
            <Layout className={this.props.visible ? 'ts-dialog ts-dialog-show' : 'ts-dialog ts-dialog-hide'}>
                <Layout.Header className="ts-dialog-title">
                    <Row>
                        <Col span={20}>
                            <span className="ts-dialog-detail-title">{this.props.title}</span>
                            <span className="ts-dialog-detail-subtitle">{this.props.type}</span>
                        </Col>
                        <Col span={4}>
                            <CommonButton shape="circle" onClick={this.clearButtonClick}>
                                <i className="material-icons vertical-middle">clear</i>
                            </CommonButton>
                        </Col>
                    </Row>
                </Layout.Header>
                <Layout.Content className="ts-dialog-content">
                    {this.props.children}
                </Layout.Content>
            </Layout>
        );
    }
}

export default CommonDialog;