import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import Button from '../components/Button';

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
        const components = this.props.data.map((data) => {
            const title = data.title;
            const description = data.additionalInfo ? (data.additionalInfo.description || '') : '';
            const id = data.id.id;
            return (
                <Card key={id} title={title} description={description} />
            );
        });

        return components;
    }

    render() {
        return (
            <div className="mdl-grid">
                {this.components()}
                <Button content="Customer Add" />
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
