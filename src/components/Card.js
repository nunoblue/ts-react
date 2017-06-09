import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const assignmentReturnIcon = <FontIcon className="material-icons">assignment_return</FontIcon>;
const securityIcon = <FontIcon className="material-icons">security</FontIcon>;
const deleteIcon = <FontIcon className="material-icons">delete</FontIcon>;
const shareIcon = <FontIcon className="material-icons">share</FontIcon>;

class Card extends Component {
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
    }

    static defaultProps = {
        title: '',
        description: '',
    }

    state = {
        selectedIndex: 0,
    };

    select(index) {
        this.setState({
            selectedIndex: index,
        });
    }

    render() {
        return (
            <div className="mdl-cell mdl-cell--3-col mdl-cell--6-col-phone mdl-cell--4-col-tablet">
                <div className="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div className="mdl-card__title">
                        <h2 className="mdl-card__title-text">{this.props.title}</h2>
                    </div>
                    <div className="mdl-card__supporting-text">
                        {this.props.description}
                    </div>
                    <div className="mdl-card__actions mdl-card--border">
                        <BottomNavigation selectedIndex={this.state.selectedIndex}>
                            <BottomNavigationItem
                            label="Public"
                            icon={shareIcon}
                            onTouchTap={() => this.select(0)}
                            />
                            <BottomNavigationItem
                            label="Customer"
                            icon={assignmentReturnIcon}
                            onTouchTap={() => this.select(0)}
                            />
                            <BottomNavigationItem
                            label="Credential"
                            icon={securityIcon}
                            onTouchTap={() => this.select(1)}
                            />
                            <BottomNavigationItem
                            label="Delete"
                            icon={deleteIcon}
                            onTouchTap={() => this.select(2)}
                            />
                        </BottomNavigation>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
