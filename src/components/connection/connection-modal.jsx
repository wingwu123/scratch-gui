import PropTypes from 'prop-types';
import React from 'react';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import ScanningStep from '../../containers/connection/scanning-step.jsx';
import AutoScanningStep from '../../containers/connection/auto-scanning-step.jsx';
import ConnectingStep from './connecting-step.jsx';
import ConnectedStep from './connected-step.jsx';
import ErrorStep from './error-step.jsx';
import UnavailableStep from './unavailable-step.jsx';

import styles from './connection-modal.css';

const PHASES = keyMirror({
    scanning: null,
    connecting: null,
    connected: null,
    error: null,
    unavailable: null
});

const ConnectionModalComponent = props => {

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={props.name}
            headerClassName={styles.header}
            headerImage={props.connectionSmallIconURL}
            id={props.modelId}
            onRequestClose={props.onCancel}
            shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
        >
            <Box className={styles.body}>
                {props.phase === PHASES.scanning && !props.useAutoScan && <ScanningStep {...props} />}
                {props.phase === PHASES.scanning && props.useAutoScan && <AutoScanningStep {...props} />}
                {props.phase === PHASES.connecting && <ConnectingStep {...props} />}
                {props.phase === PHASES.connected && <ConnectedStep {...props} />}
                {props.phase === PHASES.error && <ErrorStep {...props} />}
                {props.phase === PHASES.unavailable && <UnavailableStep {...props} />}
            </Box>
        </Modal>
    );

};

ConnectionModalComponent.propTypes = {
    connectingMessage: PropTypes.node.isRequired,
    connectionSmallIconURL: PropTypes.string,
    connectionTipIconURL: PropTypes.string,
    name: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func.isRequired,
    phase: PropTypes.oneOf(Object.keys(PHASES)).isRequired,
    title: PropTypes.string.isRequired,
    useAutoScan: PropTypes.bool.isRequired,
    modelId: PropTypes.string,
    shouldCloseOnOverlayClick:PropTypes.bool,
};

ConnectionModalComponent.defaultProps = {
    connectingMessage: 'Connecting',
    modelId: 'connectionModal',
    shouldCloseOnOverlayClick:true,
};

export {
    ConnectionModalComponent as default,
    PHASES
};
