import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import GeneralTimeWindow from '../../components/general/GeneralTimeWindow';
import CommonButton from '../../components/common/CommonButton';

class Dashboard extends Component {

    render() {
        return (
            <GeneralTimeWindow>
                <CommonButton />
            </GeneralTimeWindow>
        );
    }
}

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
