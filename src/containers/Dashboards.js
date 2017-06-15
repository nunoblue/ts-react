import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'antd';

import CardButton from '../components/CardButton';
import CustomCard from '../components/CustomCard';

import * as actions from '../actions/dashboards';

class Dashboards extends Component {

    state = {
        limit: 30,
        textSearch: '',
    }

    componentDidMount() {
        console.log('Dashboards Render');
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.props.getDashboardsRequest(limit, textSearch);
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const id = data.id.id;
            return (
                <CustomCard key={id} title={title} buttonTooltip="Dashboard Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <Row>
                {this.components()}
                <CardButton content="Dashboard Add" iconClassName="add" />
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.dashboards.statusMessage,
        data: state.dashboards.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDashboardsRequest: (limit, textSearch) => dispatch(actions.getDashboardsRequest(limit, textSearch)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboards);
