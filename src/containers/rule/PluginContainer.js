import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Select } from 'antd';
import _ from 'lodash';

import * as ruleActions from '../../actions/rules';
import * as pluginActions from '../../actions/plugins';
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

    // componentWillReceiveProps(nextProps) {
    //     console.log('nextProps.pluginToken, this.props.plugins', nextProps.pluginToken, this.props.plugins);
    //     if (nextProps.pluginToken && this.props.plugins) {
    //         console.log('nextProps.pluginToken,texst');
    //         const livePlugins = this.props.plugins.filter((plugin) => {
    //             const { clazz } = plugin;
    //             const index = this.props.pluginComponents.findIndex(c => clazz === c.clazz && c.actions);
    //             return index > -1;
    //         });
    //         const selectedPlugin = livePlugins.find(p => p.apiToken === nextProps.pluginToken);
    //         const pluginComponent = this.props.pluginComponents.find(pc => pc.clazz === selectedPlugin.clazz);
    //
    //         this.setState({
    //             plugin: selectedPlugin,
    //             pluginComponent,
    //         });
    //
    //         this.props.onPluginSave(selectedPlugin);
    //         console.log('should!!!!!!!!', this.props.actionComponent, nextProps.actionComponent,
    //             'isEqual', _.isEqual(this.props.actionComponent, nextProps.actionComponent));
    //
    //         if (pluginComponent && _.isEmpty(this.props.actionComponent)) {
    //             const { actions } = pluginComponent;
    //             this.props.onDelete(this.props.action);
    //             this.props.getComponentRequest(actions);
    //         }
    //     }
    // }
    //
    // shouldComponentUpdate(nextProps, nextStates) {
    //     console.log('should!!!!!!!!', this.props.actionComponent, nextProps.actionComponent, 'isEqual', _.isEqual(this.props.actionComponent, nextProps.actionComponent));
    //     if (_.isEqual(this.props.actionComponent, nextProps.actionComponent)) {
    //         console.log('isEqual');
    //         return false;
    //     }
    //     return true;
    // }

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate!!!!!!!!', this.props.actionComponent, prevProps.actionComponent)
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
                <Collapse bordered={false} defaultActiveKey={['1']}>
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
        console.log('Render : PluginContainer.js');
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
        plugins: state.plugins.plugins,
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
