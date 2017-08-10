import React, { Component } from 'react';
import { Switch, Row } from 'antd';
import i18n from 'i18next';

import CommonDialog from '../common/CommonDialog';
import CommonButton from '../common/CommonButton';
import DashboardForm from './DashboardForm';
import { types } from '../../utils/commons';

class DetailDashboardDialog extends Component {
    state = {
        type: 'dialog',
        editing: false,
        title: null,
        activeKey: 'detail',
    }

    handleClickEdit = () => {
        const { onCancelDialogEdit } = this.props;
        if (this.state.editing) {
            onCancelDialogEdit();
        }
        this.setState({
            editing: !this.state.editing,
            activeKey: 'detail',
        });
    }

    changeEdit = () => {
        this.setState({
            editing: !this.state.editing,
            title: null,
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
        this.props.onSave(this.state.type);
    }

    handleTitleChange = (value) => {
        this.setState({
            title: value,
        });
    }

    handleChangeActiveTabs = (value) => {
        this.setState({
            activeKey: value,
        });
    }

    footerComponents = () => {
        return (
            this.state.editing ? (
                <CommonButton className="ts-card-button" onClick={this.handleSave}>
                    <i className="material-icons vertical-middle">save</i>
                    {i18n.t('action.apply-changes')}
                </CommonButton>
            ) : null
        );
    }

    tabActionComponents = () => {
        const isDetail = this.state.activeKey === 'detail';
        return isDetail ? (
            <CommonButton
                className="ts-card-button"
                shape="circle"
                tooltipTitle={i18n.t('details.toggle-edit-mode')}
                onClick={this.handleClickEdit}
            >
                {
                    !this.state.editing ? (
                        <i className="material-icons vertical-middle">mode_edit</i>
                    ) : (
                        <i className="material-icons vertical-middle">close</i>
                    )
                }
            </CommonButton>
        ) : null;
    }

    render() {
        const { data, visible, options, onPressEnter, closeDialog, buttonComponents } = this.props;
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                subTitle={i18n.t('dashboard.dashboard-details')}
                tooltipTitle={i18n.t('action.close')}
            >
                <Row>
                    {data ? buttonComponents(data.title, data.id.id, data.customerId.id, true) : null}
                </Row>
                <Switch checkedChildren={i18n.t('action.edit')} unCheckedChildren={i18n.t('action.view')} checked={this.state.editing} onChange={this.changeEdit}>
                    {i18n.t('details.toggle-edit-mode')}
                </Switch>
                <Row>
                    <DashboardForm
                        ref={(c) => { this.form = c; }}
                        onPressEnter={onPressEnter}
                        options={options}
                        disabled={!this.state.editing}
                        titleChangeEvent={this.handleTitleChange}
                        data={data || null}
                    />
                    {
                        this.state.editing ? (
                            <CommonButton className="ts-card-button" onClick={this.handleSave}>
                                <i className="material-icons margin-right-8 vertical-middle">save</i>
                                {i18n.t('action.apply-changes')}
                            </CommonButton>
                        ) : null
                    }
                </Row>
            </CommonDialog>
        );
    }
}

export default DetailDashboardDialog;
