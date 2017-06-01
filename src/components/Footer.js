'use strict';

import React, { Component } from 'react';

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer id="footer">
                <div className="mui-container-fluid">
                    <br />
                    Made with by <a href="https://github.com/salgum1114/sgoh-blog" target="_blank">sgoh</a>
                </div>
            </footer>
        );
    }
}

export default Footer;