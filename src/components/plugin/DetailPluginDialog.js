import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Switch, Row } from 'antd';
import i18n from 'i18next';

import CommonDialog from '../common/CommonDialog';
import CommonButton from '../common/CommonButton';
import PluginForm from './PluginForm';

class DetailPluginDialog extends Component {
    static propTypes = {
        plugin: PropTypes.object,
        pluginComponents: PropTypes.array,
        visible: PropTypes.bool,
    };
    state = {
        editing: false,
        title: null,
    };

    changeEdit = () => {
        const { editing } = this.state;
        this.setState({
           editing: !editing,
        });
    }

    clearEdit = () => {
        this.setState({
            editing: false,
            title: null,
        });
    };

    handleSave = () => {
        const type = 'dialog';
        this.props.onSave(type);
    }

    render() {
        const { plugin, visible, closeDialog, buttonComponents } = this.props;
        return (
            <CommonDialog
                title={plugin.name}
                subTitle={i18n.t('plugin.plugin-details')}
                visible={visible}
                tooltipTitle={i18n.t('action.close')}
                onClick={closeDialog}
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={i18n.t('plugin.details')} key="1" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                        <Row>
                            {plugin ? buttonComponents(plugin) : null}
                            {<Switch
                                checkedChildren={i18n.t('action.edit')}
                                unCheckedChildren={i18n.t('action.view')}
                                checked={this.state.editing}
                                onChange={this.changeEdit}
                            />}
                        </Row>
                        <PluginForm
                            ref={(c) => { this.form = c; }}
                            plugin={this.props.plugin}
                            pluginComponents={this.props.pluginComponents}
                            disabled={!this.state.editing}
                        />
                        {
                            this.state.editing ? (
                                <CommonButton className="ts-dialog-button" onClick={this.handleSave}>
                                    <i className="material-icons margin-right-8 vertical-middle">save</i>
                                    {i18n.t('action.save')}
                                </CommonButton>
                            ) : null
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('plugin.events')} key="2">
                        Events
                    </Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

export default DetailPluginDialog;
