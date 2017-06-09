import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Button extends Component {
    static propTypes = {
        content: PropTypes.string,
    }

    static defaultProps = {
        content: '',
    }

    render() {
        return (
            <div className="footer-buttons">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
                    <i id="add" className="material-icons">add</i>
                </button>
                <div className="mdl-tooltip" data-mdl-for="add">
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Button;
