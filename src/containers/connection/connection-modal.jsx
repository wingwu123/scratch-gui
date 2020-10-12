import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ConnectionModalComponent, {PHASES} from '../../components/connection/connection-modal.jsx';
import VM from 'scratch-vm';

import {connect} from 'react-redux';
import {closeConnectionModal} from '../../reducers/modals';

class ConnectionModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleScanning',
            'handleCancel',
            'handleConnected',
            'handleConnecting',
            'handleDisconnect',
            'handleError',
            'handleHelp'
        ]);

        if(!!this.props.connModel){
            this.connModel = this.props.connModel;
        }
        else{
            this.connModel = this;
        }

        this.state = {
            phase: PHASES.scanning
        };
    }

    /**
     * ********************************************
     * connection model begin
     * ********************************************
     */
    addListener_peripheralConnected (listener){
        //this.props.vm.on('PERIPHERAL_CONNECTED', listener);
    }

    removeListener_peripheralConnected(listener){
        //this.props.vm.removeListener('PERIPHERAL_CONNECTED', listener);
    }

    addListener_peripheralRequestError (listener){
        //this.props.vm.on('PERIPHERAL_REQUEST_ERROR', listener);
    }

    removeListener_peripheralRequestError(listener){
        //this.props.vm.removeListener('PERIPHERAL_REQUEST_ERROR', listener);
    }

    connectPeripheral (peripheralId){
        //this.props.vm.connectPeripheral(this.props.extensionId, peripheralId);
    }

    disconnectPeripheral(){
        //this.props.vm.disconnectPeripheral(this.props.extensionId);
    }

    getPeripheralIsConnected() {
        return false; //.props.vm.getPeripheralIsConnected(this.props.extensionId);
    }

    scanForPeripheral() {
        //this.props.vm.scanForPeripheral(this.props.extensionId);
    }

    addListener_peripheralListUpdate (listener){
        //this.props.vm.on('PERIPHERAL_LIST_UPDATE', listener);
    }

    removeListener_peripheralListUpdate(listener){
        //this.props.vm.removeListener('PERIPHERAL_LIST_UPDATE', listener);
    }

    addListener_peripheralScanTimeout (listener){
        //this.props.vm.on('PERIPHERAL_SCAN_TIMEOUT', listener);
    }

    removeListener_peripheralScanTimeout (listener){
        //this.props.vm.removeListener('PERIPHERAL_SCAN_TIMEOUT', listener);
    }

    /**
     * ********************************************
     * connection model end
     * ********************************************
     */

    componentDidMount () {
        //this.props.vm.on('PERIPHERAL_CONNECTED', this.handleConnected);
        //this.props.vm.on('PERIPHERAL_REQUEST_ERROR', this.handleError);

        this.connModel.addListener_peripheralConnected(this.handleConnected);
        this.connModel.addListener_peripheralRequestError(this.handleError);
    }
    componentWillUnmount () {
        //this.props.vm.removeListener('PERIPHERAL_CONNECTED', this.handleConnected);
        //this.props.vm.removeListener('PERIPHERAL_REQUEST_ERROR', this.handleError);

        this.connModel.removeListener_peripheralConnected(this.handleConnected);
        this.connModel.removeListener_peripheralRequestError(this.handleError);
    }
    handleScanning () {
        this.setState({
            phase: PHASES.scanning
        });
    }
    handleConnecting (peripheralId) {
        //this.props.vm.connectPeripheral(this.props.extensionId, peripheralId);
        this.connModel.connectPeripheral(peripheralId);
        this.setState({
            phase: PHASES.connecting
        });

    }
    handleDisconnect () {
        try {
            //this.props.vm.disconnectPeripheral(this.props.extensionId);
            this.connModel.disconnectPeripheral();
        } finally {
            this.props.onCancel();
        }
    }
    handleCancel () {
        try {
            // If we're not connected to a peripheral, close the websocket so we stop scanning.
            /*
            if (!this.props.vm.getPeripheralIsConnected(this.props.extensionId)) {
                this.props.vm.disconnectPeripheral(this.props.extensionId);
            }
            */
           if (!this.connModel.getPeripheralIsConnected()) {
                this.connModel.disconnectPeripheral();
            }
        } finally {
            // Close the modal.
            this.props.onCancel();
        }
    }
    handleError (phase = null) {
        if(phase == PHASES.error || PHASES.unavailable)
        {
            this.setState({
                phase: phase
            });
            return;
        }
        // Assume errors that come in during scanning phase are the result of not
        // having scratch-link installed.
        if (this.state.phase === PHASES.scanning || this.state.phase === PHASES.unavailable) {
            this.setState({
                phase: PHASES.unavailable
            });
        } else {
            this.setState({
                phase: PHASES.error
            });
        }
    }
    handleConnected () {

        this.setState({
            phase: PHASES.connected
        });
    }
    handleHelp () {
        //window.open(this.state.extension.helpLink, '_blank');

        console.log("handleHelp");

    }
    render () {
        return (
            <ConnectionModalComponent
                {...this.props}
                phase={this.state.phase}
                connModel={this.connModel}
                onCancel={this.handleCancel}
                onConnected={this.handleConnected}
                onConnecting={this.handleConnecting}
                onDisconnect={this.handleDisconnect}
                onHelp={this.handleHelp}
                onScanning={this.handleScanning}
                onError={this.handleError}
            />
        );
    }
}

ConnectionModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
};

ConnectionModal.defaultProps = {
    onCancel: () => {

        console.log("ConnectionModal onCancel  ");
    }
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectionModal);
