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

import layout, { STAGE_SIZE_MODES } from '../../lib/layout-constants';
import { resolveStageSize } from '../../lib/screen-utils';

import styles from './gui.css';
import targetStyles from './target-tab-styles.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';

import EditorSelector from '../editor-selector/editor-selector.jsx'
import MonacoEditor from "react-monaco-editor";

import {
    editorTypeSelect,
    codeChanged,
    BLOCK_EDITOR,
    CODE_EDITOR
} from '../../reducers/editor-type';

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
        ]);

        let defaultCode = [
        '#include "whalesbot.h"',
        'void setup() {',
        '  board_init();',
        '}',
        '',
        'void _setup(){',
        '',
        '}'].join('\n');

        this.state = {code:defaultCode};
        this.handleCodeChanged(defaultCode);
        console.log('handleCodeChanged ---- ');

        console.log('GUI ---- ', '[' +this.props.vm.runtime.code+']');
    }

    handleCodeChanged(code) {
        this.props.vm.runtime.code = code;
    }

    handleResize(event) {
        const size = {width:event.width, height:event.height};
        //console.log("handleResize " + JSON.stringify(size));

        if("dockRef" in this)
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

    componentDidMount() {

        let element = ReactDOM.findDOMNode(this.element);
        DomSize.bind(element, this.handleResize);   

        this.props.vm.runtime.addListener('PROJECT_LOADED', this.onProjectLoaded);
    }

    componentWillUnmount () {
        this.props.vm.runtime.removeListener('PROJECT_LOADED', this.onProjectLoaded);

    }

    onProjectLoaded () {
        if (this.props.vm.runtime.code) {
            
            this.setState({code:this.props.vm.runtime.code});
        }
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
            costumeLibraryVisible,
            costumesTabVisible,
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
            onActivateTab,
            onClickLogo,
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
            compiler,
            vm,
            onEditorSelected,
            onCodeChanged,
            editor,

            ...componentProps
        } = omit(this.props, 'dispatch');
        if (children) {
            return <Box {...componentProps}>{children}</Box>;
        }

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

        let blockEditor = (this.props.editor == BLOCK_EDITOR);

        

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
                        {telemetryModalVisible ? (
                            <TelemetryModal
                                onCancel={onTelemetryModalCancel}
                                onOptIn={onTelemetryModalOptIn}
                                onOptOut={onTelemetryModalOptOut}
                                onRequestClose={onRequestCloseTelemetryModal}
                                onShowPrivacyPolicy={onShowPrivacyPolicy}
                            />
                        ) : null}
                        {loading ? (
                            <Loader />
                        ) : null}
                        {isCreating ? (
                            <Loader messageId="gui.loader.creating" />
                        ) : null}
                        {isRendererSupported ? null : (
                            <WebGlModal isRtl={isRtl} />
                        )}
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
                            onClickLogo={onClickLogo}
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
                                                    src={codeIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Code"
                                                    description="Button to get to the code panel"
                                                    id="gui.gui.codeTab"
                                                />
                                            </Tab>
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
                                        </TabList>
                                        <TabPanel className={tabClassNames.tabPanel} ref={(ref) => {

                                            this.element = ref;
                                        }} onMouseMove={this.handleMouseMove} >
                                            <Box className={styles.blocksWrapper}>
                                                <EditorSelector editor={editor} onSelected={onEditorSelected} />

                                                <Box className={classNames(styles.editorItemWrapper, blockEditor ? null : styles.editorItemWrapperHidden)}>
                                                    <Blocks
                                                        canUseCloud={canUseCloud}
                                                        grow={1}
                                                        isVisible={blocksTabVisible && blockEditor}
                                                        options={{
                                                            media: `${basePath}static/blocks-media/`
                                                        }}
                                                        stageSize={stageSize}
                                                        vm={vm}
                                                    />
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
                                                    <Box className={styles.watermark}>
                                                        <Watermark />
                                                    </Box>
                                                    <Dock ref={(ref) => { this.dockRef = ref; }} vm={vm}
                                                    >
                                                    </Dock>
                                                </Box>
                                                <Box className={classNames(styles.editorItemWrapper, blockEditor ? styles.editorItemWrapperHidden : null)}>
                                                    <Box className={styles.codeEditorWrapper}>
                                                        <MonacoEditor
                                                            language="cpp"
                                                            value={this.state.code}
                                                            options={codeEditorOptions}
                                                            theme={'vs-light'}
                                                            onChange={this.handleCodeChanged}
                                                        />
                                                    </Box>

                                                </Box>
                                            </Box>


                                        </TabPanel>
                                        <TabPanel className={tabClassNames.tabPanel}>
                                            {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                                        </TabPanel>
                                        <TabPanel className={tabClassNames.tabPanel}>
                                            {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                        </TabPanel>
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

                                                console.log('onSelect ' + tab);
                                                onTargetTabActivate(tab);
                                                return true;
                                            }}
                                        >
                                            <TabList className={targetTabClassNames.tabList}>
                                                <Tab
                                                    className={targetTabClassNames.tab}
                                                >
                                                    <img
                                                        draggable={false}
                                                        src={codeIcon}
                                                    />
                                                    <FormattedMessage
                                                        defaultMessage="Device"
                                                        description="Button to get to the device panel"
                                                        id="gui.gui.deviceTab"
                                                    />
                                                </Tab>
                                                <Tab
                                                    className={targetTabClassNames.tab}
                                                >
                                                    <img
                                                        draggable={false}
                                                        src={codeIcon}
                                                    />
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
                                                            <img
                                                                draggable={false}
                                                                src={codeIcon}
                                                            />
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
    canSave: true,
    canCreateCopy: true,
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
    editor: state.scratchGui.editorType.editor
});

const mapDispatchToProps = dispatch => ({
    onEditorSelected: (editor) => dispatch(editorTypeSelect(editor)),
    onCodeChanged: (code) => dispatch(codeChanged(code)),
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUIComponent));
