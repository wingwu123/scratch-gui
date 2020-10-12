import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import lodash from 'lodash'
import ConnectionModal from './connection/connection-modal.jsx';
import {PHASES} from '../components/connection/connection-modal.jsx';
import VM from 'scratch-vm';
import analytics from '../lib/analytics';
import extensionData from '../lib/libraries/extensions/index.jsx';
import {connect} from 'react-redux';
import {closeArduinoConnModal} from '../reducers/modals';

import {
    connected,
    CONNECT_MODE_DEWNLOAD,
    CONNECT_MODE_ONLINE} from '../reducers/device-connected';
import USB_ICON from '../components/connection/icons/USB.svg';

class ArduinoConnModal extends React.Component {
    constructor (props) {
        super(props);

        bindAll(this, [
            'onCancel',
        ]);


        this.peripheralConnected_listener = [];

        this.peripheralRequestError_listener = [];

        this.peripheralListUpdate_listener = [];

        this.peripheralScanTimeout_listener = [];

        this.props.port.disconnect();
    }

    /**
     * ********************************************
     * connection model begin
     * ********************************************
     */
    addListener_peripheralConnected (listener) {
        if(!_.some(this.peripheralConnected_listener,(item) => item === listener) )
        {
            this.peripheralConnected_listener.push(listener)
        }
    }

    removeListener_peripheralConnected(listener){
        _.remove(this.peripheralConnected_listener
            , value => value === listener);

    }

    emitListener_peripheralConnected() {
        for (let index = 0; index < this.peripheralConnected_listener.length; index++) {
            const listener = this.peripheralConnected_listener[index];
            listener();
        }
    }

    addListener_peripheralRequestError (listener){

        if(!_.some(this.peripheralRequestError_listener,(item) => item === listener) )
        {
            this.peripheralRequestError_listener.push(listener)
        }
    }

    removeListener_peripheralRequestError(listener){
        _.remove(this.peripheralRequestError_listener
            , value => value === listener);
    }

    emitListener_peripheralRequestError(phase) {
        for (let index = 0; index < this.peripheralRequestError_listener.length; index++) {
            const listener = this.peripheralRequestError_listener[index];
            listener(phase);
        }
    }

    connectPeripheral (peripheralId) {
        
        this.props.compiler.port = peripheralId;

        if(this.props.connectMode == CONNECT_MODE_ONLINE)
        {
            this.props.port.connect(this.props.compiler.port).then((err)=>{
                if(!!err)
                {
                    console.info(" serialport connect error ", err);
                }
            });
        }
        
        setTimeout(() =>{
            this.emitListener_peripheralConnected();
        }, 200);
    }

    disconnectPeripheral(){

        this.props.compiler.port = null;
    }

    getPeripheralIsConnected() {
        return !!this.props.compiler.port;
    }

    scanForPeripheral() {

        this.props.compiler.connect()
        .then(ports => {

            let periphList = ports.map(info => { return {peripheralId:info.path, name:info.path, rssi:100}; });

            this.emitListener_peripheralListUpdate(periphList);
        })
        .catch(err => {

            console.log("scanForPeripheral error ", err);

            this.emitListener_peripheralScanTimeout();
        });

        /*

        this.props.compiler.connect().then(connInfo => {

            console.log("", connInfo);

            let periphList = connInfo.map(info => { return {peripheralId:info, name:info, rssi:100}; });

            this.emitListener_peripheralListUpdate(periphList);

        }, error => {
            //连接board 失败，请插入board
            //this.addMessage('连接board 失败，请插入board ' + error);
            //this.setProgress(100, 'error');

            this.emitListener_peripheralScanTimeout();
        });
        */
    }

    addListener_peripheralListUpdate (listener){

        if(!_.some(this.peripheralListUpdate_listener,(item) => item === listener) ) {
            this.peripheralListUpdate_listener.push(listener)
        }

    }

    removeListener_peripheralListUpdate(listener){

        _.remove(this.peripheralListUpdate_listener
            , value => value === listener);
    }

    /**
     * 
     * @param {*} periphList [{peripheralId:'', name:'', rssi:100}]
     */
    emitListener_peripheralListUpdate(periphList) {

        for (let index = 0; index < this.peripheralListUpdate_listener.length; index++) {
            const listener = this.peripheralListUpdate_listener[index];

            listener(periphList);
        }
    }

    addListener_peripheralScanTimeout (listener) {
        if(!_.some(this.peripheralScanTimeout_listener,(item) => item === listener) ) {
            this.peripheralScanTimeout_listener.push(listener)
        }
        
    }

    removeListener_peripheralScanTimeout (listener) {

        _.remove(this.peripheralScanTimeout_listener
            , value => value === listener);
    }

    emitListener_peripheralScanTimeout(periphList) {
        for (let index = 0; index < this.peripheralScanTimeout_listener.length; index++) {
            const listener = this.peripheralScanTimeout_listener[index];
            listener(periphList);
        }
    }

    /**
     * ********************************************
     * connection model end
     * ********************************************
     */

    onCancel() {

        this.props.closeArduinoConnModal();

        if(!!this.props.compiler.port)
        {
            this.props.connected();
        }
    }

    onError () {
        this.emitListener_peripheralRequestError(PHASES.error);
    }

    render () {

        return (
            <ConnectionModal
                modelId={"arduinoConnModel"}
                connModel={this}
                connectingMessage={"正在连接..."}
                connectionTipIconURL={"connectionTipIconURL"}
                name={"连接"}
                title={"title"}
                useAutoScan={false} 
                onCancel={this.onCancel}
                rssiVisible={false}
                shouldCloseOnOverlayClick={false}
                periphIcon={USB_ICON}
            />
        );
    }

}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    closeArduinoConnModal: () => {

        dispatch(closeArduinoConnModal());
    },
    connected: () => {

        dispatch(connected());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArduinoConnModal);
