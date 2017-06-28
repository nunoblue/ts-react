import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, notification } from 'antd';

import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomModal from '../components/common/CustomModal';
import CustomCheckbox from '../components/common/CustomCheckbox';
import AddCustomerModal from '../components/customer/AddCustomerModal';
import AddCustomerForm from '../components/customer/AddCustomerForm';

import * as actions from '../actions/customers';

class Customers extends Component {
    state = {
        limit: 40,
        textSearch: '',
        checkedCount: 0,
        checkedIdArray: [],
    };

    componentDidMount() {
        console.log('Customers Render');
        this.refershCustomerRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const address = data.address ? (data.address || '') : '';
            const id = data.id.id;
            const isPublic = data.additionalInfo ? (data.additionalInfo.isPublic || false) : false;
            const modalConfirmAction = this.handleDeleteConfirm.bind(this, title, id);
            return (
                <CustomCard key={id} id={id} title={<CustomCheckbox value={id} onChange={this.handleChecked}>{title}</CustomCheckbox>} content={address}>
                    <CustomButton className="custom-card-button" isUsed={!isPublic} iconClassName="user-add" tooltipTitle="커스터머 사용자 관리" />
                    <CustomButton className="custom-card-button" iconClassName="tablet" tooltipTitle="커스터머 디바이스 관리" />
                    <CustomButton className="custom-card-button" iconClassName="layout" tooltipTitle="커스터머 대시보드 관리" />
                    <CustomButton className="custom-card-button" isUsed={!isPublic} iconClassName="delete" onClick={modalConfirmAction} tooltipTitle="커스터머 디바이스 삭제" />
                </CustomCard>
            );
        });

        return components;
    }

    refershCustomerRequest = () => {
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.setState({
            checkedIdArray: [],
            checkedCount: 0,
        });
        this.props.getCustomersRequest(limit, textSearch);
    }

    handleChecked = (e) => {
        const checkedCount = this.state.checkedCount;
        const checkedIdArray = this.state.checkedIdArray;
        if (e.target.checked) {
            checkedIdArray.push(e.target.value);
            this.setState({
                checkedCount: checkedCount + 1,
                checkedIdArray,
            });
        } else {
            const pos = this.state.checkedIdArray.indexOf(e.target.value);
            checkedIdArray.splice(pos, 1);
            this.setState({
                checkedCount: checkedCount - 1,
                checkedIdArray,
            });
        }
    }

    handleDeleteConfirm = (title, id) => {
        const checkedCount = this.state.checkedCount;
        let newTitle;
        let newContent;
        let deleteEvent;
        if (checkedCount === 0) {
            newTitle = `'${title}' 커스터머를 삭제하시겠습니까?`;
            newContent = '커스터머 및 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleDeleteCustomer.bind(this, id);
        } else {
            newTitle = `커스터머 ${checkedCount}개를 삭제하시겠습니까?`;
            newContent = '선택된 커스터머는 삭제되고 관련된 모든 데이터를 복구할 수 없으므로 주의하십시오.';
            deleteEvent = this.handleMultipleDeleteCustomer.bind(this, id);
        }
        return Modal.confirm({
            title: newTitle,
            content: newContent,
            okText: '예',
            cancelText: '아니오',
            onOk: deleteEvent,
        });
    }

    openAddCustomerModal = () => {
        this.addModal.modal.onShow();
    }

    hideAddCustomerModal = () => {
        this.addModal.form.resetFields();
        this.addModal.modal.onHide();
    }

    handleDeleteCustomer = (customerId) => {
        this.props.deleteCustomerRequest(customerId).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershCustomerRequest();
            }
        });
    }

    handleMultipleDeleteCustomer = () => {
        this.props.multipleDeleteCustomerRequest(this.state.checkedIdArray).then(() => {
            if (this.props.statusMessage === 'SUCCESS') {
                this.refershCustomerRequest();
            }
        });
    }

    handleSaveCustomer = () => {
        const form = this.addModal.form;
        form.validateFields((err, values) => {
            if (err) {
                return false;
            }
            this.props.saveCustomerRequest(values).then(() => {
                if (this.props.statusMessage === 'SUCCESS') {
                    this.refershCustomerRequest();
                    this.hideAddCustomerModal();
                } else {
                    notification.error({
                        message: this.props.errorMessage,
                    });
                }
            });
        });
    }

    render() {
        return (
            <Row>
                {this.components()}
                <div className="footer-buttons">
                    <CustomButton
                    isUsed={this.state.checkedCount !== 0}
                    tooltipTitle={`커스터머 ${this.state.checkedCount}개 삭제`}
                    className="custom-card-button"
                    iconClassName="delete"
                    onClick={this.handleDeleteConfirm}
                    size="large"
                    />
                    <CustomButton tooltipTitle="커스터머 추가" className="custom-card-button" iconClassName="plus" onClick={this.openAddCustomerModal} size="large" />
                </div>
                <AddCustomerModal ref={(c) => { this.addModal = c; }} onSave={this.handleSaveCustomer} onCancel={this.hideAddCustomerModal} />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.customers.statusMessage,
        data: state.customers.data,
        errorMessage: state.customers.errorMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomersRequest: (limit, textSearch) => {
            return dispatch(actions.getCustomersRequest(limit, textSearch));
        },
        saveCustomerRequest: (customer) => {
            return dispatch(actions.saveCustomerRequest(customer));
        },
        deleteCustomerRequest: (customerId) => {
            return dispatch(actions.deleteCustomerRequest(customerId));
        },
        multipleDeleteCustomerRequest: (customerIdArray) => {
            return dispatch(actions.multipleDeleteCustomerRequest(customerIdArray));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
