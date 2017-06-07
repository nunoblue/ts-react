import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table } from 'antd';

import * as actions from '../actions/devices';

const dataSource = [
    {
        key: '1',
        name: 'Mike',
        gateway: 32,
        description: '10 Downing Street'
    }, 
    {
        key: '2',
        name: 'John',
        gateway: 42,
        description: '10 Downing Street'
    }
];

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }, 
    {
        title: 'Gateway',
        dataIndex: 'gateway',
        key: 'gateway',
    }, 
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    }
];

class Devices extends Component {
    state = {
        limit: 30,
        textSearch: '',
        dataSource: []
    }

    constructor(props) {
        super(props);
        this.dataSource = dataSource;
        this.columns = columns;
    }

    componentDidMount() {
        console.log('Devices Render');
        let limit = this.state.limit;
        let textSearch = this.state.textSearch;
        this.props.getDevicesRequest(limit, textSearch).then((response) => {
            if(this.props.statusMessage == 'SUCCESS') {
                var newData;
                let newDataSource = response.data.data.map((data, index) => {
                    newData = {
                        key: index,
                        uuid: data.id.id,
                        name: data.name,
                        gateway: data.additionalInfo ? (data.additionalInfo.gateway ? ''+data.additionalInfo.gateway : 'false') : 'false',
                        description: data.additionalInfo ? (data.additionalInfo.description ? data.additionalInfo.description : '') : ''
                    }
                    return newData;
                })                
                this.setState({dataSource: newDataSource});
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="mui-container-fluid">
                <Table dataSource={this.state.dataSource} columns={columns} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.devices.statusMessage
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