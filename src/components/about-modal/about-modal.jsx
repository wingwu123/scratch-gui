import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import { connect } from 'react-redux';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import styles from './about-modal.css';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import logo from './ScratchDesktop.svg';

const messages = defineMessages({
    modalTitle: {
        defaultMessage: '关于',
        description: 'Title for prompt to take a picture (to add as a new costume).',
        id: 'gui.AboutModal.modalTitle'
    },
    close: {
        defaultMessage: '关闭',
        description: 'A button that allows the user to save the photo they took as a costume',
        id: 'gui.AboutModal.close'
    }
});

const AboutModal = ({ intl, ...props }) => (
    <Modal
        className={styles.modalContent}
        contentLabel={intl.formatMessage(messages.modalTitle)}
        onRequestClose={props.onCancel}
        id={'about-model'}
        shouldCloseOnOverlayClick={false}
    >
        <Box className={styles.body}>

            <div
                style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontWeight: 'bolder',
                    margin: 0,
                }}
            >
                <div>
                    <img className={styles.logoImg}
                        alt={`${props.productName} icon`}
                        src={props.logo}
                        />
                </div>
                <h2>{props.productName}</h2>
                <div>Version {props.version}</div>
                {props.hasUpdate ?
                (<div className={styles.newVersion} >
                    <span className={styles.newVersionText}> New Version {props.newVersion + (props.inDownloading ? " " + props.progressValue + '%' : "")}  </span> 
                    {props.inDownloading ? null : (<button className={styles.downloadButton} onClick={props.onDownload} >下载</button>)
                    }
                    
                </div>)
                : null
                }
                
                <table style={{ fontSize: 'x-small' }}>
                    <tbody>
                        <tr key={'Electron'}><td>{'Electron'}</td><td>{props.ElectronVersion}</td></tr>
                        <tr key={'Chrome'}><td>{'Chrome'}</td><td>{props.ChromeVersion}</td></tr>
                    </tbody>
                </table>
            </div>
        </Box>
    </Modal>
);

AboutModal.propTypes = {
    ElectronVersion: PropTypes.string,
    ChromeVersion: PropTypes.string,
    intl: intlShape.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state

    logo: logo
});

const mapDispatchToProps = dispatch => ({

});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AboutModal));

