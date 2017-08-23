import React, { Component } from 'react';
import i18n from 'i18next';

import CommonModal from '../common/CommonModal';
import DashboardForm from './DashboardForm';

class AddCustomerModal extends Component {

    render() {
        return (
            <CommonModal
                ref={(c) => { this.modal = c; }}
                title={i18n.t('dashboard.add-dashboard-text')}
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText={i18n.t('action.add')}
                cancelText={i18n.t('action.cancel')}
            >
                <DashboardForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} />
            </CommonModal>
        );
    }
}

export default AddCustomerModal;
