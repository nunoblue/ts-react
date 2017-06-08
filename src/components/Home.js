import React, { Component } from 'react';

class Home extends Component {

    componentDidMount() {
        console.log('Home Render');
    }

    render() {
        return (
            <div className="mui-container-fluid">
                Home!!
            </div>
        );
    }
}

export default Home;
