import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Modal, notification, Button } from 'antd';
import i18n from 'i18next';
import _ from 'lodash';

import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';
import CommonCheckBox from '../components/common/CommonCheckbox';

import * as actions from '../actions/plugin/plugins';
import * as ruleActions from '../actions/rule/rules';

import config from '../config';

class Plugins extends Component {

    state = {
        checkedCount: 0,
        checkedIdArray: [],
        plugin: {},
    }

    componentDidMount() {
        this.props.getPluginsRequest();
        this.props.getComponentsRequest('PLUGIN');
    }

    modalHandler = {
        show: (id) => {},
        hide: () => {},
    }

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
    }

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
                this.props.getPluginsRequest()();
            } else {
                console.log('this.props.errorMessage', this.props.errorMessage);
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    };

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const state = data.state;
            const id = data.id.id;
            return (
                <CommonCard
                    key={id}
                    style={{ cursor: 'pointer' }}
                    title={
                        <CommonCheckBox value={id} onChange={this.handleChecked}>{name}</CommonCheckBox>
                    }
                    content={state}
                    buttonTooltip="Plugin Delete"
                    // onSelfEvent={}
                    // onNextEvent={}
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
        const handleShowAddModal = this.modalHandler.show.bind(this, null);
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
                        onClick={handleShowAddModal}
                        size="large"
                        shape="circle"
                    />
                </div>
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    statusMessage: state.plugins.statusMessage,
    data: state.plugins.data,
    errorMessage: state.plugins.errorMessage,
    pluginComponents: state.rules.pluginComponents,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getPluginsRequest: actions.getPluginsRequest,
    deletePluginsRequest: actions.deletePluginsRequest,
    activatePluginRequest: actions.activatePluginRequest,
    getComponentsRequest: ruleActions.getComponentsRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Plugins);
