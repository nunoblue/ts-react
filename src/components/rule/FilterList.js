import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'antd';
import SortableItems from './SortableItems';
import CommonModal from '../common/CommonModal';


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
        // get filter types for setting
    }
    modalHandler = {
        show: () => {
            this.setState({
                modal: {
                    visible: true,
                },
            });
        },
    }



    render() {
        const isAdd = _.isEmpty(this.state.filter);
        const { modal } = this.state;
        console.log(modal.visible);
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
                    // onCancel={this.props.onCancel}
                    okText={isAdd ? '추가' : '수정'}
                    cancelText="취소"
                    visible={modal.visible}
                >
                    modal
                </CommonModal>
            </div>
        );
    }
}

export default FilterList;