import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';

import * as actions from '../actions/dashboards';

class Dashboards extends Component {

    state = {
        limit: 30,
        textSearch: ''
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('Dashboards Render');
        let limit = this.state.limit;
        let textSearch = this.state.textSearch;
        this.props.getDashboardsRequest(limit, textSearch);
    }

    components = () => {
        return (
            this.props.data.map((data, index) => {
                let title = data.title;
                return (
                    <Card key={index} title={title} />
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
        statusMessage: state.dashboards.statusMessage,
        data: state.dashboards.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDashboardsRequest: (limit, textSearch) => {
            return dispatch(actions.getDashboardsRequest(limit, textSearch));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboards);
