import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import ReactDOM from 'react-dom'
import bindAll from 'lodash.bindall';

import DockComponent from '../components/Dock/Dock.jsx'

import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/lua/lua';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

import ScratchBlocks from 'scratch-blocks';

//import "codemirror/addon/fold/foldgutter.css";
//import 'codemirror/addon/fold/foldgutter.js';
//import 'codemirror/theme/eclipse.css';
//import 'codemirror/mode/javascript/javascript.js'



// import {CodeMirror} from 'react-codemirror2';
// require('codemirror/mode/xml/xml');
// require('codemirror/mode/javascript/javascript');




/*
(function () {
	// create div to avoid needing a HtmlWebpackPlugin template
	const div = document.createElement('div');
	div.id = 'root';
	div.style = 'width:800px; height:600px; border:1px solid #ccc;z-index:100;position:absolute';

	document.body.appendChild(div);
})();
*/


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
            codecpp: code
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

        console.log("code", code);
    }

    render() {

        const {
            code,
            ...componentProps
        } = this.props;

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

                <div id={"code-editor"} style={{width:"100%",height:"100%"}} ref={(ref)=>{this.editorRef = ref;}} >
                    <CodeMirror
                        value={this.state.codecpp}
                        options={{
                            theme: 'monokai',
                            tabSize: 4,
                            mode: 'c',
                            styleActiveLine: false,
                            lineNumbers: true,
                            styleSelectedText: false,
                            autoRefresh: true,
                            indentWithTabs: true,
                            line: true,
                            foldGutter: true,
                            gutters: [
                                "CodeMirror-linenumbers",
                                "CodeMirror-foldgutter",
                                "CodeMirror-lint-markers"
                            ]
                        }}
                    />
                </div>
                
            </DockComponent>

        );
    }
}


export default Dock;