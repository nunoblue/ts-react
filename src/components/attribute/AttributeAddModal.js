import React, { Component } from 'react';
import i18n from 'i18next';

import CommonModal from '../common/CommonModal';
import AttributeForm from './AttributeForm';

class AttributeAddModal extends Component {

    render() {
        return (
            <CommonModal
                className={'ts-modal'}
                ref={(c) => { this.modal = c; }}
                title={i18n.t('attribute.add')}
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText={i18n.t('action.add')}
                cancelText={i18n.t('action.cancel')}
            >
                <AttributeForm ref={(c) => { this.form = c; }} onPressEnter={this.props.onSave} />
            </CommonModal>
        );
    }
}

export default AttributeAddModal;
