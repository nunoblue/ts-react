import React, { Component } from 'react';

import CommonModal from '../common/CommonModal';
import DashboardForm from './DashboardForm';

class AddCustomerModal extends Component {

    render() {
        return (
            <CommonModal
            ref={(c) => { this.modal = c; }}
            title="대시보드 추가"
            onOk={this.props.onSave}
            onCancel={this.props.onCancel}
            okText="추가"
            cancelText="취소"
            >
                <DashboardForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} />
            </CommonModal>
        );
    }
}

export default AddCustomerModal;
