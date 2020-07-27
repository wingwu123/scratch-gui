import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import DeviceInfo from '../device-info/device-info.jsx';
import DeviceList from './device-list.jsx';
import ActionMenu from '../action-menu/action-menu.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants';
import {isRtl} from 'scratch-l10n';

import styles from './device-selector.css';


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

        ...componentProps
    } = props;
    let selectedDevice = devices[selectedId];
    let spriteInfoDisabled = false;
    if (typeof selectedDevice === 'undefined') {
        selectedDevice = {};
        spriteInfoDisabled = true;
    }

    console.log("DeviceSelectorComponent devices.length", Object.keys(devices).length);

    return (
        <Box
            className={styles.spriteSelector}
            {...componentProps}
        >
		
            <DeviceInfo
                disabled={spriteInfoDisabled}
                name={selectedDevice.name}
                size={selectedDevice.size}
                visible={selectedDevice.visible}
                onChangeName={name => {}}
            />

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

export default injectIntl(DeviceSelectorComponent);
