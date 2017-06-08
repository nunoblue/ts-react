import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';

import * as actions from '../actions/devices';

class Devices extends Component {
    state = {
        limit: 30,
        textSearch: '',
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('Devices Render');
        let limit = this.state.limit;
        let textSearch = this.state.textSearch;
        this.props.getDevicesRequest(limit, textSearch);
    }

    components = () => {
        return (
            this.props.data.map((data, index) => {
                let name = data.name;
                let description = data.additionalInfo ? (data.additionalInfo.description ? data.additionalInfo.description : '') : '';
                return (
                    <Card key={index} title={name} description={description}/>
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
        statusMessage: state.devices.statusMessage,
        data: state.devices.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDevicesRequest: (limit, textSearch) => {
            return dispatch(actions.getDevicesRequest(limit, textSearch));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices);