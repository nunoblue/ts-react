import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Spin, Input, notification } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import i18n from 'i18next';

import storage from 'store/storages/localStorage';
import config from '../../config';
import CommonModal from './CommonModal';

const { apiHeaderPrefix } = config;
const xAuthorization = `${apiHeaderPrefix} ${storage.read('jwt_token')}`;
const Search = Input.Search;

class ItemSelectModal extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        multiple: PropTypes.bool.isRequired,
        labelField: PropTypes.string,
        valueField: PropTypes.string,
        showSearch: PropTypes.bool,
        message: PropTypes.string,
        title: PropTypes.string,
        onSelect: PropTypes.func,
    };
    static defaultProps = {
        labelField: null,
        valueField: null,
        showSearch: false,
        message: null,
        title: null,
        checked: false,
        onSelect: () => {},
    };
    state = {
        items: [],
        hasMoreItems: true,
        textSearch: '',
        limit: 10,
        idOffset: null,
        textOffset: null,
        selectedItems: [],
        selectedCount: 0,
        visible: false,
    };

    onShow = () => {
        this.setState({
            items: [],
            hasMoreItems: true,
            textSearch: '',
            limit: 10,
            idOffset: null,
            textOffset: null,
            selectedItems: [],
            selectedCount: 0,
        }, () => {
            this.modal.onShow();
        });
    };
    onHide = () => {
        this.modal.onHide();
    };

    searchInput = () => (<Search
        ref={(c) => { this.search = c; }}
        type="text"
        placeholder={i18n.t('common.enter-search')}
        onChange={this.handleSearch}
        value={this.state.textSearch}
    />);

    components = () => {
        const loader = <Spin />;
        const CheckboxGroup = Checkbox.Group;
        const { labelField, valueField, showSearch, multiple } = this.props;

        const items = this.state.items.map((item) => {
            let value = item;
            let label = item;
            if (labelField && valueField) {
                const vField = valueField.split('.');
                if (vField.length > 1) {
                    value = vField.reduce((prev, curr) => {             // eslint-disable-line arrow-body-style
                        return typeof prev !== 'object' ? item[prev][curr] : prev[curr];
                    });
                } else {
                    value = item[valueField];
                }
                label = item[labelField];
            }

            const checked = multiple ? null : this.state.selectedItems === value;
            return multiple ?
                (<div key={value}>
                    <Checkbox value={value}>
                        {label}
                    </Checkbox></div>)
                :
                (<div key={value}>
                    <Checkbox value={value} onChange={this.handleChange} checked={checked}>
                        {label}
                    </Checkbox>
                </div>);
        });

        return (
            <div style={{ height: '300px', overflow: 'auto' }}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadItems}
                    hasMore={this.state.hasMoreItems}
                    loader={loader}
                    useWindow={false}
                >
                    <div>
                        {showSearch ? this.searchInput : null}
                        {multiple ?
                            (<CheckboxGroup value={this.state.selectedItems} onChange={this.handleChange}>
                                {items}
                            </CheckboxGroup>) :
                            (<div>
                                {items}
                            </div>)
                        }
                    </div>
                </InfiniteScroll>
            </div>
        );
    };

    handleChange = (e) => {
        if (this.props.multiple) {
            this.setState({
                selectedItems: e,
            });
        } else {
            this.setState({
                selectedItems: e.target.value,
            });
        }
    };

    handleSelect = () => {
        this.props.onSelect(this.state.selectedItems);
    };

    handleSearch = (e) => {
        const textSearch = e.target.value;
        this.setState({
            items: [],
            hasMoreItems: false,
            textSearch,
            idOffset: null,
            textOffset: null,
            selectedItems: [],
            selectedCount: 0,
        }, () => {
            this.loadItems();
        });
    };

    loadItems = () => {
        const { limit, textSearch, idOffset, textOffset } = this.state;
        axios.get(this.props.url, {
            params: {
                limit,
                textSearch,
                idOffset,
                textOffset,
            },
            headers: {
                'X-Authorization': xAuthorization,
            },
        }).then((response) => {
            if (response) {
                const { data, nextPageLink, hasNext } = response.data;
                const items = hasNext ? data : this.state.items.concat(data);
                if (hasNext) {
                    this.setState({
                        items,
                        limit: nextPageLink.limit,
                        textSearch: nextPageLink.textSearch,
                        idOffset: nextPageLink.idOffset,
                        textOffset: nextPageLink.textOffset,
                        hasMoreItems: hasNext,
                    });
                } else {
                    this.setState({
                        items,
                        hasMoreItems: hasNext,
                    });
                }
            }
        }).catch((error) => {
            notification.error(error.response.data.message);
        });
    };

    render() {
        const { title } = this.props;
        const { selectedItems } = this.state;

        return (
            <CommonModal
                ref={(c) => { this.modal = c; }}
                title={title}
                onOk={this.handleSelect}
                okDisabled={selectedItems.length < 1}
                okText={i18n.t('action.assign')}
                cancelText={i18n.t('action.cancel')}
            >
                <p>{this.props.message}</p>
                {this.searchInput()}
                {this.components()}
            </CommonModal>
        );
    }
}

export default ItemSelectModal;
