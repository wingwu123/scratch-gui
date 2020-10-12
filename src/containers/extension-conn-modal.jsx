import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ConnectionModal from './connection/connection-modal.jsx';
import VM from 'scratch-vm';
import analytics from '../lib/analytics';
import extensionData from '../lib/libraries/extensions/index.jsx';
import {connect} from 'react-redux';
import {closeConnectionModal} from '../reducers/modals';

class ExtensionConnModal extends ConnectionModal {
    constructor (props) {
        super(props);

        this.connectingMessage = 'connectingMessage';
        this.connectionIconURL = 'connectionIconURL';
        this.connectionSmallIconURL = 'connectionSmallIconURL';
        this.connectionTipIconURL = 'connectionTipIconURL';
        this.name = 'name';
        this.phase = PHASES.scanning;
        this.title = 'title';
        this.useAutoScan = true;

        this.state = {
            extension: extensionData.find(ext => ext.extensionId === props.extensionId),
            phase: props.vm.getPeripheralIsConnected(props.extensionId) ?
                PHASES.connected : PHASES.scanning
        };
    }

    /**
     * ********************************************
     * connection model begin
     * ********************************************
     */
    addListener_peripheralConnected (listener){
        this.props.vm.on('PERIPHERAL_CONNECTED', listener);
    }

    removeListener_peripheralConnected(listener){
        this.props.vm.removeListener('PERIPHERAL_CONNECTED', listener);
    }

    addListener_peripheralRequestError (listener){
        this.props.vm.on('PERIPHERAL_REQUEST_ERROR', listener);
    }

    removeListener_peripheralRequestError(listener){
        this.props.vm.removeListener('PERIPHERAL_REQUEST_ERROR', listener);
    }

    connectPeripheral (peripheralId){
        this.props.vm.connectPeripheral(this.props.extensionId, peripheralId);
    }

    disconnectPeripheral(){
        this.props.vm.disconnectPeripheral(this.props.extensionId);
    }

    getPeripheralIsConnected() {
        return this.props.vm.getPeripheralIsConnected(this.props.extensionId);
    }

    scanForPeripheral() {
        this.props.vm.scanForPeripheral(this.props.extensionId);
    }

    addListener_peripheralListUpdate (listener){
        this.props.vm.on('PERIPHERAL_LIST_UPDATE', listener);
    }

    removeListener_peripheralListUpdate(listener){
        this.props.vm.removeListener('PERIPHERAL_LIST_UPDATE', listener);
    }

    addListener_peripheralScanTimeout (listener){
        this.props.vm.on('PERIPHERAL_SCAN_TIMEOUT', listener);
    }

    removeListener_peripheralScanTimeout (listener){
        this.props.vm.removeListener('PERIPHERAL_SCAN_TIMEOUT', listener);
    }

    /**
     * ********************************************
     * connection model end
     * ********************************************
     */

}

ExtensionConnModal.propTypes = {
    extensionId: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    extensionId: state.scratchGui.connectionModal.extensionId
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => {
        dispatch(closeConnectionModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExtensionConnModal);
