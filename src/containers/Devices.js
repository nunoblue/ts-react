import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import Button from '../components/Button';

import * as actions from '../actions/devices';

class Devices extends Component {
    state = {
        limit: 30,
        textSearch: '',
    }

    componentDidMount() {
        console.log('Devices Render');
        const limit = this.state.limit;
        const textSearch = this.state.textSearch;
        this.props.getDevicesRequest(limit, textSearch);
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const name = data.name;
            const description = data.additionalInfo ? (data.additionalInfo.description || '') : '';
            const id = data.id.id;
            return (
                <Card key={id} title={name} description={description} />
            );
        });

        return components;
    }

    render() {
        return (
            <div className="mdl-grid">
                {this.components()}
                <Button content="Device Add" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.devices.statusMessage,
        data: state.devices.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDevicesRequest: (limit, textSearch) => dispatch(actions.getDevicesRequest(limit, textSearch)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
