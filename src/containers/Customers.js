import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';

import * as actions from '../actions/customers';

class Customers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            limit: 40,
            textSearch: '',
        };
    }

    componentDidMount() {
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.props.getCustomersRequest(limit, textSearch);
    }

    components = () => {
        return (
            this.props.data.map((data, index) => {
                const title = data.title;
                const description = data.additionalInfo ? (data.additionalInfo.description || '') : '';
                return (
                    <Card key={index} title={title} description={description} />
                );
            })
        );
    }

    render() {
        return (
            <div className="mdl-grid">
                {this.components()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.customers.statusMessage,
        data: state.customers.data,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomersRequest: (limit, textSearch) => {
            return dispatch(actions.getCustomersRequest(limit, textSearch));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Customers);