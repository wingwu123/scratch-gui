const TARGTE_TAB_ACTIVATE = 'scratch-gui/navigation/TARGTE_TAB_ACTIVATE';

// Constants use numbers to make it easier to work with react-tabs
const DEVICE_TAB_INDEX = 0;
const ROLE_TAB_INDEX = 1;
const STAGE_TAB_INDEX = 2;

const initialState = {
    activeTabIndex: DEVICE_TAB_INDEX
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case TARGTE_TAB_ACTIVATE:
        return Object.assign({}, state, {
            activeTabIndex: action.activeTabIndex
        });
        break;
    default:
        return state;
    }
};

const targetTabActivate = function (tab) {
    return {
        type: TARGTE_TAB_ACTIVATE,
        activeTabIndex: tab
    };
};

export {
    reducer as default,
    initialState as targetTabInitialState,
    targetTabActivate,
    DEVICE_TAB_INDEX,
    ROLE_TAB_INDEX,
    STAGE_TAB_INDEX
};
