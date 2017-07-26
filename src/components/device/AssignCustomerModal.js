import React, { Component } from 'react';
import i18n from 'i18next';
import _ from 'lodash';
import { Row, Select, Spin } from 'antd';

import CommonModal from '../common/CommonModal';

class AssignCustomerModal extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = _.debounce(this.handleSearch, 800);
    }

    state = {
        customers: [],
        selectedId: undefined,
        deviceId: [],
        value: undefined,
        loading: false,
    }

    setDatas = (datas) => {
        this.setState({
            customers: datas,
            selectedId: undefined,
            loading: false,
        });
    }

    initDatas = (datas, deviceId) => {
        this.setState({
            customers: datas,
            selectedId: undefined,
            deviceId,
            value: undefined,
            loading: false,
        });
    }

    get deviceId() {
        if (this.state.deviceId.length === 1) {
            return this.state.deviceId[0];
        }
        return this.state.deviceId;
    }

    get customerId() {
        return this.state.selectedId;
    }

    handleSelect = (value) => {
        const temp = this.state.customers.filter(customer => customer.id.id === value);
        if (temp.length > 0) {
            const title = temp[0].title;
            this.setState({
                selectedId: value,
                value: title,
            });
        }
    }

    handleSearch = (value) => {
        const { onSearch } = this.props;
        this.setState({
            loading: true,
            customers: [],
            value,
        });
        if (typeof onSearch !== 'undefined') {
            onSearch(value);
        }
    }

    render() {
        const { onSave, onCancel } = this.props;
        const options = (
            this.state.customers.map(customer => (
                <Select.Option key={customer.id.id} value={customer.id.id}>
                    {customer.title}
                </Select.Option>
            ))
        );
        const notFoundContent = this.state.loading ? <Spin size="small" /> : null;
        return (
            <CommonModal
                ref={(c) => { this.modal = c; }}
                title={i18n.t('device.assign-device-to-customer')}
                onOk={onSave}
                onCancel={onCancel}
                okText={i18n.t('action.assign')}
                okDisabled={typeof this.state.selectedId === 'undefined'}
                cancelText={i18n.t('action.cancel')}
            >
                <Row>
                    <span>{i18n.t('device.assign-to-customer-text')}</span>
                    <Select
                        style={{ width: '100%' }}
                        mode="combobox"
                        showArrow={false}
                        filterOption={false}
                        placeholder={i18n.t('common.enter-search')}
                        notFoundContent={notFoundContent}
                        onSelect={this.handleSelect}
                        onSearch={this.handleSearch}
                        value={this.state.value}
                    >
                        {options}
                    </Select>
                </Row>
            </CommonModal>
        );
    }
}

export default AssignCustomerModal;
