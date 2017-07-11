import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notification, Row } from 'antd';
import i18n from 'i18next';

import * as actions from '../actions/admins';
import CommonCard from '../components/common/CommonCard';
import CommonButton from '../components/common/CommonButton';
import AdminMailSettingForm from '../components/admin/AdminMailSettingForm';
import AdminGeneralSettingForm from '../components/admin/AdminGeneralSettingForm';

export class Admin extends Component {

    state = {
        key: 'general',
    }

    componentDidMount() {
        console.log('Setting Render');
        const path = this.props.location.pathname.split('/')[2];
        let key;
        if (path === 'outgoing-mail') {
            key = 'mail';
        } else {
            key = 'general';
        }
        this.refershAdminSettingsRequest(key);
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevProps.data === this.props.data) {
            return false;
        }

        return true;
    }

    refershAdminSettingsRequest = (key) => {
        this.setState({
            key,
        });
        this.props.getAdminSettingsRequest(key).then(() => {
            if (this.props.statusMessage !== 'SUCCESS') {
                notification.error({
                    message: this.props.errorMessage,
                });
            }
        });
    }

    handleSave = () => {
        const { data } = this.props;
        this.form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            Object.keys(values).map((key) => {
                if (typeof values[key] !== 'string') {
                    Object.assign(values, { [key]: values[key].toString() });
                }
            });

            const temp = Object.assign({}, data, { jsonValue: values });
            this.props.saveAdminSettingsRequest(temp).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershAdminSettingsRequest(this.state.key);
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    render() {
        const { data } = this.props;
        if (Object.keys(data).length !== 0) {
            return (
                <Row>
                    <CommonCard
                        title={i18n.t(this.state.key === 'mail' ? 'admin.outgoing-mail-settings' : 'admin.general-settings')}
                        content={this.state.key === 'mail' ?
                            <AdminMailSettingForm
                                ref={(c) => { this.form = c; }}
                                value={data.jsonValue}
                                onPressEnter={this.handleSave}
                            />
                            : <AdminGeneralSettingForm
                                ref={(c) => { this.form = c; }}
                                value={data.jsonValue}
                                onPressEnter={this.handleSave}
                            />
                        }
                    >
                        <CommonButton
                            type="primary"
                            onClick={this.handleSave}
                        >
                            {i18n.t('action:action.save')}
                        </CommonButton>
                    </CommonCard>
                </Row>
            );
        }
        return null;
    }
}

const mapStateToProps = (state) => ({
    statusMessage: state.admins.statusMessage,
    errorMessage: state.admins.errorMessage,
    data: state.admins.data,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getAdminSettingsRequest: actions.getAdminSettingsRequest,
    saveAdminSettingsRequest: actions.saveAdminSettingsRequest,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Admin);
