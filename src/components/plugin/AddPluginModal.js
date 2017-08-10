import React, { Component } from 'react';
import PropTypes from 'prop-types';

import i18n from 'i18next';

import CommonModal from '../common/CommonModal';
import PluginForm from './PluginForm';

class AddPluginModal extends Component {
    static propTypes = {
        plugin: PropTypes.object,
        pluginComponents: PropTypes.array,
    };

    render() {
        return (
            <CommonModal
                className={this.props.className}
                ref={(c) => { this.modal = c; }}
                title={i18n.t('plugin.add')}
                onOk={this.props.onSave}
            >
                <PluginForm
                    ref={(c) => { this.form = c; }}
                    plugin={this.props.plugin}
                    pluginComponents={this.props.pluginComponents}
                />
            </CommonModal>
        );
    };
}

export default AddPluginModal;