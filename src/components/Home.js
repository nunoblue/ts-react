import React, { Component } from 'react';

class Home extends Component {

    componentDidMount() {
        console.log('Home Render');
    }

    render() {
        return (
            <div className="mdl-grid">
                Home!!
            </div>
        );
    }
}

export default Home;
