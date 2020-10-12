import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom'
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Dock from '../../containers/dock.jsx';
import bindAll from 'lodash.bindall';
import DomSize from '../../lib/domsize.js';
import {withSize} from 'react-sizeme';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import DevicePane from '../../containers/device-pane.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import StagePane from '../../containers/stage-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import Watermark from '../../containers/watermark.jsx';

import Backpack from '../../containers/backpack.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';
import ConnModel from '../../containers/arduino-conn-modal.jsx';
import AboutModel from '../../containers/about-modal.jsx';

import layout, { STAGE_SIZE_MODES } from '../../lib/layout-constants';
import { resolveStageSize } from '../../lib/screen-utils';

import styles from './gui.css';
import targetStyles from './target-tab-styles.css';
import addExtensionIcon from './icon--extensions.svg';
import blockIcon from './icon--block.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';

import MonacoEditor from "react-monaco-editor";

import {
    editorTypeSelect,
    codeChanged,
    BLOCK_EDITOR,
    CODE_EDITOR
} from '../../reducers/editor-type';

import {
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX,
    CCODE_TAB_INDEX
} from '../../reducers/editor-tab';

import ServiceHOC from '../../containers/service-hoc.jsx';

import ServiceInstance from '../../broker/ServiceInstance.js';

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

