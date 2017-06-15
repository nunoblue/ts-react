import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';

import CustomCard from '../components/CustomCard';
import CardButton from '../components/CardButton';

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
        console.log('Customers Render');
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
                <CustomCard key={id} title={title} description={description} buttonTooltip="Customer Delete" />
            );
        });

        return components;
    }

    render() {
        return (
            <Row>
                {this.components()}
                <CardButton content="Customer Add" iconClassName="add" />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.customers.statusMessage,
        data: state.customers.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomersRequest: (limit, textSearch) => {
            return dispatch(actions.getCustomersRequest(limit, textSearch));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
