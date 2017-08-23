import React from 'react';
import _ from 'lodash';
import { Row, Col, Button } from 'antd';

const SortableItems = (props) => {
    let items = null;
    const isArray = Array.isArray(props.items);
    const itemConfig = Array.isArray(props.itemConfig) ? props.itemConfig : [props.itemConfig];

    if (isArray) {
        items = props.items;
    } else {
        items = _.isEmpty(props.items) ? null : [props.items];
    }
    const renderTitle = () => {
        if (items && items.length > 0) {
            return (
              <li>
                  <strong>
                      <Row gutter={16}>
                          <Col span={isArray ? 2 : 0} />
                          <Col span={8}>{props.componentTypeName} 이름</Col>
                          <Col span={isArray ? 10 : 12}>{props.componentTypeName} 종류</Col>
                          <Col span={2} />
                          <Col span={2} />
                      </Row>
                  </strong>
              </li>
            );
        }
        return '';
    };
    const renderItems = () => {
        if (items && items.length > 0) {
            return items.map((item, i) => {
                const key = `key_${i}`;
                const itemFilter = itemConfig.find(filter => filter.clazz === item.clazz);
                const handleEdit = props.onEdit.bind(this, item);
                const handleDelete = props.onDelete.bind(this, item);
                return (
                    <li key={key}>
                        <Col span={isArray ? 2 : 0}>{i + 1}</Col>
                        <Col span={8}>{item.name}</Col>
                        <Col span={isArray ? 10 : 12}>{itemFilter.name}</Col>
                        <Col span={2}><Button shape="circle" icon="edit" onClick={handleEdit} /></Col>
                        <Col span={2}><Button shape="circle" icon="delete" onClick={handleDelete} /></Col>
                    </li>
                );
            });
        }
        return '';
    };

    return (
        <ul>
            {renderTitle()}
            {renderItems()}
        </ul>
    );
};

export default SortableItems;
