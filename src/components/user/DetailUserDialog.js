import React, { Component } from 'react';
import { Switch, Row } from 'antd';

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
        const { t, userId, visible, options, onPressEnter, closeDialog } = this.props;
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                subTitle={t('user.user-details')}
                tooltipTitle="상세정보 닫기"
            >
                <Row>
                    <CommonButton className="ts-dialog-button">
                        <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                        {t('user.resend-activation')}
                    </CommonButton>
                    <CommonButton className="ts-dialog-button">
                        <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                        {t('user.delete')}
                    </CommonButton>
                    <Switch checkedChildren={'쓰기'} unCheckedChildren={'읽기'} checked={this.state.editing} onChange={this.changeEdit}>
                        {t('details:details.toggle-edit-mode')}
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
                        {t('action:action.apply-changes')}
                    </CommonButton>
                ) : null}
            </CommonDialog>
        );
    }
}

export default DetailDeviceDialog;
