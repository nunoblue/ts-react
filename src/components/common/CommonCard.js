import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, Col } from 'antd';

class CommonCard extends Component {
    static propTypes = {
        id: PropTypes.string,
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
        id: '',
        title: '',
        content: '',
        style: {},
    }

    state = {
        id: this.props.id,
        selectedIndex: 0,
    };

    select(index) {
        this.setState({
            selectedIndex: index,
        });
    }

    downCard = () => {
        $('.ant-card.ant-card-bordered').removeClass('current-card');
    }

    upCard = () => {

    }

    validTarget = (target) => {
        const exceptedTarget = $(target);
        if (exceptedTarget.is('i') || exceptedTarget.is('button') || exceptedTarget.is('span') || exceptedTarget.is('input')) {
            return true;
        }
    }

    handleClick = (e) => {
        const { onClick } = this.props;
        if (typeof onClick === 'undefined') {
            return;
        }
        const target = e.target;
        if (this.validTarget(e.target)) {
            return;
        }

        const card = $(target).parents('.ant-card.ant-card-bordered');
        if (card.is('.current-card')) {
            card.removeClass('current-card');
        } else {
            this.props.onClick();
            $('.ant-card.ant-card-bordered').removeClass('current-card');
            card.addClass('current-card');
        }
    }

    render() {
        return (
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                <span style={this.props.style} role="button" aria-hidden="true" onClick={this.handleClick}>
                    <Card title={this.props.title} style={{ minHeight: 160 }}>
                        <div className="custom-card-content">
                            {this.props.content}
                        </div>
                        <div className="custom-card-bottom">
                            {this.props.children}
                        </div>
                    </Card>
                </span>
            </Col>
        );
    }
}

export default CommonCard;
