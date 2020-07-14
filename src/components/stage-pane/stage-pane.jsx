import PropTypes from 'prop-types';
import React from 'react';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';

import SpriteLibrary from '../../containers/sprite-library.jsx';
import StageSelector from '../../containers/stage-selector.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants';

import styles from './stage-pane.css';

/*
 * Pane that contains the sprite selector, sprite info, stage selector,
 * and the new sprite, costume and backdrop buttons
 * @param {object} props Props for the component
 * @returns {React.Component} rendered component
 */
const StagePane = ({
    editingTarget,
	hoveredTarget,
    spriteLibraryVisible,
    onActivateBlocksTab,
    onRequestCloseSpriteLibrary,
    onSelectSprite,
	raiseSprites,
    stage,
    vm,
    ...componentProps
}) => (

	<Box
            className={styles.spriteSelector}
            {...componentProps}
        >
		<div className={styles.stageSelectorWrapper}>
            {stage.id && <StageSelector
                asset={
                    stage.costume &&
                    stage.costume.asset
                }
                backdropCount={stage.costumeCount}
                id={stage.id}
                selected={stage.id === editingTarget}
                onSelect={onSelectSprite}
            />}
            <div>
                {spriteLibraryVisible ? (
                    <SpriteLibrary
                        vm={vm}
                        onActivateBlocksTab={onActivateBlocksTab}
                        onRequestClose={onRequestCloseSpriteLibrary}
                    />
                ) : null}
            </div>
        </div>
		
	</Box>	
);

const spriteShape = PropTypes.shape({
    costume: PropTypes.shape({
        url: PropTypes.string,
        name: PropTypes.string.isRequired,
        // The following are optional because costumes uploaded from disk
        // will not have these properties available
        bitmapResolution: PropTypes.number,
        rotationCenterX: PropTypes.number,
        rotationCenterY: PropTypes.number
    }),
    direction: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    order: PropTypes.number,
    size: PropTypes.number,
    visibility: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number
});

StagePane.propTypes = {
    editingTarget: PropTypes.string,
	hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool
    }),
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestCloseSpriteLibrary: PropTypes.func,
    onSelectSprite: PropTypes.func,
    spriteLibraryVisible: PropTypes.bool,
	raiseSprites: PropTypes.bool,
    stage: spriteShape,
    vm: PropTypes.instanceOf(VM)
};

export default StagePane;
