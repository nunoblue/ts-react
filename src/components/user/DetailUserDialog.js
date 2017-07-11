import React, { Component } from 'react';
import { Switch, Row } from 'antd';
import i18n from 'i18next';

import CommonDialog from '../common/CommonDialog';
import CommonButton from '../common/CommonButton';
import UserForm from './UserForm';

class DetailDeviceDialog extends Component {
    state = {
        editing: false,
        title: null,
    }

    changeEdit = () => {
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
                subTitle={i18n.t('user.user-details')}
                tooltipTitle={i18n.t('action.close')}
            >
                <Row>
                    {data ? buttonComponents(data.email, data.id.id, isPublic, 'dialog') : null}
                    <Switch
                        checkedChildren={i18n.t('action.edit')}
                        unCheckedChildren={i18n.t('action.view')}
                        checked={this.state.editing}
                        onChange={this.changeEdit}
                    >
                        {i18n.t('details.toggle-edit-mode')}
                    </Switch>
                </Row>
                <UserForm
                    ref={(c) => { this.form = c; }}
                    onPressEnter={onPressEnter}
                    options={options}
                    disabled={!this.state.editing}
                    titleChangeEvent={this.handleTitleChange}
                />
                {this.state.editing ? (
                    <CommonButton className="ts-dialog-button" onClick={this.handleSave}>
                        <i className="material-icons margin-right-8 vertical-middle">save</i>
                        {i18n.t('action.apply-changes')}
                    </CommonButton>
                ) : null}
            </CommonDialog>
        );
    }
}

export default DetailDeviceDialog;
