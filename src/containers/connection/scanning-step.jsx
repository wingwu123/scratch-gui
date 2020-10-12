import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ScanningStepComponent from '../../components/connection/scanning-step.jsx';

class ScanningStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handlePeripheralListUpdate',
            'handlePeripheralScanTimeout',
            'handleRefresh'
        ]);
        this.state = {
            scanning: true,
            message: null,
            peripheralList: []
        };
        this.reconnectCount = 0;
        this.timeout = null;
    }
    componentDidMount () {
        this.reconnectCount = 0;
        this.timeout = null;

        console.info("ScanningStep componentDidMount ", this.reconnectCount);

        /*
        this.props.vm.scanForPeripheral(this.props.extensionId);
        this.props.vm.on(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.on(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
        */
        this.props.connModel.scanForPeripheral();
        this.props.connModel.addListener_peripheralListUpdate(this.handlePeripheralListUpdate);
        this.props.connModel.addListener_peripheralScanTimeout(this.handlePeripheralScanTimeout);
    }
    componentWillUnmount () {
        // @todo: stop the peripheral scan here
        /*
        this.props.vm.removeListener(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.removeListener(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
        */
        this.props.connModel.removeListener_peripheralListUpdate(this.handlePeripheralListUpdate);
        this.props.connModel.removeListener_peripheralScanTimeout(this.handlePeripheralScanTimeout);

        this.reconnectCount = 0;
        if(this.timeout != null)
        {
            clearTimeout(this.timeout);
        }
    }
    handlePeripheralScanTimeout () {
        this.setState({
            scanning: false,
            peripheralList: []
        });
    }

    handlePeripheralListUpdate(newList) {
        if (!!newList == null || newList.length > 0) {
            // TODO: sort peripherals by signal strength? so they don't jump around
            const peripheralArray = Object.keys(newList).map(id =>
                newList[id]
            );
            this.setState({ peripheralList: peripheralArray });
        }
        else {

            this.setState({ message: '未找到硬件设备' });

            if(this.reconnectCount > 30)
            {
                this.props.connModel.onError();
            }
            else {
                this.reconnectCount++;

                this.timeout = setTimeout(() =>{
                    console.info("handlePeripheralListUpdate scanForPeripheral ", this.reconnectCount);
                    this.props.connModel.scanForPeripheral();
                }, 1000);
            }
        }
    }

    handleRefresh (message = null) {
        //this.props.vm.scanForPeripheral(this.props.extensionId);
        this.props.connModel.scanForPeripheral();
        this.setState({
            scanning: true,
            peripheralList: []
        });
    }
    render () {
        return (
            <ScanningStepComponent
                connectionSmallIconURL={this.props.connectionSmallIconURL}
                peripheralList={this.state.peripheralList}
                phase={this.state.phase}
                scanning={this.state.scanning}
                message={this.state.message}
                title={this.props.extensionId}
                rssiVisible={this.props.rssiVisible}
                onConnected={this.props.onConnected}
                onConnecting={this.props.onConnecting}
                onRefresh={this.handleRefresh}
            />
        );
    }
}

ScanningStep.propTypes = {
    connectionSmallIconURL: PropTypes.string,
    extensionId: PropTypes.string.isRequired,
    onConnected: PropTypes.func.isRequired,
    onConnecting: PropTypes.func.isRequired
};

export default ScanningStep;
