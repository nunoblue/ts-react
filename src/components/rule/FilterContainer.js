import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form, Input, Button } from 'antd';
import SortableItems from './SortableItems';
import CommonModal from '../common/CommonModal';
import FilterForm from './FilterForm';
import * as actions from '../../actions/rules';

const FILTER = 'FILTER';

class FilterList extends Component {
    static propTypes = {
        filters: PropTypes.array,
    }

    state = {
        modal: {
            visible: false,
        },
        filter: {},
    }

    // http://localhost:8080/api/components/FILTER
    componentDidMount() {
        this.props.getComponentsRequest(FILTER);
    }

    modalHandler = {
        show: () => {
            this.setState({
                modal: {
                    visible: true,
                },
            });
        },
        hide: () => {
            this.setState({
                modal: {
                    visible: false,
                },
            });
        },
    }

    render() {
        const isAdd = _.isEmpty(this.state.filter);
        const { modal } = this.state;

        return (
            <div>
                <ul>
                    <SortableItems items={this.props.filters} />
                </ul>
                <Button type="primary" icon="plus" onClick={this.modalHandler.show}>추가</Button>

                <CommonModal
                    ref={(c) => { this.modal = c; }}
                    title={isAdd ? '추가' : '수정'}
                    // onOk={this.props.onSave}
                    onCancel={this.modalHandler.hide}
                    okText={isAdd ? '추가' : '수정'}
                    cancelText="취소"
                    visible={modal.visible}
                >

                    <FilterForm filters={this.props.components} />
                </CommonModal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.rules.statusMessage,
        components: state.rules.components,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getComponentsRequest: componentType => dispatch(actions.getComponentsRequest(componentType)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterList);
