import bindAll from 'lodash.bindall';
import lodash from 'lodash.defaultsdeep'
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import compiler from '../lib/compiler'

import ModalComponent from '../components/download-modal/download-modal.jsx';

import ScratchBlocks from 'scratch-blocks';

import {
    BLOCK_EDITOR,
    CODE_EDITOR
} from '../reducers/editor-type';


import {
    closeDownloadModal
} from '../reducers/modals';

class DownloadModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAccess',
            'handleBack',
            'handleCancel',
            'handleCapture',
            'handleLoaded',
            'handleSubmit',
            'setCanvas',
            'handleBuild',
            'generateCode',
            'handleSaveCode',
            'handleCompile',
            'handleUpload',
            'addMessage'
        ]);

        this.video = null;
        this.videoDevice = null;

        this.state = {
            capture: null,
            access: false,
            progressValue: 0,
            progressStatus: 'active',
            lines: [],
            loaded: false
        };

        if (this.props.compiler) {
            this.compiler = this.props.compiler;
        }
        else {
            this.compiler = compiler;
        }

        this.isCanceled = false;

        setTimeout(this.handleBuild, 500);
    }

    setProgress(value, status = 'active'){
        this.setState({progressValue:value, progressStatus:status});
    }

    addMessage (line){

        let lines = [].concat(this.state.lines);

        lines.push(line);

        this.setState({lines:lines});
    }

    componentWillUnmount () {
        if (this.videoDevice) {
            this.videoDevice.disableVideo();
        }
    }
    handleAccess () {
        this.setState({access: true});
    }
    handleLoaded () {
        this.setState({loaded: true});
    }
    handleBack () {
        this.setState({capture: null});
        this.videoDevice.clearSnapshot();
    }
    handleCapture () {
        if (this.state.loaded) {
            const capture = this.videoDevice.takeSnapshot();
            this.setState({capture: capture});
        }
    }
    setCanvas (canvas) {
        this.canvas = canvas;
    }
    handleSubmit () {
        if (!this.state.capture) return;
        this.props.onNewCostume(this.state.capture);
        this.props.onClose();
    }
    handleCancel () {
        this.isCanceled = true;
        this.props.onClose();
    }

    generateCode (next) {
        if(this.isCanceled){
            return;
        }

        this.setProgress(40);

        if(this.props.editor == BLOCK_EDITOR){

            let p = new Promise((resolve, reject) => {
                this.addMessage('开始生成代码...');
                var workspace = ScratchBlocks.getMainWorkspace();
                var generator = ScratchBlocks.Clang;
                var code = generator.workspaceToCode(workspace);
                resolve(code);
            });
            p.then(next);
        }
        else{

            let p = new Promise((resolve, reject) => {
                this.addMessage('开始生成代码...');

                resolve(this.props.code);
            });
            p.then(next);
        }

    }

    handleConnect(next) {
        if(this.isCanceled){
            return;
        }

        this.addMessage('开始连接控制器...');
        this.setProgress(20);
        this.compiler.connect().then(next, error => {
            //连接board 失败，请插入board
            this.addMessage('连接board 失败，请插入board ' + error);
            this.setProgress(100, 'error');
        });
    }

    handleSaveCode(code, next) {
        if(this.isCanceled){
            return;
        }

        this.addMessage('保存代码文件...');
        this.setProgress(60);

        this.compiler.saveCode(code).then(next, error => {
            //保存代码文件失败
            this.addMessage('保存代码文件失败 ' + error);
            this.setProgress(100, 'error');
        });
    }

    handleCompile(next) {
        if(this.isCanceled){
            return;
        }

        this.addMessage('开始编译代码...');

        this.setProgress(80);

        this.compiler.compile().then(next, error => {
            //编译失败
            this.addMessage('编译失败 ' + error);
            this.setProgress(100, 'error');
        });
    }

    handleUpload(next) {
        if(this.isCanceled){
            return;
        }

        this.addMessage('开始下载程序...');
        this.setProgress(90);

        return this.compiler.upload().then(next, error => {
            //下载失败
            this.addMessage('下载失败 ' + err);
            this.setProgress(100, 'error');
        });
    }

    handleBuild() {

        this.handleConnect(() => {
            this.generateCode((code) => {
                this.handleSaveCode(code, () => {
                    this.handleCompile(() => {
                        this.handleUpload(() => {
                            this.addMessage('下载完成！');
                            this.setProgress(100, 'success');
                        });
                    });
                });
            });
        });
    }

    render () {
        return (
            <ModalComponent
                progressValue={this.state.progressValue}
                progressStatus={this.state.progressStatus}
                lines={this.state.lines}
                access={this.state.access}
                canvasRef={this.setCanvas}
                capture={this.state.capture}
                loaded={this.state.loaded}
                onBack={this.handleBack}
                onCancel={this.handleCancel}
                onCapture={this.handleCapture}
                onSubmit={this.handleSubmit}
            >

            </ModalComponent>
        );
    }
}

DownloadModal.propTypes = {
    onClose: PropTypes.func,
    onNewCostume: PropTypes.func
};

const mapStateToProps = (state) => ({
    editor: state.scratchGui.editorType.editor,
    code: state.scratchGui.editorType.code,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeDownloadModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DownloadModal);
