import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Modal, notification, Button } from 'antd';
import i18n from 'i18next';
import _ from 'lodash';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';
import CommonCheckBox from '../components/common/CommonCheckbox';
import AddPluginModal from '../components/plugin/AddPluginModal';
import DetailPluginDialog from '../components/plugin/DetailPluginDialog';

import * as actions from '../actions/plugin/plugins';
import * as ruleActions from '../actions/rule/rules';

import config from '../config';

class Plugins extends Component {

    state = {
        checkedCount: 0,
        checkedIdArray: [],
        plugin: {},
        dialogVisible: false,
    }

    componentDidMount() {
        this.props.getPluginsRequest();
        this.props.getComponentsRequest('PLUGIN');
    }

    modalHandler = {
        show: () => {
            if (this.addModal.form && this.addModal.form.resetFields) {
                this.addModal.form.resetFields();
            }
            this.addModal.modal.onShow();
        },
        hide: () => {
            this.addModal.modal.onHide();
        },
    };

    handleDeleteConfirm = (title, id) => {
        let deleteTitle = null;
        const deleteContent = i18n.t('plugin.delete-plugin-text');
        const deleteEvent = this.handleDeletePlugins.bind(this, id);
        if (id) {
            deleteTitle = i18n.t('plugin.delete-plugin-title', { pluginName: title });
        } else {
            deleteTitle = i18n.t('plugin.delete-plugins-title', { count: this.state.checkedCount });
        }
        return Modal.confirm({
            title: deleteTitle,
            content: deleteContent,
            okText: i18n.t('action.ok'),
            cancelText: i18n.t('action.cancel'),
            onOk: deleteEvent,
        });
    };

