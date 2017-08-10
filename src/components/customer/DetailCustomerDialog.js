import React, { Component } from 'react';
import { Tabs, Switch, Row } from 'antd';
import i18n from 'i18next';

import CommonDialog from '../common/CommonDialog';
import CommonButton from '../common/CommonButton';
import CustomerForm from './CustomerForm';
import { types } from '../../utils/commons';

class DetailCustomerDialog extends Component {
    state = {
        type: 'dialog',
        editing: false,
        title: null,
        attributesScope: types.attributesScope.client,
    }

    handleClickEdit = () => {
        const { onCancelDialogEdit } = this.props;
        if (this.state.editing) {
            onCancelDialogEdit();
        }
        this.setState({
            editing: !this.state.editing,
        });
    }

    clearEdit = () => {
        this.setState({
            editing: false,
            title: null,
        });
    }

    initTitle = (title) => {
        this.setState({
            title,
        });
    }

    handleSave = () => {
        const type = 'dialog';
        this.props.onSave(type);
    }

    handleTitleChange = (value) => {
        this.setState({
            title: value,
        });
    }

    render() {
        const { data, visible, options, onPressEnter, closeDialog, buttonComponents } = this.props;
        let isPublic = false;
        const additionalInfo = data ? data.additionalInfo : null;
        if (additionalInfo) {
            isPublic = typeof additionalInfo.isPublic !== 'undefined' ? additionalInfo.isPublic : false;
        }
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                subTitle={i18n.t('customer.customer-details')}
                tooltipTitle={i18n.t('action.close')}
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={i18n.t('customer.details')} key="1">
                        <Row>
                            {data ? buttonComponents(data.title, data.id.id, isPublic, true) : null}
                            <CommonButton className="ts-card-button">
                                <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                                {i18n.t('customer.copyId')}
                            </CommonButton>
                            {
                                !isPublic ? (
                                    <Switch checkedChildren={i18n.t('action.edit')} unCheckedChildren={i18n.t('action.view')} checked={this.state.editing} onChange={this.changeEdit}>
                                        {i18n.t('details.toggle-edit-mode')}
                                    </Switch>
                                ) : null
                            }
                        </Row>
                        <CustomerForm
                            ref={(c) => { this.form = c; }}
                            onPressEnter={onPressEnter}
                            options={options}
                            disabled={!this.state.editing}
                            titleChangeEvent={this.handleTitleChange}
                        />
                        {
                            !isPublic && this.state.editing ? (
                                <CommonButton className="ts-card-button" onClick={this.handleSave}>
                                    <i className="material-icons margin-right-8 vertical-middle">save</i>
                                    {i18n.t('action.apply-changes')}
                                </CommonButton>
                            ) : null
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('attribute.attributes')} key="2">Content of Tab Pane 2</Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('attribute.latest-telemetry')} key="3">Content of Tab Pane 3</Tabs.TabPane>
                    <Tabs.TabPane tab={i18n.t('customer.events')} key="4">Content of Tab Pane 4</Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

export default DetailCustomerDialog;
