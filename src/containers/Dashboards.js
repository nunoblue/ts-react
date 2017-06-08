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
                    <div key={index} className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet">
                        <Card title={title} />
                    </div>
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