    handleDeletePlugins = (id) => {
        const idArray = id ? [id] : this.state.checkedIdArray;
        this.props.deletePluginsRequest(idArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.props.getPluginsRequest();
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    };

    handleSavePlugin = (type) => {
        const isDialog = type === 'dialog';
        const form = isDialog ? this.detailDialog.form : this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }

            const { plugin } = this.state;
            const { pluginName, pluginDescription, apiToken, pluginType } = values;
            const pluginComponent = this.props.pluginComponents.find(component => component.clazz === pluginType);
            const { properties } = pluginComponent.configurationDescriptor.schema;
            const configuration = {};
            Object.keys(properties).forEach((key) => {
                if (properties[key].type === 'array') {
                    const { keys } = values;
                    const { properties: itemProperties } = properties[key].items;
                    const itemKeys = Object.keys(itemProperties);

                    const newProperties = keys.map((k) => {
                        const newProp = {};
                        itemKeys.forEach((ik) => {
                            newProp[ik] = values[`${key}-${ik}-${k}`];
                        });
                        return newProp;
                    });
                    configuration[key] = newProperties;
                } else {
                    configuration[key] = values[key];
                }
            });
            const newPlugin = {
                name: pluginName,
                additionalInfo: {
                    description: pluginDescription,
                },
                clazz: pluginType,
                apiToken,
                configuration,
            };
            if (isDialog) {
                Object.assign(plugin, newPlugin);
            }
            this.props.savePluginRequest(isDialog ? plugin : newPlugin).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.props.getPluginsRequest();
                    if (isDialog) {
                        this.detailDialogHandler.show(this.state.plugin.id.id);
                    } else {
                        this.modalHandler.hide();
                    }
                } else {
                    notification.error({
                        message:this.props.errorMessage,
                    });
                }
            });
        });
    }

    handleChecked = (e) => {
        let checkedCount = this.state.checkedCount;
        const checkedIdArray = this.state.checkedIdArray;
        if (e.target.checked) {
            checkedIdArray.push(e.target.value);
            checkedCount += 1;
        } else {
            const index = checkedIdArray.indexOf(e.target.value);
            checkedIdArray.splice(index, 1);
            checkedCount -= 1;
        }
        this.setState({
            checkedCount,
            checkedIdArray,
        });
    };

    handlePluginState = (id, state) => {
        this.props.activatePluginRequest(id, state).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.props.getPluginsRequest().then(() => {
                    if (this.state.plugin) {
                        const plugin = this.findPlugin(id);
                        this.setState({
                            plugin,
                        });
                    }
                });
            } else {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    };

    detailDialogHandler = {
        show: (pluginId) => {
            this.detailDialog.clearEdit();
            this.detailDialog.form.resetFields();
            const plugin = this.findPlugin(pluginId);
            this.setState({
                dialogVisible: true,
                plugin,
            });
        },
        hide: () => {
            this.setState({
                dialogVisible: false,
                plugin: {},
            });
        },
    }

    findPlugin = (pluginId) => {
        const { data } = this.props;
        return data.find(r => r.id.id === pluginId);
    };

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const state = data.state;
            const id = data.id.id;
            const openDialog = this.detailDialogHandler.show.bind(this, id);

            return (
                <CommonCard
                    key={id}
                    title={
                        <CommonCheckBox value={id} onChange={this.handleChecked}>{name}</CommonCheckBox>
                    }
                    content={state}
                    buttonTooltip="Plugin Delete"
                    onSelfEvent={this.detailDialogHandler.hide}
                    onNextEvent={openDialog}
                >
                    {this.getButtonComponents(data)}
                </CommonCard>
            );
        });
        return components;
    }

    getButtonComponents = (plugin) => {
        if (plugin == null || _.isEmpty(plugin)) {
            return null;
        }
        const { name, state } = plugin;
        const id = plugin.id.id;
        const nullUID = config.nullUID;
        const deleteConfirm = this.handleDeleteConfirm.bind(this, name, id);
        const changeState = this.handlePluginState.bind(this, id, state);
        return (
            <Button.Group className="custom-card-buttongroup">
                <CommonButton
                    visible={plugin && nullUID !== plugin.tenantId.id}
                    className="custom-card-button"
                    iconClassName={state === 'ACTIVE' ? 'pause' : 'caret-right'}
                    tooltipTitle={state === 'ACTIVE' ? i18n.t('plugin.suspend') : i18n.t('plugin.activate')}
                    onClick={changeState}
                />
                <CommonButton
                    visible={plugin && nullUID !== plugin.tenantId.id}
                    className="custom-card-button"
                    iconClassName="delete"
                    tooltipTitle={i18n.t('plugin.delete')}
                    onClick={deleteConfirm}
                />
            </Button.Group>
        );
    };

    render() {
        return (
            <Row>
                {this.components()}

                <div className="footer-buttons">
                    <CommonButton
                        visible={this.state.checkedCount > 0}
                        tooltipTitle={`규칙 ${this.state.checkedCount}건 삭제`}
                        className="custom-card-button"
                        iconClassName="delete"
                        onClick={this.handleDeleteConfirm}
                        size="large"
                        shape="circle"
                    />
                    <CommonButton
                        tooltipTitle={i18n.t('plugin.add')}
                        className="custom-card-button"
                        iconClassName="plus"
                        onClick={this.modalHandler.show}
                        size="large"
                        shape="circle"
                    />
                </div>

                <AddPluginModal
                    ref={(c) => { this.addModal = c; }}
                    pluginComponents={this.props.pluginComponents}
                    onSave={this.handleSavePlugin}
                />
                <DetailPluginDialog
                    ref={(c) => { this.detailDialog = c; }}
                    pluginComponents={this.props.pluginComponents}
                    plugin={this.state.plugin}
                    visible={this.state.dialogVisible}
                    onSave={this.handleSavePlugin}
                    closeDialog={this.detailDialogHandler.hide}
                    buttonComponents={this.getButtonComponents}
                />
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    statusMessage: state.plugins.statusMessage,
    data: state.plugins.data,
    errorMessage: state.plugins.errorMessage,
    pluginComponents: state.rules.pluginComponents,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getPluginsRequest: actions.getPluginsRequest,
    deletePluginsRequest: actions.deletePluginsRequest,
    savePluginRequest: actions.savePluginRequest,
    activatePluginRequest: actions.activatePluginRequest,
    getComponentsRequest: ruleActions.getComponentsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
