import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';

class Card extends Component {
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        buttonTooltip: PropTypes.string,
    }

    static defaultProps = {
        title: '',
        description: '',
        buttonTooltip: '',
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
                            <Button content="dashboard.make-public" iconClassName="share" />
                            <Button content="Customer Select" iconClassName="assignment_return" />
                            <Button content="Credential Management" iconClassName="security" />
                            <Button content={this.props.buttonTooltip} iconClassName="delete" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
