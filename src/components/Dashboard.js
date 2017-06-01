'use strict';

import React, { Component } from 'react';
import Card from './Card';
import Layout from '../containers/Layout';

class Dashboard extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="mui-container-fluid">
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet"><Card /></div>
                </div>
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--12-col col-centered">
                        <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                            <i className="material-icons">add</i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;