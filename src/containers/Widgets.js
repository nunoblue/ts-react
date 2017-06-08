import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/widgets';
import Card from '../components/Card';

class Widgets extends Component {

    componentDidMount() {
        console.log('Widgets Render');
        this.props.getWidgetsRequest();
    }

    components = () => {
        return (
            this.props.data.map((data, index) => {
                let title = data.title;
                return (
                    <Card key={index} title={title} />
                );
            })
        )
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
        statusMessage: state.widgets.statusMessage,
        data: state.widgets.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getWidgetsRequest: () => {
            return dispatch(actions.getWidgetsRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Widgets);