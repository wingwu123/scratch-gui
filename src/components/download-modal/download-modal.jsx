import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import styles from './download-modal.css';
import cameraIcon from '../action-menu/icon--camera.svg';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

const messages = defineMessages({
    modalTitle: {
        defaultMessage: '下载程序',
        description: 'Title for prompt to take a picture (to add as a new costume).',
        id: 'gui.downloadModal.modalTitle'
    },
    close: {
        defaultMessage: '关闭',
        description: 'A button that allows the user to save the photo they took as a costume',
        id: 'gui.downloadModal.close'
    }
});

const CameraModal = ({ intl, ...props }) => (
    <Modal
        className={styles.modalContent}
        contentLabel={intl.formatMessage(messages.modalTitle)}
        onRequestClose={props.onCancel}
        id={'download'}
    >
        <Box className={styles.body}>
            {/* "active","success","error","default" status="default" */}
            <Progress className={styles.progressBar} percent={props.progressValue} status={props.progressStatus} />

            <Box className={styles.messageContent}>
            {
                props.lines.length > 0 ? 
                <div className={styles.messageBox}>
                {
                    props.lines.map((line, index) => <p className={styles.messageLine} key={index}> {line} </p>)
                }
                </div>
                :null
            }
            </Box>

            <Box className={styles.buttonRow}>
                <button
                    className={styles.okButton}
                    onClick={props.onCancel}
                > {intl.formatMessage(messages.close)}
                </button>
            </Box>

            { /* true ?
                <Box className={styles.buttonRow}>
                    <button
                        className={styles.retakeButton}
                        key="retake-button"
                        onClick={props.onBack}
                    >
                        <img
                            draggable={false}
                            src={null}
                        /> {intl.formatMessage(messages.retakePhoto)}
                    </button>
                    <button
                        className={styles.okButton}
                        onClick={props.onSubmit}
                    > {intl.formatMessage(messages.save)}
                    </button>
                </Box> :
                <Box className={styles.mainButtonRow}>
                    <button
                        className={styles.mainButton}
                        disabled={!props.loaded}
                        key="capture-button"
                        onClick={props.onCapture}
                    >
                        <img
                            className={styles.mainIcon}
                            draggable={false}
                            src={cameraIcon}
                        />
                    </button>
                </Box>
            */}
        </Box>
    </Modal>
);

CameraModal.propTypes = {
    access: PropTypes.bool,
    canvasRef: PropTypes.func.isRequired,
    capture: PropTypes.string,
    intl: intlShape.isRequired,
    loaded: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCapture: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default injectIntl(CameraModal);
