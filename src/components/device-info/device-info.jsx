import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';

import {injectIntl, intlShape, defineMessages, FormattedMessage} from 'react-intl';

import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import {isWideLocale} from '../../lib/locale-utils.js';

import styles from './device-info.css';

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    spritePlaceholder: {
        id: 'gui.SpriteInfo.spritePlaceholder',
        defaultMessage: 'Name',
        description: 'Placeholder text for sprite name'
    }
});

class DeviceInfo extends React.Component {

    render () {
        const {
            stageSize
        } = this.props;

        const sprite = (
            <FormattedMessage
                defaultMessage="Device"
                description="Device info label"
                id="gui.DeviceInfo.device"
            />
        );

        const labelAbove = isWideLocale(this.props.intl.locale);

        const spriteNameInput = (
            <BufferedInput
                className={classNames(
                    styles.spriteInput,
                    {
                        [styles.columnInput]: labelAbove
                    }
                )}
                disabled={this.props.disabled}
                readOnly={true}
                placeholder={this.props.intl.formatMessage(messages.spritePlaceholder)}
                tabIndex="0"
                type="text"
                value={this.props.disabled ? '' : this.props.name}
                onSubmit={this.props.onChangeName}
            />
        );

        return (
            <Box className={styles.deviceInfo}>
                <div className={classNames(styles.row, styles.rowPrimary)}>
                    <div className={styles.group}>
                        <Label
                            above={labelAbove}
                            text={sprite}
                        >
                            {spriteNameInput}
                        </Label>
                    </div>
                </div>
            </Box>
        );
    }
}

DeviceInfo.propTypes = {
    disabled: PropTypes.bool,
    intl: intlShape,
    name: PropTypes.string,
    onChangeName: PropTypes.func,
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    visible: PropTypes.bool
};

export default injectIntl(DeviceInfo);
