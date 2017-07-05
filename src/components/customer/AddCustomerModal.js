import React, { Component } from 'react';

import CommonModal from '../common/CommonModal';
import AddCustomerForm from './AddCustomerForm';

class AddCustomerModal extends Component {

    render() {
        return (
            <CommonModal
                ref={(c) => { this.modal = c; }}
                title="커스터머 추가"
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText="추가"
                cancelText="취소"
            >
                <AddCustomerForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} />
            </CommonModal>
        );
    }
}

export default AddCustomerModal;
