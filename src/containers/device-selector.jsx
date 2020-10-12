import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import SelectorComponent from '../components/device-selector/device-selector.jsx'

import {
    openDownloadModal,
    openArduinoConnModal
} from '../reducers/modals';

import {
    setConnectMode,
    CONNECT_MODE_DEWNLOAD,
    CONNECT_MODE_ONLINE} from '../reducers/device-connected';


class DeviceSelector extends React.Component {
    constructor(props) {
        super(props);


        bindAll(this, [
            'handleToggleButtonClicked',
        ]);
        
    }

    componentDidMount() {

    }

    handleToggleButtonClicked(checked) {

        this.props.setConnectMode(checked ? CONNECT_MODE_DEWNLOAD: CONNECT_MODE_ONLINE);
    }

    render() {

        const {
            selectedId,
            setConnectMode,
            ...componentProps
        } = this.props;

        //
        return (
            <SelectorComponent
                onToggleButtonClicked={this.handleToggleButtonClicked}
                selectedId={selectedId}
                {...componentProps}/>
        );
    }
}

DeviceSelector.propTypes = {
    onDownloadClick: PropTypes.func,
};

const mapStateToProps = (state) => ({
    connectMode: state.scratchGui.deviceConnected.mode
});

const mapDispatchToProps = dispatch => ({
    onDownloadClick: () => {
        dispatch(openDownloadModal());
    },
    onConnectingClick: () => {
        dispatch(openArduinoConnModal());
    },
    setConnectMode :(mode) =>{ 
        dispatch(setConnectMode(mode));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceSelector);

