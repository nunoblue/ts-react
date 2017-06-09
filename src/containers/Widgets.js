import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import FooterButton from '../components/FooterButton';

import * as actions from '../actions/widgets';

class Widgets extends Component {

    componentDidMount() {
        console.log('Widgets Render');
        this.props.getWidgetsRequest();
    }

    components = () => {
        const components = this.props.data.map((data) => {
            const title = data.title;
            const id = data.id.id;
            return (
                <Card key={id} title={title} buttonTooltip="Widget Delete" />
            );
        });
        return components;
    }

    render() {
        return (
            <div className="mdl-grid">
                {this.components()}
                <FooterButton content="Widget Add" iconClassName="add" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusMessage: state.widgets.statusMessage,
        data: state.widgets.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getWidgetsRequest: () => dispatch(actions.getWidgetsRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Widgets);
