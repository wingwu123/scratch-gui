import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import ReactDOM from 'react-dom'
import bindAll from 'lodash.bindall';

import DockComponent from '../components/Dock/Dock.jsx'

import ScratchBlocks from 'scratch-blocks';

import MonacoEditor from "react-monaco-editor";


class Dock extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            'showDock',
            'hideDock',
            'handleDockClose',
            'handleRefreshCode',
            'setParentSize'
        ]);

        
        this.state = {
            dockReszieing: false,
            dockSize: 300,
            dockVisible: true,
            parentSize: { width: 100, height: 100 },
            codecpp: '',
            theme: "vs-light",
        };

        this.oldDockSize = 300;

    }

    componentDidMount() {

        this.props.vm.on('PROJECT_CHANGED', this.handleRefreshCode);
        this.hideDock();
    }

    componentWillUnmount() {

        this.props.vm.removeListener('PROJECT_CHANGED', this.handleRefreshCode);
    }

    setParentSize(size) {
        this.setState({ parentSize: size });
    }

    showDock() {

        this.oldDockSize = 300;

        this.setState({
            dockSize: this.oldDockSize,
            dockVisible: true
        });
    }

    hideDock() {

        this.oldDockSize = this.state.dockSize;

        this.setState({
            dockSize: 0,
            dockVisible: false,
            dockReszieing: false
        });
    }

    handleDockClose() {

        if (this.state.dockVisible) {
            this.hideDock()
        }
        else {
            this.showDock();
        }
    }

    handleMouseMove(e) {

        if (!this.state.dockReszieing) {
            return;
        }

        e.preventDefault();

        let size = this.state.parentSize.width - e.clientX;

        if (size < 40) {
            this.hideDock();
        }
        else {
            this.setState({ dockSize: size });
            this.oldDockSize = this.state.dockSize;
        }

    }

    handleRefreshCode() {
        var workspace = ScratchBlocks.getMainWorkspace();
        var generator = ScratchBlocks.Clang;

        var code = generator.workspaceToCode(workspace);

        this.setState({
            codecpp: code
        });

    }

    render() {

        const {
            code,
            ...componentProps
        } = this.props;

        const options = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: true,
            cursorStyle: "line",
            automaticLayout: true,
            minimap:{enabled:false},
            scrollbar:{horizontal:'hidden', vertical:'hidden'}
          };

        return (

            <DockComponent
                isVisible={this.state.dockVisible}
                parentWidth={this.state.parentSize.width}
                parentHeight={this.state.parentSize.height}
                size={this.state.dockSize}
                isResizing={this.state.dockReszieing}
                resizingCallback={(val) => { this.setState({ dockReszieing: val }); }}
                handleDockClose={this.handleDockClose}
                {...componentProps}>

                

                {/*
                monaco  editor  ScrollbarVisibility

                horizontal
                vertical
                Hidden: = 2
                */}

                <MonacoEditor
                    width= {this.state.dockSize}

                    language="cpp"
                    value={this.state.codecpp}
                    options={options}
                    theme={this.state.theme}
                />

            </DockComponent>

        );
    }
}

export default Dock;