import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, Col } from 'antd';

class CustomCard extends Component {
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
    }

    static defaultProps = {
        id: '',
        title: '',
        content: '',
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

    handleClick = (e) => {
        const { onClick } = this.props;
        if (typeof onClick === 'undefined') {
            return;
        }
        const exceptedTarget = $(e.target);
        if (exceptedTarget.is('i') || exceptedTarget.is('button') || exceptedTarget.is('span') || exceptedTarget.is('input')) {
            return;
        }
        const target = $(e.target).parents('.ant-card.ant-card-bordered');
        if (target.is('.current-card')) {
            target.removeClass('current-card');
        } else {
            if (typeof this.props.onClick !== 'undefined') {
                this.props.onClick();
            }
            $('.ant-card.ant-card-bordered').removeClass('current-card');
            target.addClass('current-card');
        }
    }

    render() {
        return (
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                <span style={{ cursor: 'pointer' }} role="button" aria-hidden="true" onClick={this.handleClick}>
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

export default CustomCard;
