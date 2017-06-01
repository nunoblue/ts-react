'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

class Card extends Component {
    static propTypes = {
    }

    static defaultProps = {
    }

    state = {
        selectedIndex: 0
    };

    constructor(props) {
        super(props);
        
    }

    select(index) {
        this.setState({
            selectedIndex: index
        })
    }

    render() {
        return (
            <div className="demo-card-wide mdl-card mdl-shadow--2dp">
                <div className="mdl-card__title">
                    <Avatar className="mdl-card-avatar" src="/images/sgoh.jpg" />
                    <h2 className="mdl-card__title-text">Welcome</h2>
                </div>
                <div className="mdl-card__media">
                    <img src="/images/wood.jpg" style={{width: "100%"}}/>
                </div>
                <div className="mdl-card__supporting-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris sagittis pellentesque lacus eleifend lacinia...
                </div>
                <div className="mdl-card__actions mdl-card--border">
                    <BottomNavigation selectedIndex={this.state.selectedIndex}>
                        <BottomNavigationItem
                            label="Recents"
                            icon={recentsIcon}
                            onTouchTap={() => this.select(0)}
                        />
                        <BottomNavigationItem
                            label="Favorites"
                            icon={favoritesIcon}
                            onTouchTap={() => this.select(1)}
                        />
                        <BottomNavigationItem
                            label="Nearby"
                            icon={nearbyIcon}
                            onTouchTap={() => this.select(2)}
                        />
                    </BottomNavigation>
                </div>
                <div className="mdl-card__menu">
                    <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                        <i className="material-icons">share</i>
                    </button>
                </div>
            </div>
        );
    }
}

export default Card;