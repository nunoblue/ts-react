import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
                        <span className="mui--pull-right">
                            <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                                <i className="material-icons">share</i>
                            </button>
                            <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                                <i className="material-icons">assignment_return</i>
                            </button>
                            <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                                <i className="material-icons">security</i>
                            </button>
                            <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                                <i className="material-icons">delete</i>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
