import React, { PureComponent } from 'react';
import { Col, Card } from 'antd';

export default class CreateCard extends PureComponent {
    render() {
        const { onClick, type } = this.props;
        return (
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                <Card className="ts-card-new" onClick={onClick}>
                    <div>
                        <span>Create a
                            <span className="point"> new {type}</span>
                        </span>
                    </div>
                </Card>
            </Col>
        );
    }
}
