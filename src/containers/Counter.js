'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/counter';

class Counter extends Component {

    constructor(props) {
        super(props);
        
    }
    
    handleAdd = () => {
        const { handleIncrement } = this.props;
        handleIncrement(this.props.number);
    }

    handleRemove = () => {
        const { handleDecrement } = this.props;
        handleDecrement(this.props.number);
    }

    render() {
        return (
            <div className="mui-container-fluid">
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--12-col col-centered">
                        <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                            {this.props.number}
                        </button>
                    </div>
                </div>
                
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--12-col col-centered">
                        <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                            <i className="material-icons" onClick={this.handleAdd}>add</i>
                        </button>
                        <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                            <i className="material-icons" onClick={this.handleRemove}>remove</i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        number: state.counter.number
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleIncrement: (number) => { return dispatch(actions.incrementRequest(number))},
        handleDecrement: (number) => { return dispatch(actions.decrementRequest(number))},
    }
}
export default connect(mapStateToProps, mapDispatchProps)(Counter);