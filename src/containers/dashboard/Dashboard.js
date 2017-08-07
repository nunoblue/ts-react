import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import GeneralTimeWindow from '../../components/timewindow/GeneralTimeWindow';

class Dashboard extends Component {
    state = {
        timewindowVisible: false,
    }

    render() {
        return (
            <GeneralTimeWindow />
        );
    }
}

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