class GUIComponent extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            'handleResize'
            ,'handleMouseMove'
            ,'handleCodeChanged'
            ,'onProjectLoaded'
            ,'handleLogoClicked'
            ,'handleDownloadClicked'
        ]);

        let defaultCode = [
        '#include "whalesbot.h"',
        'void setup() {',
        '  board_init();',
        '}',
        '',
        'void _setup(){',
        '',
        '}',
        'void _loop(){',
        '',
        '}'].join('\n');

        this.handleCodeChanged(defaultCode);

        this.state = {
            productName: "WOBOT Scratch", 
            version: "1.0.0", 
            Electron: "8.2.5", 
            Chrome: "80.0.3987.165",
            hasUpdate: false,
            newVersion: "",
            inDownloading:false,
            downlaodProgress:0,
            webGlModalVisiable:true,
        };

        ServiceInstance.on(ServiceInstance.INITIALIZE_EVENT, () => {

            console.info("ServiceInstance initlized");

            ServiceInstance.updaterBroker.progress().subscribe(downlaodProgress => {

                this.setState({ inDownloading: true, downlaodProgress: downlaodProgress });

            });

            ServiceInstance.updaterBroker.hasUpdate().subscribe(newVersion => {

                this.setState({ hasUpdate: true, newVersion: newVersion });

            });

        });
        
    }

    handleCodeChanged(code) {

        if(this.props.vm.runtime.code != code)
        {
            this.props.vm.runtime.code = code;
        }
    }

    handleResize(event) {
        const size = {width:event.width, height:event.height};
        //console.log("handleResize " + JSON.stringify(size));

        if("dockRef" in this && this.dockRef != null)
        {
            this.dockRef.setParentSize(size);
        }
    }

    handleMouseMove(e) {

        if("dockRef" in this)
        {
            this.dockRef.handleMouseMove(e);
        }
    }

    handleLogoClicked() {

        this.setState({ inDownloading: false});

        ServiceInstance.updaterBroker.appInfo().then(info => {

            console.info("handleLogoClicked ", info);

            this.setState(info);

            this.props.onClickLogo();
        });
    }

    handleDownloadClicked() {
        ServiceInstance.updaterBroker.downloadUpdate().then(() =>{

        });
    }

    componentDidMount() {

        let element = ReactDOM.findDOMNode(this.element);
        DomSize.bind(element, this.handleResize);   

        this.props.vm.runtime.addListener('PROJECT_LOADED', this.onProjectLoaded);
    }

    componentWillUnmount () {
        this.props.vm.runtime.removeListener('PROJECT_LOADED', this.onProjectLoaded);

    }

    onProjectLoaded () {

    }

    render() {
        const {
            accountNavOpen,
            activeTabIndex,
            targetTabIndex,
            alertsVisible,
            authorId,
            authorThumbnailUrl,
            authorUsername,
            basePath,
            backdropLibraryVisible,
            backpackHost,
            backpackVisible,
            blocksTabVisible,
            cardsVisible,
            canChangeLanguage,
            canCreateNew,
            canEditTitle,
            canManageFiles,
            canRemix,
            canSave,
            canCreateCopy,
            canShare,
            canUseCloud,
            children,
            connectionModalVisible,
            arduinoConnModalVisible,
            aboutModalVisible,
            costumeLibraryVisible,
            costumesTabVisible,
            ccodeTabVisible,
            enableCommunity,
            intl,
            isCreating,
            isFullScreen,
            isPlayerOnly,
            isRtl,
            isShared,
            loading,
            logo,
            renderLogin,
            onClickAbout,
            onClickAccountNav,
            onCloseAccountNav,
            onLogOut,
            onOpenRegistration,
            onToggleLoginOpen,
            onActivateCostumesTab,
            onActivateSoundsTab,
            onActivateCCodeTab,
            onActivateTab,
            onClickLogo,
            onSaveConfirm,
            onExtensionButtonClick,
            onProjectTelemetryEvent,
            onRequestCloseBackdropLibrary,
            onRequestCloseCostumeLibrary,
            onRequestCloseTelemetryModal,
            onSeeCommunity,
            onShare,
            onShowPrivacyPolicy,
            onTelemetryModalCancel,
            onTelemetryModalOptIn,
            onTelemetryModalOptOut,
            onTargetTabActivate,
            showComingSoon,
            soundsTabVisible,
            stageSizeMode,
            stage,
            editingTarget,
            targetIsStage,
            telemetryModalVisible,
            tipsLibraryVisible,
            electron,
            vm,
            onEditorSelected,
            onCodeChanged,
            editor,
            isDevice,
            connectMode,

            ...componentProps
        } = omit(this.props, 'dispatch');
        if (children) {
            return <Box {...componentProps}>{children}</Box>;
        }

        const compiler = electron ? electron.compiler : null;
        const port = electron ? electron.port : null;

        const tabClassNames = {
            tabs: styles.tabs,
            tab: classNames(tabStyles.reactTabsTab, styles.tab),
            tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
            tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
            tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
            tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
        };

        const targetTabClassNames = {
            tab: classNames(tabStyles.reactTabsTab, targetStyles.tab),
            tabList: classNames(tabStyles.reactTabsTabList, targetStyles.tabList),
            tabSelected: classNames(targetStyles.tab, targetStyles.isSelected),
        };

        if (isRendererSupported === null) {
            isRendererSupported = Renderer.isSupported();
        }

        const codeEditorOptions = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            //readOnly: true,
            fontSize:16,
            cursorStyle: "line",
            automaticLayout: true,
            //minimap:{enabled:false},
            //scrollbar:{horizontal:2, vertical:2}
          };

        return (<MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
            const stageSize = resolveStageSize(stageSizeMode, isFullSize);

            return isPlayerOnly ? (
                <StageWrapper
                    isFullScreen={isFullScreen}
                    isRendererSupported={isRendererSupported}
                    isRtl={isRtl}
                    loading={loading}
                    stageSize={STAGE_SIZE_MODES.large}
                    vm={vm}
                >
                    {alertsVisible ? (
                        <Alerts className={styles.alertsContainer} />
                    ) : null}
                </StageWrapper>
            ) : (
                    <Box
                        className={styles.pageWrapper}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        {...componentProps}
                    > 
                    {/*
                        {telemetryModalVisible ? (
                            <TelemetryModal
                                onCancel={onTelemetryModalCancel}
                                onOptIn={onTelemetryModalOptIn}
                                onOptOut={onTelemetryModalOptOut}
                                onRequestClose={onRequestCloseTelemetryModal}
                                onShowPrivacyPolicy={onShowPrivacyPolicy}
                            />
                        ) : null}
                    */}
                        
                        {loading ? (
                            <Loader />
                        ) : null}
                        {isCreating ? (
                            <Loader messageId="gui.loader.creating" />
                        ) : null}
                        {!isRendererSupported && this.state.webGlModalVisiable ? (
                            <WebGlModal isRtl={isRtl} onCancel={() => { this.setState({webGlModalVisiable:false}); }} />
                        ) : null }
                        {tipsLibraryVisible ? (
                            <TipsLibrary />
                        ) : null}
                        {cardsVisible ? (
                            <Cards />
                        ) : null}
                        {alertsVisible ? (
                            <Alerts className={styles.alertsContainer} />
                        ) : null}
                        {connectionModalVisible ? (
                            <ConnectionModal
                                vm={vm}
                            />
                        ) : null}
                        {costumeLibraryVisible ? (
                            <CostumeLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseCostumeLibrary}
                            />
                        ) : null}

                        {aboutModalVisible ? 
                        (<AboutModel 
                            productName={this.state.productName} 
                            version={this.state.version} 
                            ElectronVersion={this.state.Electron}
                            ChromeVersion={this.state.Chrome}
                            hasUpdate={this.state.hasUpdate}
                            newVersion={this.state.newVersion}
                            inDownloading={this.state.inDownloading}
                            progressValue={this.state.downlaodProgress}
                            onDownload={this.handleDownloadClicked}
                            />) : null}

                        {arduinoConnModalVisible?(
                            <ConnModel compiler = { compiler} connectMode={connectMode} port={port} />
                        ):null}

                        {backdropLibraryVisible ? (
                            <BackdropLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseBackdropLibrary}
                            />
                        ) : null}

                        <MenuBar
                            accountNavOpen={accountNavOpen}
                            authorId={authorId}
                            authorThumbnailUrl={authorThumbnailUrl}
                            authorUsername={authorUsername}
                            canChangeLanguage={canChangeLanguage}
                            canCreateCopy={canCreateCopy}
                            canCreateNew={canCreateNew}
                            canEditTitle={canEditTitle}
                            canManageFiles={canManageFiles}
                            canRemix={canRemix}
                            canSave={canSave}
                            canShare={canShare}
                            className={styles.menuBarPosition}
                            enableCommunity={enableCommunity}
                            isShared={isShared}
                            logo={logo}
                            renderLogin={renderLogin}
                            showComingSoon={showComingSoon}
                            onClickAbout={onClickAbout}
                            onClickAccountNav={onClickAccountNav}
                            onClickLogo={this.handleLogoClicked}
                            onSaveConfirm={onSaveConfirm}
                            onCloseAccountNav={onCloseAccountNav}
                            onLogOut={onLogOut}
                            onOpenRegistration={onOpenRegistration}
                            onProjectTelemetryEvent={onProjectTelemetryEvent}
                            onSeeCommunity={onSeeCommunity}
                            onShare={onShare}
                            onToggleLoginOpen={onToggleLoginOpen}
                        />

                        <Box className={styles.bodyWrapper}>
                            <Box className={styles.flexWrapper}>
                                <Box className={styles.editorWrapper}>
                                    <Tabs
                                        forceRenderTabPanel
                                        className={tabClassNames.tabs}
                                        selectedIndex={activeTabIndex}
                                        selectedTabClassName={tabClassNames.tabSelected}
                                        selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                        onSelect={onActivateTab}
                                    >
                                        <TabList className={tabClassNames.tabList}>
                                            <Tab className={tabClassNames.tab}>
                                                <img
                                                    draggable={false}
                                                    src={blockIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Code"
                                                    description="Button to get to the code panel"
                                                    id="gui.gui.codeTab"
                                                />
                                            </Tab>
                                            {
                                                isDevice ? null :
                                                <Tab
                                                    className={tabClassNames.tab}
                                                    onClick={onActivateCostumesTab}
                                                >
                                                    <img
                                                        draggable={false}
                                                        src={costumesIcon}
                                                    />
                                                    {targetIsStage ? (
                                                        <FormattedMessage
                                                            defaultMessage="Backdrops"
                                                            description="Button to get to the backdrops panel"
                                                            id="gui.gui.backdropsTab"
                                                        />
                                                    ) : (
                                                            <FormattedMessage
                                                                defaultMessage="Costumes"
                                                                description="Button to get to the costumes panel"
                                                                id="gui.gui.costumesTab"
                                                            />
                                                        )}
                                                </Tab>
                                            }

                                            {
                                                isDevice ? null : 
                                                <Tab
                                                    className={tabClassNames.tab}
                                                    onClick={onActivateSoundsTab}
                                                >
                                                    <img
                                                        draggable={false}
                                                        src={soundsIcon}
                                                    />
                                                    <FormattedMessage
                                                        defaultMessage="Sounds"
                                                        description="Button to get to the sounds panel"
                                                        id="gui.gui.soundsTab"
                                                    />
                                                </Tab>
                                                    
                                            }
                                            {
                                                isDevice ? 
                                                 <Tab
                                                        className={tabClassNames.tab}
                                                        onClick={onActivateCCodeTab}
                                                    >
                                                        <img
                                                            draggable={false}
                                                            src={codeIcon}
                                                        />
                                                        <FormattedMessage
                                                            defaultMessage="C Code"
                                                            description="Button to get to the C code panel"
                                                            id="gui.gui.ccodeTab"
                                                        />
                                                    </Tab>
                                                    : null
                                            }

                                        </TabList>
                                        <TabPanel className={tabClassNames.tabPanel} ref={(ref) => {

                                            this.element = ref;
                                        }} onMouseMove={this.handleMouseMove} >
                                            <Box className={styles.blocksWrapper}>

                                                <Box className={classNames(styles.editorItemWrapper)}>
                                                    <Blocks
                                                        canUseCloud={canUseCloud}
                                                        grow={1}
                                                        isVisible={blocksTabVisible}
                                                        options={{
                                                            media: `${basePath}static/blocks-media/`
                                                        }}
                                                        stageSize={stageSize}
                                                        vm={vm}
                                                        connectMode={connectMode}
                                                    />
                                                    {isDevice ? null :
                                                        <Box className={styles.extensionButtonContainer}>
                                                            <button
                                                                className={styles.extensionButton}
                                                                title={intl.formatMessage(messages.addExtension)}
                                                                onClick={onExtensionButtonClick}
                                                            >
                                                                <img
                                                                    className={styles.extensionButtonIcon}
                                                                    draggable={false}
                                                                    src={addExtensionIcon}
                                                                />
                                                            </button>
                                                        </Box>
                                                    }

                                                    <Box className={styles.watermark}>
                                                        <Watermark />
                                                    </Box>
                                                    <Dock ref={(ref) => { this.dockRef = ref; }} vm={vm}
                                                    >
                                                    </Dock>
                                                </Box>

                                            </Box>

                                        </TabPanel>
                                        {
                                            isDevice ? null :
                                                <TabPanel className={tabClassNames.tabPanel}>
                                                    {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                                                </TabPanel>
                                        }

                                        {
                                            isDevice ? null :
                                                <TabPanel className={tabClassNames.tabPanel}>
                                                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                                </TabPanel>
                                        }
                                        {
                                            isDevice ?
                                                <TabPanel className={tabClassNames.tabPanel}>
                                                    {
                                                        ccodeTabVisible ?
                                                            <Box className={classNames(styles.editorItemWrapper )}>
                                                                <Box className={styles.codeEditorWrapper}>
                                                                    <MonacoEditor
                                                                        language="cpp"
                                                                        value={this.props.vm.runtime.code}
                                                                        options={codeEditorOptions}
                                                                        theme={'vs-light'}
                                                                        onChange={this.handleCodeChanged}
                                                                    />
                                                                </Box>

                                                            </Box>
                                                            : null
                                                    }

                                                </TabPanel>
                                                : null
                                        }
                                        
                                    </Tabs>
                                    {backpackVisible ? (
                                        <Backpack host={backpackHost} />
                                    ) : null}

                                </Box>

                                <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                                    <StageWrapper
                                        isRendererSupported={isRendererSupported}
                                        isRtl={isRtl}
                                        stageSize={stageSize}
                                        vm={vm}
                                    />
                                    <Box className={styles.targetWrapper}>
                                        <Tabs
                                            forceRenderTabPanel
                                            className={tabClassNames.tabs}
                                            selectedIndex={targetTabIndex}
                                            selectedTabClassName={targetTabClassNames.tabSelected}
                                            selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                            onSelect={tab => {

                                                onTargetTabActivate(tab);
                                                return true;
                                            }}
                                        >
                                            <TabList className={targetTabClassNames.tabList}>
                                                <Tab
                                                    className={targetTabClassNames.tab}
                                                >
                                                    <FormattedMessage
                                                        defaultMessage="Device"
                                                        description="Button to get to the device panel"
                                                        id="gui.gui.deviceTab"
                                                    />
                                                </Tab>
                                                <Tab
                                                    className={targetTabClassNames.tab}
                                                >
                                                    <FormattedMessage
                                                        defaultMessage="Role"
                                                        description="Button to get to the role panel"
                                                        id="gui.gui.roleTab"
                                                    />
                                                </Tab>
                                                {
                                                    stage.id ? (
                                                        <Tab
                                                            className={targetTabClassNames.tab}
                                                        >
                                                            <FormattedMessage
                                                                defaultMessage="Stage"
                                                                description="Button to get to the stage panel"
                                                                id="gui.gui.stageTab"
                                                            />
                                                        </Tab>

                                                    ) : null
                                                }

                                            </TabList>

                                            <TabPanel className={tabClassNames.tabPanel}>
                                                <DevicePane
                                                    stageSize={stageSize}
                                                    vm={vm}
                                                    compiler = {compiler}
                                                />
                                            </TabPanel>
                                            <TabPanel className={tabClassNames.tabPanel}>
                                                <TargetPane
                                                    stageSize={stageSize}
                                                    vm={vm}
                                                />
                                            </TabPanel>
                                            {
                                                stage.id ? (

                                                    <TabPanel className={tabClassNames.tabPanel}>
                                                        {
                                                            <StagePane
                                                                vm={vm}
                                                            />
                                                        }

                                                    </TabPanel>
                                                ) : null
                                            }

                                        </Tabs>

                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        
                        <DragLayer />
                    </Box>
                );
        }}</MediaQuery>);
    }
}

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    ccodeTabVisible:PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAbout: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onSaveConfirm: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: './',
    canChangeLanguage: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    stage: state.scratchGui.targets.stage,
    editingTarget: state.scratchGui.targets.editingTarget,
    editor: state.scratchGui.editorType.editor,
    connectMode: state.scratchGui.deviceConnected.mode
});

const mapDispatchToProps = dispatch => ({
    onEditorSelected: (editor) => dispatch(editorTypeSelect(editor)),
    onCodeChanged: (code) => dispatch(codeChanged(code)),

});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUIComponent));
