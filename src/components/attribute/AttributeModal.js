import React, { Component } from 'react';
import i18n from 'i18next';

import CommonModal from '../common/CommonModal';
import AttributeForm from './AttributeForm';

class AttributeModal extends Component {
    state = {
        formData: {
            key: '',
            selectedType: 'String',
            value: '',
        },
    }

    changeValue = (key, selectedType, value) => {
        this.setState({
            formData: {
                key,
                selectedType,
                value,
            },
        });
    }

    initFields = () => {
        this.setState({
            formData: {
                key: '',
                selectedType: 'String',
                value: '',
            },
        });
    }

    render() {
        return (
            <CommonModal
                ref={(c) => { this.modal = c; }}
                title={i18n.t('attribute.add')}
                onOk={this.props.onSave}
                onCancel={this.props.onCancel}
                okText={i18n.t('action.add')}
                cancelText={i18n.t('action.cancel')}
            >
                <AttributeForm
                    ref={(c) => { this.form = c; }}
                    disabled={this.props.disabled}
                    onPressEnter={this.props.onSave}
                    data={this.state.formData}
                />
            </CommonModal>
        );
    }
}

export default AttributeModal;
