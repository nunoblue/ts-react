import React, { Component } from 'react';
import { Tabs, Switch, Row } from 'antd';

import CommonDialog from '../common/CommonDialog';
import CommonButton from '../common/CommonButton';
import CustomerForm from './CustomerForm';

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
        const { t, customerId, visible, options, onPressEnter, closeDialog, isPublic } = this.props;
        return (
            <CommonDialog
                onClick={closeDialog}
                visible={visible}
                title={this.state.title}
                subTitle={t('customer.customer-details')}
                tooltipTitle="상세정보 닫기"
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={t('customer.details')} key="1">
                        <Row>
                            <CommonButton className="ts-dialog-button">
                                <i className="material-icons margin-right-8 vertical-middle">assignment_return</i>
                                {t('customer.copyId')}
                            </CommonButton>
                            {
                                !isPublic ? (
                                    <Switch checkedChildren={'쓰기'} unCheckedChildren={'읽기'} checked={this.state.editing} onChange={this.changeEdit}>
                                        {t('details:details.toggle-edit-mode')}
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
                                <CommonButton className="ts-dialog-button" onClick={this.handleSave}>
                                    <i className="material-icons margin-right-8 vertical-middle">save</i>
                                    {t('action:action.apply-changes')}
                                </CommonButton>
                            ) : null
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={t('attribute:attribute.attributes')} key="2">Content of Tab Pane 2</Tabs.TabPane>
                    <Tabs.TabPane tab={t('attribute:attribute.latest-lelmetry')} key="3">Content of Tab Pane 3</Tabs.TabPane>
                    <Tabs.TabPane tab={t('customer.events')} key="4">Content of Tab Pane 4</Tabs.TabPane>
                </Tabs>
            </CommonDialog>
        );
    }
}

export default DetailDeviceDialog;
