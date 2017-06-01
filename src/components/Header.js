'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends Component {

    static propTypes = {
        onLogout: PropTypes.func
    }

    static defaultProps = {
        onLogout: () => { 
            console.error('logout function not defined');
        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        const logoutButton = (
            <a className="sidedrawer-toggle mui--visible-xs" onClick={this.props.onLogout}>
                <i className="material-icons">lock_open</i>
            </a>
        );
        
        return (
            <header id="header">
                <div className="mui-appbar mui--appbar-line-height">
                    <div className="mui-container-fluid">
                        <a className="sidedrawer-toggle mui--visible-xs-inline-block mui--visible-sm-inline-block js-show-sidedrawer">
                            <i className="icon-menu"></i>
                        </a>
                        <a className="sidedrawer-toggle mui--hidden-xs mui--hidden-sm js-hide-sidedrawer">
                            <i className="icon-menu"></i>
                        </a>
                        <span className="mui--text-title mui--hidden-xs-inline-block">ThingStar</span>
                        <span className="mui--pull-right">
                            {logoutButton}
                            <a className="sidedrawer-toggle mui--visible-xs">
                                <i className="icon-github"></i>
                            </a>
                            <a className="sidedrawer-toggle mui--visible-xs">
                                <i className="icon-facebook"></i>
                            </a>
                            <a className="sidedrawer-toggle mui--visible-xs">
                                <i className="icon-twitter"></i>
                            </a>
                        </span>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;