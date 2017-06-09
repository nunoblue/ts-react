import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends Component {

    static propTypes = {
        onLogout: PropTypes.func,
    }

    static defaultProps = {
        onLogout: () => {
            console.error('logout function not defined');
        },
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
                            <i className="icon-menu" />
                        </a>
                        <a className="sidedrawer-toggle mui--hidden-xs mui--hidden-sm js-hide-sidedrawer">
                            <i className="icon-menu" />
                        </a>
                        <span className="mui--text-title mui--hidden-xs-inline-block">ThingStar</span>
                        <span className="mui--pull-right">
                            {logoutButton}
                        </span>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
