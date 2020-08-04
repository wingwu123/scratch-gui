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
            'handleRefreshCode'
        ]);

        
        let code = [
            '#include <iostream>',
            'using namespace std;',
            'int main(int argc, char* argv[])',
            '{',
            '    cout << \"Hello, world! 1 \" << endl;',
            '    cout << \"Hello, world! 2 \" << endl;',
            '    cout << \"Hello, world! 3 \" << endl;',
            '    cout << \"Hello, world! 4 \" << endl;',
            '    cout << \"Hello, world! 5 \" << endl;',
            '    cout << \"Hello, world! 6 \" << endl;',
            '    cout << \"Hello, world! 7 \" << endl;',
            '    cout << \"Hello, world! 8 \" << endl;',
            '    cout << \"Hello, world! 9 \" << endl;',
            '    cout << \"Hello, world! 10 \" << endl;',
            '    return 0;',
            '}'
        ].join('\n');

        this.state = {
            dockReszieing: false,
            dockSize: 300,
            dockVisible: true,
            parentSize: { width: 100, height: 100 },
            codecpp: code,
            theme: "vs-light",
        };

        this.oldDockSize = 300;

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    setParentSize(size) {
        this.setState({ parentSize: size });
    }

    showDock() {

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

            console.log(" hideDock this.oldDockSize " + this.oldDockSize)
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

                <button onClick={this.handleRefreshCode} >Refresh code</button>
                <div id={"code-editor"} style={{ width: "100%", height: "100%" }} ref={(ref) => { this.editorRef = ref; }} >
                    <MonacoEditor
                        width="100%"
                        height="100%"
                        language="cpp"
                        value={this.state.codecpp}
                        options={options}
                        theme={this.state.theme}
                    />
                </div>
            </DockComponent>

        );
    }
}


export default Dock;