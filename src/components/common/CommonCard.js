import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Col } from 'antd';

class CommonCard extends Component {
    static propTypes = {
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.element,
        ]),
        content: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.element,
        ]),
        style: PropTypes.object,
    }

    static defaultProps = {
        title: '',
        content: '',
        style: {},
    }

    onCardDown = () => {
        const { isCardDown } = this.props;
        if (isCardDown) {
            $('.ant-card.ant-card-bordered').removeClass('current-card');
        }
    }

    validTarget = (target) => {
        const exceptedTarget = $(target);
        if (exceptedTarget.is('i') || exceptedTarget.is('button') || exceptedTarget.is('span') || exceptedTarget.is('input')) {
            return true;
        }
    }

    handleClick = (e) => {
        const { onSelfEvent, onNextEvent } = this.props;
        const target = e.target;
        if (this.validTarget(e.target)) {
            return;
        }
        const card = $(target).parents('.ant-card.ant-card-bordered');
        if (card.is('.current-card')) {
            this.selfCardEvent(card, onSelfEvent);
        } else {
            this.nextCardEvent(card, onNextEvent);
        }
    }

    selfCardEvent = (card, onSelfEvent) => {
        if (typeof onSelfEvent !== 'undefined') {
            onSelfEvent();
        }
        card.removeClass('current-card');
    }

    nextCardEvent = (card, onNextEvent) => {
        if (typeof onNextEvent !== 'undefined') {
            onNextEvent();
        }
        $('.ant-card.ant-card-bordered').removeClass('current-card');
        card.addClass('current-card');
    }

    render() {
        this.onCardDown();

        return (
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                <Card
                    className={this.props.className}
                    shape="circle"
                    title={this.props.title}
                    style={{ minHeight: 160, cursor: 'pointer' }}
                    onClick={this.handleClick}
                >
                    <div className="ts-card-content">
                        {this.props.content}
                    </div>
                    <div className="ts-card-bottom">
                        {this.props.children}
                    </div>
                </Card>
            </Col>
        );
    }
}

export default CommonCard;
