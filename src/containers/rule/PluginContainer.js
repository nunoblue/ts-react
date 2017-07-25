import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Select } from 'antd';
import _ from 'lodash';

import * as ruleActions from '../../actions/rule/rules';
import * as pluginActions from '../../actions/plugin/plugins';
import config from '../../config';
import PluginActionContainer from './PluginActionContainer';

const PLUGIN = 'PLUGIN';
const Panel = Collapse.Panel;
const nullUID = config.nullUID;

class PluginContainer extends Component {
    static propTypes = {
        plugin: PropTypes.object,
        pluginToken: PropTypes.string,
        action: PropTypes.object,
        onSave: PropTypes.func,
        onDelete: PropTypes.func,
        onPluginSave: PropTypes.func,
    };

    state = {
        modal: {
            visible: false,
        },
        plugin: this.props.plugin || {},
        pluginComponent: {},
    };

    componentDidMount() {
        this.props.getPluginsRequest().then(() => {
            if (this.props.pluginsStatusMessage === 'SUCCESS') {
                this.props.getComponentsRequest(PLUGIN);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pluginToken && this.props.plugins) {
            const livePlugins = this.props.plugins.filter((plugin) => {
                const { clazz } = plugin;
                const index = this.props.pluginComponents.findIndex(c => clazz === c.clazz && c.actions);
                return index > -1;
            });
            const selectedPlugin = livePlugins.find(p => p.apiToken === nextProps.pluginToken);
            const pluginComponent = this.props.pluginComponents.find(pc => pc.clazz === selectedPlugin.clazz);

            this.setState({
                plugin: selectedPlugin,
                pluginComponent,
            });

            this.props.onPluginSave(selectedPlugin);
            // console.log('actionComponent!!!', this.props.pluginToken, nextProps.pluginToken);
            if (pluginComponent && (_.isEmpty(this.props.actionComponent) || this.props.pluginToken !== nextProps.pluginToken)) {
                const { actions } = pluginComponent;
                this.props.onDelete(this.props.action);
                this.props.getComponentRequest(actions);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        // if (JSON.stringify(this.props.plugin) !== JSON.stringify(nextProps.plugin)) {
        //     return true;
        // } else if (JSON.stringify(this.props.pluginToken) !== JSON.stringify(nextProps.pluginToken)) {
        //     return true;
        // } else if (JSON.stringify(this.props.action) !== JSON.stringify(nextProps.action)) {
        //     return true;
        // } else if (JSON.stringify(this.state.modal.visible) !== JSON.stringify(nextState.modal.visible)) {
        //     return true;
        // } else if (JSON.stringify(this.state.plugin) !== JSON.stringify(nextState.plugin)) {
        //     return true;
        // } else if (JSON.stringify(this.state.pluginComponent) !== JSON.stringify(nextState.pluginComponent)) {
        //     return true;
        // } else if (JSON.stringify(this.props.pluginComponents) === JSON.stringify(nextProps.pluginComponents)) {
        //     return false;
        // } else if (JSON.stringify(this.props.actionComponent) === JSON.stringify(nextProps.actionComponent)) {
        //     return false;
        // }
        return true;
    }

    handleChange = (clazz) => {
        const plugin = this.props.plugins.find(p => p.clazz === clazz);
        const pluginComponent = this.props.pluginComponents.find(pc => pc.clazz === clazz);
        this.setState({
            plugin,
            pluginComponent,
        });

        this.props.onPluginSave(plugin);
        if (pluginComponent) {
            const { actions } = pluginComponent;
            this.props.onDelete(this.props.action);
            this.props.getComponentRequest(actions);
        }
    };

    pluginActionPanel = () => {
        if (!_.isEmpty(this.state.plugin)) {
            return (
                <Collapse bordered={false} defaultActiveKey={['1']} style={{ 'margin-bottom': '50px' }}>
                    <Panel header="플러그인 액션" key="1">
                        <PluginActionContainer
                            action={this.props.action}
                            actionComponent={this.props.actionComponent}
                            plugin={this.state.plugin}
                            pluginComponent={this.state.pluginComponent}
                            onSave={this.props.onSave}
                            onDelete={this.props.onDelete}
                        />
                    </Panel>
                </Collapse>
            );
        }
        return null;
    };

    render() {
        const Option = Select.Option;
        const pluginComponents = this.props.pluginComponents;
        const plugins = this.props.plugins;
        let options = null;
        if (pluginComponents && pluginComponents.length > 0 && plugins && plugins.length > 0) {
            const livePlugins = plugins.filter((plugin) => {
                const { clazz } = plugin;
                const index = pluginComponents.findIndex(c => clazz === c.clazz && c.actions);
                return index > -1;
            });
            options = livePlugins.map((plugin) => {
                const isSystem = nullUID === plugin.tenantId.id ? '시스템' : '';
                return (<Option key={plugin.clazz}>{plugin.name}
                    <span style={{ float: 'right' }}>{isSystem}</span>
                </Option>);
            });
        }

        const { plugin } = this.state;
        const pluginValue = _.isEmpty(plugin) ? null : plugin.clazz;
        const visibleStyle = {
            display: _.isEmpty(plugin) ? 'block' : 'none',
        }

        return (
            <div>
                <Select
                    // showSearch
                    style={{width: '100%'}}
                    placeholder="플러그인 선택"
                    showArrow={false}
                    allowClear
                    // optionFilterProp="children"
                    // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={this.handleChange}
                    dropdownStyle={visibleStyle}
                    value={pluginValue}
                >
                    {options}
                </Select>

                {this.pluginActionPanel()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.rules.statusMessage,
        pluginComponents: state.rules.pluginComponents,
        plugins: state.plugins.data,
        pluginsStatusMessage: state.plugins.statusMessage,
        actionComponent: state.rules.actionComponent,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getComponentsRequest: componentType => dispatch(ruleActions.getComponentsRequest(componentType)),
        getPluginsRequest: () => dispatch(pluginActions.getPluginsRequest()),
        getComponentRequest: clazz => dispatch(ruleActions.getComponentRequest(clazz)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PluginContainer);
