import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Switch, Row, Collapse } from 'antd';
import update from 'immutability-helper';

import CommonDialog from '../common/CommonDialog';
import CommonButton from '../common/CommonButton';
import RuleForm from './RuleForm';
import FilterContainer from '../../containers/rule/FilterContainer';
import ProcessorContainer from '../../containers/rule/ProcessorContainer';
import PluginContainer from '../../containers/rule/PluginContainer';

const Panel = Collapse.Panel;

class RuleDetailDialog extends Component {
    static propTypes = {
        rule: PropTypes.object,
        pluginToken: PropTypes.string,
        action: PropTypes.object,
    };
    state = {
        editing: false,
        title: null,
        rule: this.props.rule,
        filters: this.props.filters || [],
        processor: this.props.processor || {},
        plugin: this.props.plugin || {},
        action: this.props.action || {},
    };
    changeEdit = () => {
        this.setState({
            editing: !this.state.editing,
        });
    };
    clearEdit = () => {
        this.setState({
            editing: false,
            title: null,
        });
    };
    initTitle = (title) => {
        this.setState({
            title,
        });
    };
    handleSave = () => {
        const type = 'dialog';
        this.props.onSave(type);
    };
    handleTitleChange = (value) => {
        this.setState({
            title: value,
        });
    };

    handlerFilter = {
        add: (filter) => {
            this.setState({
                filters: update(
                    this.state.filters,
                    {
                        $push: [filter],
                    },
                ),
            });
        },
        edit: (filter) => {
            const { key } = filter;
            const filters = this.state.filters;
            const index = filters.findIndex(savedFilter => savedFilter.key === key);
            this.setState({
                filters: update(
                    this.state.filters,
                    {
                        [index]: {
                            clazz: { $set: filter.clazz },
                            configuration: { $set: filter.configuration },
                            filterTypeName: { $set: filter.filterTypeName },
                            name: { $set: filter.name },
                        },
                    },
                ),
            });
        },
        delete: (filter) => {
            const { key } = filter;
            const filters = this.state.filters;
            const index = filters.findIndex(savedFilter => savedFilter.key === key);
            this.setState({
                filters: update(
                    this.state.filters,
                    {
                        $splice: [[index, 1]],
                    },
                ),
            });
        },
    };

    handlerProcessor = {
        edit: (processor) => {
            this.setState({
                processor,
            });
        },
        delete: () => {
            this.setState({
                processor: {},
            });
        },
    };

    handlerAction = {
        edit: (action) => {
            this.setState({
                action,
            });
        },
        delete: () => {
            this.setState({
                action: {},
            });
        },
    };

    handlerPlugin = (plugin) => {
        this.setState({
            plugin,
        });
    };
    render() {
        console.log('render : RuleDetailDialog.js');
        const { rule, visible, closeDialog, buttonComponents } = this.props;
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                subTitle="규칙 상세정보"
                tooltipTitle="상세정보 닫기"
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="상세" key="1">
                        <Row>
                            {rule ? buttonComponents(rule) : null}
                            {<Switch
                                checkedChildren={'쓰기'}
                                unCheckedChildren={'읽기'}
                                checked={this.state.editing}
                                onChange={this.changeEdit}
                            />}
                        </Row>
                        <RuleForm
                            ref={(c) => { this.form = c; }}
                            rule={this.props.rule}
                            disabled={!this.state.editing}
                        />

                        <div className="ant-row ant-form-item">
                        <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                            <Panel header="필터" key="1">
                                <FilterContainer
                                    filters={this.props.filters}
                                    onSave={this.handlerFilter.edit}
                                    onAdd={this.handlerFilter.add}
                                    onDelete={this.handlerFilter.delete}
                                    disabled={!this.state.editing}
                                />
                            </Panel>
                            <Panel header="프로세서" key="2">
                                <ProcessorContainer
                                    processor={this.props.processor}
                                    onSave={this.handlerProcessor.edit}
                                    onDelete={this.handlerProcessor.delete}
                                    disabled={!this.state.editing}
                                />
                            </Panel>
                        </Collapse>

                        <PluginContainer
                            plugin={this.props.plugin}
                            pluginToken={this.props.pluginToken}
                            action={this.props.action}
                            onPluginSave={this.handlerPlugin}
                            onSave={this.handlerAction.edit}
                            onDelete={this.handlerAction.delete}
                            disabled={!this.state.editing}
                        />
                        {
                            this.state.editing ? (
                                <CommonButton className="ts-dialog-button" onClick={this.handleSave}>
                                    <i className="material-icons margin-right-8 vertical-middle">save</i>
                                    적용
                                </CommonButton>
                            ) : null
                        }
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="이벤트" key="2">Content of Tab Pane 2</Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

export default RuleDetailDialog;
