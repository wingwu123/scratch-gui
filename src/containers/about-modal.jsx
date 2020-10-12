import bindAll from 'lodash.bindall';
import lodash from 'lodash.defaultsdeep'
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import compiler from '../lib/compiler'

import ModalComponent from '../components/about-modal/about-modal.jsx';

import ScratchBlocks from 'scratch-blocks';

import {
    BLOCK_EDITOR,
    CODE_EDITOR
} from '../reducers/editor-type';


import {
    closeAboutModal
} from '../reducers/modals';

class AboutModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCancel',
            'handleSubmit'
        ]);

    }

    setProgress(value) {

    }

    componentWillUnmount () {

    }

    handleSubmit () {
        this.props.onClose();
    }
    handleCancel () {
        this.isCanceled = true;
        this.props.onClose();
    }

    render () {

        let {onClose,
            ...componentProps} = this.props;

        return (
            <ModalComponent
                {...componentProps}
                onCancel={this.handleCancel}
                onSubmit={this.handleSubmit}
            >

            </ModalComponent>
        );
    }
}

    /*
    productName: 'WOBOT scratch',
    version: '1.0.1',
    ElectronVersion: '1.2.3',
    ChromeVersion: '4.5.6',
    */

AboutModal.propTypes = {
    onClose: PropTypes.func,
    productName: PropTypes.string,
    version: PropTypes.string,
    ElectronVersion: PropTypes.string,
    ChromeVersion: PropTypes.string,
    hasUpdate: PropTypes.bool,
    newVersion: PropTypes.string,
    inDownloading: PropTypes.bool,
    progressValue: PropTypes.number,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeAboutModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AboutModal);
