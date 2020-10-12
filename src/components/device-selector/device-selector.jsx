import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import DeviceInfo from '../device-info/device-info.jsx';
import DeviceList from './device-list.jsx';
import ActionMenu from '../action-menu/action-menu.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants';
import {isRtl} from 'scratch-l10n';

import styles from './device-selector.css';

import DownloadModel from '../../containers/download-modal.jsx'


import {
    CONNECT_MODE_DEWNLOAD,
    CONNECT_MODE_ONLINE} from '../../reducers/device-connected';

const DeviceSelectorComponent = function (props) {
    const {
        editingTarget,
        hoveredTarget,
        intl,
        onDrop,
        onDeleteSprite,
        onDuplicateSprite,
        onExportSprite,
        onSelectSprite,
        raised,
        selectedId,
        devices,
        stageSize,
        onSurpriseSpriteClick,
        onSpriteUpload,
        onPaintSpriteClick,
        onFileUploadClick,
        onActivateBlocksTab,
        onChangeSpriteDirection,
        onChangeSpriteName,
        onChangeSpriteRotationStyle,
        onChangeSpriteSize,
        onChangeSpriteVisibility,
        onChangeSpriteX,
        onChangeSpriteY,
        fileInputRef,
        onDownloadClick,
        onDownloadModelClose,
        isDownloadVisible,
        compiler,
        onDisconnectClick,
        onConnectingClick,
        isDeviceConnected,
        connectMode,
        onToggleButtonClicked,

        ...componentProps
    } = props;
    let selectedDevice = devices[selectedId];
    let spriteInfoDisabled = false;
    if (typeof selectedDevice === 'undefined') {
        selectedDevice = {};
        spriteInfoDisabled = true;
    }

    let onlineMode = (connectMode == CONNECT_MODE_ONLINE);

    return (
        <Box
            className={styles.spriteSelector}
            direction={'column'}
            {...componentProps}
        >
            <DeviceInfo
                disabled={spriteInfoDisabled}
                name={selectedDevice.name}
                size={selectedDevice.size}
                visible={selectedDevice.visible}
                onChangeName={name => { }}
            />

            <Box className={styles.deviceBox}>
                <Box>
                    <DeviceList
                        editingTarget={editingTarget}
                        hoveredTarget={hoveredTarget}
                        items={Object.keys(devices).map(id => devices[id])}
                        raised={raised}
                        selectedId={selectedId}
                        onDeleteSprite={onDeleteSprite}
                        onDrop={onDrop}
                        onDuplicateSprite={onDuplicateSprite}
                        onExportSprite={onExportSprite}
                        onSelectSprite={onSelectSprite}
                    />
                </Box>
                <Box className={styles.buttonColumn}>

                    {
                        isDeviceConnected && !onlineMode ?
                        <button className={styles.downloadButton} onClick={onDownloadClick}>下载</button>
                        :null
                    }

                    {
                        isDeviceConnected ?
                        <button className={styles.downloadButton} onClick={onDisconnectClick}>断开</button>
                        :<button className={styles.downloadButton} onClick={onConnectingClick}>连接</button>
                    }
                    
                </Box>
            </Box>

            {
                isDownloadVisible ?
                    <DownloadModel compiler={compiler}></DownloadModel>
                    : null
            }

        </Box>
    );
};

DeviceSelectorComponent.propTypes = {
    editingTarget: PropTypes.string,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool
    }),
    intl: intlShape.isRequired,
    onDeleteSprite: PropTypes.func,
    onDrop: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onExportSprite: PropTypes.func,
    onSelectSprite: PropTypes.func,
    onDownloadClick: PropTypes.func,
    raised: PropTypes.bool,
    selectedId: PropTypes.string,
    devices: PropTypes.shape({
        id: PropTypes.shape({
            costume: PropTypes.shape({
                url: PropTypes.string,
                name: PropTypes.string.isRequired,
                bitmapResolution: PropTypes.number.isRequired,
                rotationCenterX: PropTypes.number.isRequired,
                rotationCenterY: PropTypes.number.isRequired
            }),
            name: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired
        })
    }),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceSelectorComponent);

